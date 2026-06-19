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

const NOMINATION_LABELS: Record<string, string> = {
  ai:     "AI Adoption",
  cowork: "Best Coworking Space",
  bank:   "Best Digital Bank",
  edu:    "Best IT Education Project",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log("[award] →", req.method, new Date().toISOString());

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Check if award registration is open
  try {
    const { data: setting } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", "award_registration_open")
      .single();
    if (setting?.value === "false") {
      console.log("[award] Registration is closed");
      return res.status(403).json({ error: "registration_closed" });
    }
  } catch (err) {
    console.warn("[award] Could not check registration status (non-fatal):", err);
  }

  const {
    full_name, email, phone, nomination,
    project_name, project_description, questionnaire, language, user_agent,
  } = req.body ?? {};

  if (!full_name || !email || !phone || !nomination) {
    console.warn("[award] Missing fields:", { full_name: !!full_name, email: !!email, phone: !!phone, nomination: !!nomination });
    return res.status(400).json({ error: "Missing required fields" });
  }

  console.log("[award] New application:", email.trim(), "nomination:", nomination);

  const { data: inserted, error } = await supabase
    .from("award_applications")
    .insert({
      full_name:           full_name.trim(),
      email:               email.trim(),
      phone:               phone.trim(),
      nomination:          nomination,
      project_name:        project_name?.trim() || null,
      project_description: project_description?.trim() || null,
      questionnaire:       questionnaire ?? null,
      language:            language ?? "ru",
      user_agent:          user_agent ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[award] Supabase insert error:", error.code, error.message);
    return res.status(500).json({ error: error.message });
  }

  console.log("[award] Saved to DB ✓, sending email to:", email.trim());

  const recipient = email.trim();
  const subject = "Заявка на КИТ Премию 2026 получена";

  try {
    await transporter.sendMail({
      from: `"КИТ Форум 2026" <${process.env.SMTP_USER}>`,
      to: recipient,
      subject,
      html: awardEmail(full_name.trim(), nomination, project_name?.trim()),
    });
    console.log("[award] Email sent ✓ to:", recipient);

    await logEmail({ recipient, subject, status: "sent", relatedId: inserted.id });

    // Auto-update status to "reviewing" after successful email
    await supabase
      .from("award_applications")
      .update({ status: "reviewing" })
      .eq("id", inserted.id);
    console.log("[award] Status → reviewing ✓");
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[award] Email FAILED:", msg);
    await logEmail({ recipient, subject, status: "failed", error: msg, relatedId: inserted.id });
  }

  return res.status(200).json({ ok: true });
}

async function logEmail(entry: {
  recipient: string;
  subject: string;
  status: "sent" | "failed";
  error?: string;
  relatedId?: string;
}) {
  try {
    await supabase.from("email_logs").insert({
      kind: "award",
      recipient: entry.recipient,
      subject: entry.subject,
      status: entry.status,
      error: entry.error ?? null,
      related_id: entry.relatedId ?? null,
    });
  } catch (err) {
    // Logging must never break the request flow.
    console.warn("[award] email_logs insert failed (non-fatal):", err);
  }
}

function awardEmail(name: string, nomination: string, projectName?: string): string {
  const nomLabel = NOMINATION_LABELS[nomination] ?? nomination;
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Заявка получена</title>
</head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #E8ECF2;">
        <!-- Header -->
        <tr>
          <td style="background:#0A1628;padding:32px 40px;">
            <p style="margin:0;font-size:13px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#0066FF;">КИТ ПРЕМИЯ 2026</p>
            <h1 style="margin:8px 0 0;font-size:22px;font-weight:700;color:#ffffff;line-height:1.3;">Заявка получена</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <p style="margin:0 0 20px;font-size:15px;color:#0A1628;">Уважаемый(ая) <strong>${name}</strong>,</p>
            <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#3D4F6B;">
              Ваша заявка на <strong>КИТ Премию 2026</strong> успешно получена. Наша команда рассмотрит её и свяжется с вами.
            </p>

            <!-- Application card -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F7FA;border-radius:12px;margin-bottom:28px;">
              <tr>
                <td style="padding:24px 28px;">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-bottom:14px;border-bottom:1px solid #E8ECF2;">
                        <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#8A99B3;">НОМИНАЦИЯ</p>
                        <p style="margin:6px 0 0;font-size:15px;font-weight:600;color:#0066FF;">${nomLabel}</p>
                      </td>
                    </tr>
                    ${projectName ? `<tr>
                      <td style="padding-top:14px;">
                        <p style="margin:0;font-size:11px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:#8A99B3;">ПРОЕКТ</p>
                        <p style="margin:6px 0 0;font-size:15px;font-weight:600;color:#0A1628;">${projectName}</p>
                      </td>
                    </tr>` : ""}
                  </table>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 28px;font-size:15px;line-height:1.6;color:#3D4F6B;">
              Если у вас возникнут вопросы по заявке, напишите нам:
            </p>

            <p style="margin:0;font-size:13px;color:#8A99B3;">Контакт:</p>
            <p style="margin:4px 0 0;font-size:13px;color:#0066FF;">events@htp.kg</p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;border-top:1px solid #E8ECF2;background:#F9FAFB;">
            <p style="margin:0;font-size:12px;color:#8A99B3;line-height:1.6;">
              КИТ Форум 2026 · Организатор: Парк высоких технологий КР<br/>
              Бишкек, ул. Льва Толстого, 17А/1
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
