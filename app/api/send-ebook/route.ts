import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { email, firstName } = await request.json();
    if (!email) {
      return NextResponse.json({ ok: false, error: 'Missing email' }, { status: 400 });
    }

    // Determine base URL (use NEXT_PUBLIC_BASE_URL or request origin)
    const origin = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin;
    const ebookUrl = `${origin.replace(/\/$/, '')}/ebook.pdf`;

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

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message || 'Unknown error' }, { status: 500 });
  }
}
