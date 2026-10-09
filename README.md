# Phishing Email Analyser

[Open the live demo](https://namitesh07.github.io/phishing-email-analyser/)

A privacy-first, educational phishing-email triage tool. It records visible warning signs, explains the fixed points behind its risk score, and helps users decide what to verify independently.

> This tool is an educational aid, not a verdict that an email is safe or malicious.

## Why I built it

Phishing analysis should be understandable and privacy-conscious. Rather than sending a message to an opaque service, this project keeps analysis in the browser and shows the evidence behind every result.

## Features

- **Explainable risk score** from 0–100, classified as Low Risk, Suspicious, or High Risk.
- **Fixed, visible rules** for urgency, threats, credential requests, payment scams, business-email fraud, suspicious links, impersonation language, and risky attachment names.
- **Rich-email paste capture:** when a browser provides copied HTML, the analyser extracts link destinations from it as inert data. It never renders the HTML or opens a link.
- **Raw email source mode:** accepts copied message source, decodes quoted-printable body data before reading links and text, separates headers and message body, and skips scripts, page metadata, and hidden sections as email evidence. Base64-encoded MIME body content is excluded from scoring and shown as an incomplete-coverage warning; paste the visible message text for a fuller assessment.
- **Input guardrails:** full webmail page source is rejected with Gmail-specific guidance instead of being scored, and inputs over 1,000,000 characters are stopped to avoid misleading results and slow analysis.
- **Assessment coverage:** clearly reports whether message text, rich/source data, link destinations, and recognised headers were available. A plain-text-only result is labelled **Limited evidence** so a low score is not mistaken for proof of safety.
- **Header checks** for From/Reply-To domain mismatches, configured recognised-brand sender mismatches, and SPF, DKIM, and DMARC results when pasted headers contain them.
- **Advanced link-deception checks** for raw IP addresses, shorteners, plain HTTP, unusual ports, `@` tricks, punycode, lookalike patterns, brand names embedded in unrelated domains, and visible-link/destination mismatches.
- **Hidden-character detection** for zero-width and direction-changing characters that can disguise words, addresses, or filenames.
- **Why this score?** category breakdown with accessible progress bars.
- **Two local report modes:** a Shareable Summary without link or header details, and a Full Evidence Report with host-level link evidence and redaction. Both include assessment coverage and omit the full pasted body; the Full Evidence Report may include short matching text excerpts. URL paths, query parameters, and fragments are redacted.
- **Accessibility controls** for larger text and high contrast, saved only in the visitor’s browser.
- **Six fictional practice cases** using non-working `.example` domains or reserved test IP addresses.

## Privacy by design

All analysis takes place in the visitor’s browser.

- No email content is uploaded or sent to a server.
- No backend, database, user accounts, analytics, telemetry, AI provider, external API, or tracking is used.
- Rich HTML and raw source are treated as text for inspection only; they are never rendered, executed, or used to load remote images.
- The app never visits extracted links or opens attachments.
- Display preferences are the only values saved locally in the browser. Pasted email content is not saved.

## Understanding coverage

The score only reflects evidence that was actually available to inspect.

| Coverage state | Meaning |
| --- | --- |
| **Limited evidence** | Only visible text, or otherwise incomplete evidence, was available. A low score does not confirm safety. |
| **Partial evidence** | Some link or header information was available, but important context is still missing. |
| **Expanded evidence** | Visible message text was available together with recognised headers or rich-email data. Attachments and images remain uninspected by design. |

For important messages, verify independently through the organisation’s official website, app, or a contact method you already trust.

## What the analyser does not do

- It does not prove an email is safe or malicious.
- It does not inspect attachment contents, images, external reputation data, or a sender’s mailbox.
- It does not decode base64-encoded MIME body parts; these are excluded from scoring and reported as incomplete coverage.
- It does not replace an organisation’s security process or an email provider’s phishing-report option.

## Technology

- HTML
- CSS
- Vanilla JavaScript

No framework, dependency, backend, package installation, or API key is required. The project can be hosted as a static site, including GitHub Pages.

## Run locally

1. Download or clone this repository.
2. Open `index.html` in a modern browser.
3. Paste a fictional practice case or a suspicious email **without clicking its links or opening attachments**.
4. Use **Raw email source** for the message source itself, such as Gmail’s **More → Show original** view. Do not paste your browser’s full “View Page Source” for the inbox; it contains the mail interface, not just the email.

## Run regression checks

The app has no runtime dependencies. If Node.js is installed, run the focused analyzer regression suite with:

```sh
node tests/analyser.test.js
```

## Safety note

Never use this project to test a suspicious link or attachment. Do not reply with passwords, recovery codes, or MFA/OTP codes. Preserve the original message and report it through your email provider or organisation when appropriate.

## Usage

This repository is shared for portfolio and educational viewing. No licence is granted at this time.
