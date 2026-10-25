<div align="center">

![Phishing Email Analyser — Email triage. Evidence, with context.](assets/readme-banner.svg)

# Phishing Email Analyser

**Review the warning signs. Understand the evidence. Verify independently.**

[**Open the live demo ↗**](https://namitesh07.github.io/phishing-email-analyser/) · [How to use it](docs/inputs.md) · [Scoring rules](docs/scoring-rules.md) · [Project limits](docs/limitations.md)

[![Local analysis](assets/badge-local.svg)](docs/privacy.md)
[![Explainable scoring](assets/badge-rules.svg)](docs/scoring-rules.md)
[![Input guide](assets/badge-inputs.svg)](docs/inputs.md)
[![Technology](assets/badge-stack.svg)](docs/development.md)

</div>

---

A browser-based email triage tool for learning and safer decision-making. Inspect visible social-engineering clues, review the rules behind each score, and see what evidence the analyser could—and could not—inspect.

> **Your email stays in your browser.** The analyser does not upload email content, open links, render pasted HTML, or inspect attachments.

## What you can do

| Investigate | Understand | Share carefully |
| --- | --- | --- |
| Review message text, captured link destinations, and supplied headers. | See the fixed scoring rules, evidence behind findings, and assessment coverage. | Copy or download a summary or a redacted full evidence report. |

### Evidence the analyser can review

- **Message clues:** urgency, threats, credential requests, payment language, impersonation, and risky attachment names.
- **Link deception:** lookalike domains, punycode, misleading subdomains, raw IPs, shorteners, plain HTTP, unusual ports, `@` URL tricks, hidden characters, and visible-text/destination mismatches.
- **Supplied headers:** From/Reply-To mismatches, configured brand/sender mismatches, and SPF, DKIM, or DMARC results when present in pasted headers.
- **Coverage notes:** shows whether message text, rich/source content, links, and recognised headers were available. A low score with limited evidence is not proof of safety.

**Input modes:** visible email text · copied rich email · raw email source. See the [input guide](docs/inputs.md) for safe copying instructions and supported source formats.

## Start in four steps

1. **Open the [live demo](https://namitesh07.github.io/phishing-email-analyser/)** or run the app locally.
2. **Paste evidence** from the message itself: visible text, copied rich email, or raw email source.
3. **Review the result:** score, triggered rules, link/header evidence, and coverage.
4. **Verify outside the message** using an organisation’s official website, app, or a contact method you already trust.

> [!TIP]
> For Gmail, use **More → Show original** to copy the email’s message source. The browser’s **View Page Source** for your inbox is the webmail interface, not the email, and is rejected with guidance.

<details>
<summary><strong>Prefer to run it locally?</strong></summary>

No build step or package installation is needed:

```bash
git clone https://github.com/Namitesh07/phishing-email-analyser.git
cd phishing-email-analyser
```

Open `index.html` in a modern browser. To run the regression checks, install Node.js and use:

```bash
node tests/analyser.test.js
```

See [local development and tests](docs/development.md).

</details>

## Read the score in context

The 0–100 score adds fixed points for detected rules and is capped at 100. It is a **triage signal, not a probability or a verdict** that an email is legitimate or malicious.

| Score | Label |
| --- | --- |
| 0–19 | Low risk |
| 20–59 | Suspicious |
| 60–100 | High risk |

Coverage describes the evidence available during that assessment: **Limited**, **Partial**, or **Expanded**. Missing headers, links, images, or attachment contents can leave important context out. Read [how scoring works](docs/scoring-rules.md) and [known limitations](docs/limitations.md).

## Explore further

| Use the analyser | Understand the result | Project details |
| --- | --- | --- |
| [Inputs and safe copying](docs/inputs.md) | [Scoring rules and score bands](docs/scoring-rules.md) | [Privacy by design](docs/privacy.md) |
| [Reports and redaction](docs/reports.md) | [Coverage and evidence gaps](docs/limitations.md#assessment-coverage) | [Development and tests](docs/development.md) |

## Privacy by design

- Email analysis happens in the visitor’s browser. Email content is not uploaded or saved by the app.
- No backend, account, analytics, telemetry, AI service, external API, or tracking is used for analysis.
- Copied HTML and raw source are treated as text; the analyser does not execute them or load remote images.
- Extracted links are shown as text and are never visited. Attachments are not opened.
- Only display preferences are stored locally in the browser.

More detail: [privacy notes](docs/privacy.md) · [report contents and redaction](docs/reports.md).

## Read findings with care

This is an educational triage tool. A legitimate email may trigger a rule, and a malicious email may not contain clues the analyser recognises. It does not prove sender identity, verify authentication cryptographically, inspect attachment contents, or check live link reputation. Confirm important requests using a channel you already trust.

Never click a suspicious link, open an unexpected attachment, or share passwords, recovery codes, or MFA/OTP codes in response to an email.

---

<div align="center">

Created by **[Namitesh Pandey](https://github.com/Namitesh07)** · Cybersecurity learning and portfolio project

**Use the evidence. Keep the human in the loop.**

<sub>Shared for portfolio and educational viewing. No licence is granted at this time.</sub>

</div>
