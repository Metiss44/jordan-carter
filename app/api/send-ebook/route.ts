import { NextResponse } from 'next/server';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ ok: false, error: 'Invalid request' }, { status: 400 });
    }
    const { email, firstName } = body;
    if (typeof email !== 'string' || email.length > 254
      || !/^[^\s@<>,;"']+@[^\s@<>,;"']+\.[^\s@<>,;"']+$/.test(email)
      || (firstName !== undefined && (typeof firstName !== 'string' || firstName.length > 120))) {
      return NextResponse.json({ ok: false, error: 'Missing email' }, { status: 400 });
    }

    const ebookUrl = process.env.EBOOK_URL
      || `${(process.env.NEXT_PUBLIC_BASE_URL || 'https://the-body-healer.com').replace(/\/$/, '')}/ebook.pdf`;
    const apiKey = process.env.RESEND_API_KEY;
    const makeWebhook = process.env.MAKE_WEBHOOK_URL;
    if (!apiKey || !makeWebhook) {
      return NextResponse.json({ ok: false, error: 'Service temporairement indisponible.' }, { status: 503 });
    }

    const payload = {
      from: 'Jordan <jordan@the-body-healer.com>',
      to: email,
      subject: 'Ton e-book — The Body Healer',
      html: `<p>Bonjour ${escapeHtml(firstName || '')},</p>
             <p>Merci pour ton inscription — tu peux télécharger ton e‑book ici :</p>
             <p><a href="${escapeHtml(ebookUrl)}" target="_blank" rel="noopener noreferrer">Télécharger l'e‑book The Body Healer (PDF)</a></p>
             <p>Si tu n'as pas demandé cet e‑mail, ignore ce message.</p>
             <p>Avec bienveillance,<br/>Jordan</p>`
    };

    // Preserve the existing order: capture the subscriber before sending the email.
    try {
      const makeResp = await fetch(makeWebhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName: firstName || null,
          ebookUrl,
          sentAt: new Date().toISOString(),
          source: 'website'
        }),
      });
      if (!makeResp.ok) {
        console.error('Make webhook returned non-OK status', makeResp.status);
      }
    } catch {
      console.error('Make webhook failed');
    }

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      console.error('Resend error status:', resp.status);
      return NextResponse.json({ ok: false, error: 'Resend error' }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Erreur interne du serveur' }, { status: 500 });
  }
}
