# Inputs and safe copying

The analyser accepts three kinds of evidence. Use the email message itself, not your inbox page or a browser-rendered mail view source.

| Input | Best for | Notes |
| --- | --- | --- |
| **Visible message text** | A quick first-pass review | Does not include hidden link destinations or sender headers unless you paste them too. Coverage will reflect the missing evidence. |
| **Copied rich email** | Messages copied from a browser or email client with formatting | When HTML is available from the clipboard, the analyser extracts destinations as text. It never renders or executes the HTML. |
| **Raw email source** | Headers, MIME information, and message body | In Gmail, open **More → Show original**. Do not use the browser’s **View Page Source** on your inbox. |

## Source handling

- Quoted-printable message content is decoded before link and text checks.
- Base64-encoded MIME body parts are excluded from scoring and flagged as incomplete coverage.
- Full webmail page source is rejected with instructions because it contains the mail application rather than only the email.
- Inputs above 1,000,000 characters are stopped to avoid slow or misleading analysis.
- Attachments and remote images are never opened or inspected.

## Safer workflow

1. Keep the original email in your inbox; do not forward sensitive content to an unfamiliar service.
2. Copy the message text or raw source without clicking links or opening attachments.
3. Review the findings and coverage before drawing conclusions.
4. Confirm urgent requests using a contact method you already trust.

See also: [assessment coverage and limits](limitations.md#assessment-coverage) · [privacy by design](privacy.md).
