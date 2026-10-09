<div align="center">

# Phishing Email Analyser

### Email security triage, with evidence you can inspect.

Review message clues, understand why rules raised them, and choose what to verify next — right in your browser.

[![Open the live demo](https://img.shields.io/badge/Live%20demo-Open%20analyser-1769aa?style=for-the-badge)](https://namitesh07.github.io/phishing-email-analyser/)
![Browser-based](https://img.shields.io/badge/Analysis-Browser--based-168a72?style=for-the-badge)
![No uploads](https://img.shields.io/badge/Email%20content-No%20uploads-5b6472?style=for-the-badge)

**A privacy-first, educational triage tool — not an automated verdict on whether an email is safe.**

[Try the demo](https://namitesh07.github.io/phishing-email-analyser/) · [How it works](#how-to-use-it) · [Privacy](#privacy-by-design) · [Limitations](#know-the-limits)

</div>

---

## The idea

Phishing messages can look convincing, and a single score cannot prove who sent an email. This project helps people **spot and understand warning signs** by applying visible, fixed rules to the evidence they provide.

Analysis runs locally in the browser. The analyser does not upload the email, render pasted HTML, open links, or inspect attachments.

## What it can inspect

| Area | Checks and evidence |
| --- | --- |
| **Message content** | Urgency, threats, credential requests, payment requests, impersonation language, and risky attachment names |
| **Links** | Actual destinations captured from rich email or source; lookalike and punycode patterns, misleading subdomains, raw IPs, shorteners, plain HTTP, unusual ports, `@` tricks, hidden characters, and visible-text/destination mismatches |
| **Headers** | From and Reply-To domain mismatches, configured recognised-brand sender mismatches, and SPF, DKIM, or DMARC results when those headers are included |
| **Evidence coverage** | Shows whether message text, rich/source details, links, and recognised headers were available, so a low score is not mistaken for a clean bill of health |
| **Reports** | Shareable Summary and Full Evidence Report; both include coverage, omit the full message body, and explain what evidence was inspected |

### Built to make the reasoning visible

- **Explainable 0–100 risk score** based on fixed rules, with the rule points and triggered evidence available for review.
- **Why this score?** breakdown groups findings by category and uses accessible progress indicators.
- **Safe rich-email capture** reads copied HTML as inert text to extract link destinations. It never executes or displays that HTML.
- **Raw email source mode** separates headers from the message body and decodes quoted-printable text before checking it. Base64-encoded MIME body parts are excluded from scoring and lower the stated coverage.
- **Input guardrails** reject full webmail page source with guidance and stop inputs over 1,000,000 characters.
- **Six fictional practice cases** use non-working `.example` domains or reserved test IP addresses.
- **Accessibility options** include larger text and high contrast; these preferences stay in the visitor’s browser.

## How to use it

1. Open the [live demo](https://namitesh07.github.io/phishing-email-analyser/) or run the project locally.
2. Paste message text, copied rich-email content, or the email’s raw message source.
3. Review the score, triggered rules, link evidence, and assessment coverage.
4. Verify important requests through the organisation’s official website, app, or a contact method you already trust.

> [!TIP]
> For Gmail, use **More → Show original** to get the email’s message source. The browser’s **View Page Source** for your inbox is the webmail interface, not the email itself, and is rejected with guidance.

## Read the result carefully

The score is a **rule-based triage signal, not a probability** and not proof that an email is legitimate or malicious. It reflects only the clues the analyser could inspect.

| Coverage | What it means |
| --- | --- |
| **Limited evidence** | Only visible text, or otherwise incomplete evidence, was available. A low score does not confirm safety. |
| **Partial evidence** | Some link or header information was available, but important context is missing. |
| **Expanded evidence** | Visible message text was available together with recognised headers or rich-email data. Attachments and images remain uninspected. |

## Privacy by design

- Email content is processed in the browser and is **not uploaded or saved** by the app.
- No backend, database, account, analytics, telemetry, AI service, external API, or tracking is used for analysis.
- Pasted HTML and raw source are treated as text; they are never rendered, executed, or used to load remote images.
- Extracted links are shown for inspection but are never visited. Attachments are never opened.
- Only display preferences are saved locally in the browser.

## Run it locally

No package installation, build step, or API key is needed.

```bash
git clone https://github.com/Namitesh07/phishing-email-analyser.git
cd phishing-email-analyser
```

Open `index.html` in a modern browser. To run the regression checks, install Node.js and run:

```bash
node tests/analyser.test.js
```

## Know the limits

This project is an educational aid for deciding what to inspect next. It does **not**:

- prove that an email is safe, authentic, or malicious;
- cryptographically verify the sender or independently validate SPF, DKIM, or DMARC;
- inspect attachment contents or image-based content;
- decode base64-encoded MIME bodies, or fetch reputation data about links and senders;
- replace your email provider’s reporting tools or your organisation’s security process.

When a message asks for money, credentials, or urgent action, pause and confirm the request through a trusted channel. Do not click suspicious links, open unexpected attachments, or share passwords, recovery codes, or MFA/OTP codes.

## Built with

HTML · CSS · Vanilla JavaScript · Node.js regression tests

No runtime libraries or third-party services are required by the analyser.

---

<div align="center">

Created by **Namitesh Pandey** for learning and portfolio use.

**Use the evidence. Keep the human in the loop.**

</div>

> Repository shared for portfolio and educational viewing. No licence is granted at this time.
