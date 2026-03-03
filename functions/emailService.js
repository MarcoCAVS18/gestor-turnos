// functions/emailService.js
//
// Sends transactional emails via Resend (https://resend.com).
// Uses Node 20's native fetch — no extra npm package needed.
// Templates are HTML files in ./email-templates/ with %PLACEHOLDER% vars.

const fs = require('fs');
const path = require('path');

const FROM = 'Orary <noreply@orary.app>';
const TEMPLATES_DIR = path.join(__dirname, 'email-templates');

// ── Template loader ───────────────────────────────────────────────────────────

const templateCache = {};

const loadTemplate = (filename) => {
  if (templateCache[filename]) return templateCache[filename];
  const filePath = path.join(TEMPLATES_DIR, filename);
  const html = fs.readFileSync(filePath, 'utf8');
  templateCache[filename] = html;
  return html;
};

/**
 * Replace all %KEY% placeholders in the template with the provided values.
 * @param {string} html
 * @param {Record<string, string>} vars
 */
const fillTemplate = (html, vars) => {
  return Object.entries(vars).reduce((result, [key, value]) => {
    return result.split(`%${key}%`).join(value ?? '');
  }, html);
};

// ── Core sender ───────────────────────────────────────────────────────────────

/**
 * Send an HTML email via Resend REST API.
 * @param {{ to: string, subject: string, html: string }} options
 */
const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured.');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM, to: [to], subject, html }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => String(response.status));
    throw new Error(`Resend error ${response.status}: ${errorText}`);
  }

  return response.json();
};

// ── Email helpers ─────────────────────────────────────────────────────────────

/**
 * Send email verification email.
 * @param {{ email: string, displayName: string, link: string }} params
 */
const sendVerificationEmail = async ({ email, displayName, link }) => {
  const html = fillTemplate(loadTemplate('email-verification.html'), {
    EMAIL: email,
    DISPLAY_NAME: displayName || 'there',
    LINK: link,
  });
  return sendEmail({
    to: email,
    subject: 'Verify your email address – Orary',
    html,
  });
};

/**
 * Send password reset email.
 * @param {{ email: string, link: string }} params
 */
const sendPasswordResetEmail = async ({ email, link }) => {
  const html = fillTemplate(loadTemplate('password-reset.html'), {
    EMAIL: email,
    LINK: link,
  });
  return sendEmail({
    to: email,
    subject: 'Reset your password – Orary',
    html,
  });
};

/**
 * Send email-change notification (sent to the OLD address).
 * @param {{ oldEmail: string, newEmail: string, displayName: string, link: string }} params
 */
const sendEmailChangeNotification = async ({ oldEmail, newEmail, displayName, link }) => {
  const html = fillTemplate(loadTemplate('email-change.html'), {
    EMAIL: oldEmail,
    NEW_EMAIL: newEmail,
    DISPLAY_NAME: displayName || 'there',
    LINK: link,
  });
  return sendEmail({
    to: oldEmail,
    subject: 'Your Orary email address has been changed',
    html,
  });
};

/**
 * Send MFA enrollment confirmation.
 * @param {{ email: string, displayName: string }} params
 */
const sendMFAEnrollmentNotification = async ({ email, displayName }) => {
  const html = fillTemplate(loadTemplate('mfa-enrollment.html'), {
    EMAIL: email,
    DISPLAY_NAME: displayName || 'there',
  });
  return sendEmail({
    to: email,
    subject: 'Two-factor authentication enabled – Orary',
    html,
  });
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendEmailChangeNotification,
  sendMFAEnrollmentNotification,
};
