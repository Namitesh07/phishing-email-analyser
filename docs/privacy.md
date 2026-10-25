# Privacy by design

The analyser is a static browser app. Message analysis is performed in the visitor’s browser; it has no service that receives email content.

## What the app does

- Processes pasted message text, copied rich-email data, or raw message source locally in the browser.
- Treats HTML and raw source as text for inspection. It does not render pasted HTML or fetch remote images.
- Displays extracted URLs without visiting them.
- Stores only display preferences locally in the browser. Email content and assessment reports are not automatically saved.

## What the app does not use

There is no backend, account system, database, analytics, telemetry, AI provider, external analysis API, or tracking in the analyser.

Reports are created on demand in the browser and copied or downloaded only when the user chooses. See [report contents and redaction](reports.md).

## Use care with sensitive mail

The app does not upload your email, but the browser and device remain under your control. Avoid using shared devices for sensitive messages, and close the page when finished. For critical requests, independently verify with the organisation through a known channel.

See also: [safe input guidance](inputs.md) · [known limitations](limitations.md).
