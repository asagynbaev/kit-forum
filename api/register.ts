import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
);

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[register] →", req.method, new Date().toISOString());

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { full_name, email, phone, organization, language, source, user_agent } = req.body ?? {};

  if (!full_name || !email || !phone || !organization) {
    console.warn("[register] Missing fields:", { full_name: !!full_name, email: !!email, phone: !!phone, organization: !!organization });
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("[register] New registration:", email.trim().toLowerCase());

  // Duplicate check
  try {
    const { data: exists } = await supabase.rpc("is_email_registered", {
      p_email: email.trim().toLowerCase(),
    });
    if (exists === true) {
      console.log("[register] Duplicate email:", email);
      return res.status(409).json({ error: "duplicate" });
    }
  } catch (err) {
    console.warn("[register] RPC check failed (non-fatal):", err);
  }

  // Insert registration, get ID back
  const { data: inserted, error } = await supabase
    .from("forum_registrations")
    .insert({
      full_name: full_name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      organization: organization.trim(),
      language: language ?? "ru",
      source: source ?? "other",
      user_agent: user_agent ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[register] Supabase insert error:", error.code, error.message);
    if (error.code === "23505") return res.status(409).json({ error: "duplicate" });
    return res.status(500).json({ error: error.message });
  }

  console.log("[register] Saved to DB ✓, sending email to:", email.trim().toLowerCase());

  try {
    await transporter.sendMail({
      from: `"КИТ Форум 2026" <${process.env.SMTP_USER}>`,
      to: email.trim().toLowerCase(),
      subject: "Подтверждение регистрации — КИТ Форум 2026",
      html: registrationEmail(full_name.trim()),
    });
    console.log("[register] Email sent ✓ to:", email.trim().toLowerCase());

    // Auto-update status to "contacted" after successful email
    await supabase
      .from("forum_registrations")
      .update({ status: "contacted" })
      .eq("id", inserted.id);
    console.log("[register] Status → contacted ✓");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[register] Email FAILED:", msg);
  }

  return res.status(200).json({ ok: true });
}

function registrationEmail(name: string): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Подтверждение регистрации</title>
</head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E8ECF2;">
        <!-- Header -->
        <tr>
          <td style="background:#0A1628;padding:32px 40px;">
            <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#0066FF;">КИТ ФОРУМ 2026</p>
            <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">Регистрация подтверждена</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px;font-size:15px;color:#0A1628;">Уважаемый(ая) <strong>${name}</strong>,</p>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3D4F6B;">
              Вы успешно зарегистрировались на <strong>КИТ Форум 2026</strong> — флагманское мероприятие цифровой отрасли Кыргызской Республики.
            </p>

            <!-- Event info card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;border-radius:12px;margin-bottom:28px;">
              <tr>
                <td style="padding:24px 28px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom:14px;border-bottom:1px solid #E8ECF2;">
                        <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#8A99B3;">ДАТА</p>
                        <p style="margin:6px 0 0;font-size:15px;font-weight:600;color:#0A1628;">4–5 июня 2026</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding-top:14px;">
                        <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#8A99B3;">МЕСТО</p>
                        <p style="margin:6px 0 0;font-size:15px;font-weight:600;color:#0A1628;">Бишкек, Кыргызская Республика</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#3D4F6B;">
              Ближе к событию вы получите подробную программу и инструкции по участию.
            </p>

            <p style="margin:0;font-size:13px;color:#8A99B3;">По вопросам обращайтесь:</p>
            <p style="margin:4px 0 0;font-size:13px;color:#0066FF;">events@htp.kg</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #E8ECF2;background:#F9FAFB;">
            <p style="margin:0;font-size:12px;color:#8A99B3;line-height:1.6;">
              КИТ Форум 2026 · Организатор: Парк высоких технологий КР<br/>
              Бишкек, ул. Льва Толстого, 1 (17Б)
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
