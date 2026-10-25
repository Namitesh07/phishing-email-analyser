# Limitations and responsible use

The Phishing Email Analyser is an educational triage aid. It highlights clues that deserve a closer look; it does not decide whether an email is genuine or malicious.

## Assessment coverage

Results depend on the evidence you provide. Visible text alone may omit sender headers and real link targets. Some MIME content may be unsupported, and incomplete coverage can hide relevant clues. A low score with limited evidence does not prove safety.

The analyser does not inspect attachment contents or image-based text, visit links, or query external sender/domain reputation services. Base64-encoded MIME body parts are excluded from scoring and lower coverage.

## Sender checks

Header checks evaluate text supplied with the email. They do not cryptographically verify the sender, independently validate SPF/DKIM/DMARC, or contact the sending provider. Brand/domain rules are heuristics and can produce false positives or miss unfamiliar brands.

## How to act

- Treat the score as a prompt to inspect, not a verdict or probability.
- Confirm payment, password, and urgent requests through an official app/site or a known phone number.
- Do not click suspicious links, open unexpected attachments, or share passwords, recovery codes, or MFA/OTP codes.
- Use your email provider’s report-phishing option or your organisation’s security process where appropriate.

See [scoring and coverage definitions](scoring-rules.md) and [supported inputs](inputs.md).
