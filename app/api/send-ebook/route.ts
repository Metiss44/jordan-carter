import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json();
    if (!email) {
      return NextResponse.json({ ok: false, error: 'Missing email' }, { status: 400 });
    }

    // Determine e-book URL:
    // Priority: EBOOK_URL env var (allows CDN link), then NEXT_PUBLIC_BASE_URL + /ebook.pdf, then request origin
    const ebookUrl = process.env.EBOOK_URL
      || `${(process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin).replace(/\/$/, '')}/ebook.pdf`;

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: false, error: 'Server misconfiguration: RESEND_API_KEY not set' }, { status: 500 });
    }

    const payload = {
      from: 'Jordan <jordan@the-body-healer.com>',
      to: email,
      subject: 'Ton e-book — The Body Healer',
      html: `<p>Bonjour ${firstName || ''},</p>
             <p>Merci pour ton inscription — tu peux télécharger ton e‑book ici :</p>
             <p><a href="${ebookUrl}" target="_blank" rel="noopener noreferrer">Télécharger l'e‑book The Body Healer (PDF)</a></p>
             <p>Si tu n'as pas demandé cet e‑mail, ignore ce message.</p>
             <p>Avec bienveillance,<br/>Jordan</p>`
    };

    // Log incoming request for debugging
    // eslint-disable-next-line no-console
    console.log('send-ebook route called for', email);

    // First: Notify Make/Webhook so subscribers are captured even if Resend fails.
    try {
      const makeWebhook = process.env.MAKE_WEBHOOK_URL || 'https://hook.eu2.make.com/1ooouqzlc2g92iv9ta0nv9d5g361cby8';
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
        const makeText = await makeResp.text().catch(() => '[unreadable body]');
        // eslint-disable-next-line no-console
        console.error('Make webhook returned non-OK status', makeResp.status, makeText);
      } else {
        // eslint-disable-next-line no-console
        console.log('Make webhook delivered, status', makeResp.status);
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Make webhook failed:', err);
    }

    // Then: send email via Resend
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const text = await resp.text();
      // eslint-disable-next-line no-console
      console.error('Resend error:', resp.status, text);
      return NextResponse.json({ ok: false, error: 'Resend error', detail: text }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
