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
      return NextResponse.json({ ok: false, error: 'Resend error', detail: text }, { status: 502 });
    }

    // Notify Make/Webhook (optional) so you can store subscribers in a sheet or trigger automations.
    // The webhook URL can be provided via env var MAKE_WEBHOOK_URL or falls back to the provided Make webhook.
    try {
      const makeWebhook = process.env.MAKE_WEBHOOK_URL || 'https://hook.eu2.make.com/o7gty91n7eg5a3gu2leqifpgmq8vb6ql';
      // fire-and-forget but await to know if it failed (we won't fail the main request because of this)
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

      // Log result for easier debugging in Vercel logs
      if (!makeResp.ok) {
        const makeText = await makeResp.text().catch(() => '[unreadable body]');
        // eslint-disable-next-line no-console
        console.error('Make webhook returned non-OK status', makeResp.status, makeText);
      } else {
        // eslint-disable-next-line no-console
        console.log('Make webhook delivered, status', makeResp.status);
      }
    } catch (err) {
      // don't block the user flow if webhook fails; just log for debugging
      // In Vercel, these logs will appear in the function logs
      // eslint-disable-next-line no-console
      console.error('Make webhook failed:', err);
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
