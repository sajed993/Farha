// ═══ FARHA — email you when a new order arrives (FREE via Resend) ═══
// Setup (one time):
//  1) Create a free account at https://resend.com  (3,000 emails/month free)
//  2) Get an API key → in Netlify: Site settings → Environment variables:
//       RESEND_API_KEY = re_xxxxxxxx
//       OWNER_EMAIL    = your@email.com
//       FROM_EMAIL     = onboarding@resend.dev   (or your verified domain)
//  3) Deploy. That's it — you'll get an email per order.
// If the env vars are missing, this silently does nothing (site still works).

export const handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'no' }
    const key = process.env.RESEND_API_KEY
    const to = process.env.OWNER_EMAIL
    const from = process.env.FROM_EMAIL || 'onboarding@resend.dev'
    if (!key || !to) return { statusCode: 200, body: 'not configured' } // graceful no-op

    const d = JSON.parse(event.body || '{}')
    const name = String(d.name || '').slice(0, 60)
    const item = String(d.item || 'طلب').slice(0, 120)
    const price = String(d.price || '')
    const phone = String(d.phone || '').slice(0, 20)
    const method = String(d.method || '')
    const ref = String(d.ref || '')

    const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:auto;border:1px solid #E2CFA0;border-radius:12px;overflow:hidden">
        <div style="background:linear-gradient(90deg,#9A7325,#C9A24B);color:#fff;padding:16px;font-size:18px;font-weight:bold">🔔 طلب جديد — فرحة</div>
        <div style="padding:16px;color:#3A2B10;line-height:1.8">
          ${name ? `<p><b>الزبون:</b> ${name}</p>` : ''}
          <p><b>المنتج:</b> ${item}</p>
          <p><b>السعر:</b> ${price} د.ت</p>
          <p><b>الهاتف:</b> ${phone}</p>
          ${method ? `<p><b>طريقة الدفع:</b> ${method}</p>` : ''}
          ${ref ? `<p><b>المرجع:</b> ${ref}</p>` : ''}
          <p style="color:#8A7A63;font-size:13px">افتحوا لوحة التحكم لتأكيد الدفع وتسليم الدعوة.</p>
        </div>
      </div>`

    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'Farha <' + from + '>', to: [to], subject: '🔔 طلب جديد' + (name ? ' من ' + name : '') + ': ' + item + ' — ' + price + ' د.ت', html }),
    })
    return { statusCode: r.ok ? 200 : 502, body: r.ok ? 'sent' : 'fail' }
  } catch (e) {
    return { statusCode: 200, body: 'error-ignored' }
  }
}
