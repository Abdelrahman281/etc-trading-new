import { Resend } from 'resend';
import { companyInfo } from '@/lib/data';
import { SITE_URL } from '@/lib/seo';
import type { RfqSubmission } from '@/lib/types';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'ETC Website <onboarding@resend.dev>';
const NOTIFY_EMAIL = process.env.RFQ_NOTIFICATION_EMAIL || companyInfo.email;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function sendRfqNotification(rfqId: string, submission: RfqSubmission): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not set - skipping RFQ email notification.');
    return;
  }

  const resend = new Resend(apiKey);

  const itemsHtml = submission.items
    .map(
      (item) =>
        `<li>${escapeHtml(item.product_name)}${item.spec ? ` — ${escapeHtml(item.spec)}` : ''} (qty: ${item.quantity})</li>`
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color: #1e293b;">New Quote Request</h2>
      <p style="color: #475569;">A new RFQ was just submitted on the website.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr><td style="padding: 6px 0; color: #64748b; width: 140px;">Company</td><td style="padding: 6px 0; font-weight: 600;">${escapeHtml(submission.company)}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Contact Person</td><td style="padding: 6px 0;">${escapeHtml(submission.contact_person)}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Phone</td><td style="padding: 6px 0;" dir="ltr">${escapeHtml(submission.phone)}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Email</td><td style="padding: 6px 0;">${escapeHtml(submission.email)}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Category</td><td style="padding: 6px 0;">${escapeHtml(submission.category)}</td></tr>
      </table>
      ${submission.message ? `<p style="color: #475569;"><strong>Message:</strong> ${escapeHtml(submission.message)}</p>` : ''}
      <p style="color: #475569; margin-bottom: 4px;"><strong>Requested Items (${submission.items.length}):</strong></p>
      <ul style="color: #475569;">${itemsHtml}</ul>
      <a href="${SITE_URL}/en/admin/rfq/${rfqId}" style="display: inline-block; margin-top: 16px; padding: 10px 20px; background: #f97316; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600;">View in Admin Panel</a>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New Quote Request from ${submission.company}`,
      html,
    });
    if (error) {
      console.error('Error sending RFQ notification email:', error);
    }
  } catch (err) {
    console.error('Error sending RFQ notification email:', err);
  }
}
