# Scoring rules and coverage

The score is the sum of triggered fixed-point rules, capped at 100. It is a triage signal, **not a probability** and not proof that an email is legitimate or malicious. The app also shows the evidence that triggered each rule and groups point contributions by category.

## Score bands

| Score | Label |
| --- | --- |
| 0–19 | Low risk |
| 20–59 | Suspicious |
| 60–100 | High risk |

A low score is not a safety guarantee. Rules can miss clues, and legitimate messages can match generic warning patterns.

## Rules shown by the analyser

| Category | Example signals | Points |
| --- | --- | --- |
| **Pressure and threats** | Urgent language; account suspension or closure threat | +10; +14 |
| **Credentials** | Password/passcode request; MFA/verification-code request; credential-harvesting language | +20; +20; +14 |
| **Payment** | Payment or transfer; gift card; bank-detail change | +18; +25; +25 |
| **Links** | Suspicious URL pattern; shortened URL; raw IP URL; misleading visible link; brand name in unrelated domain | +12; +15; +25; +20; +18 |
| **Obfuscation and impersonation** | Hidden/direction-changing characters; impersonation-style language | +14; +8 |
| **Attachments and macros** | Unusual filename; executable type; request to enable macros/content | +12; +30; +25 |
| **Business email** | Unexpected invoice language | +10 |
| **Headers** | From/Reply-To mismatch; recognised brand with unexpected From domain; SPF, DKIM, or DMARC failure in supplied headers | +18; +15; +16; +16; +18 |

The live analyser’s **View all scoring rules** panel is the definitive current list. Point values may change as the project is maintained.

## Evidence coverage

Coverage tells you which evidence sources were available. It does not indicate certainty.

| State | Meaning |
| --- | --- |
| **Limited evidence** | The assessment has only visible text or other incomplete evidence. |
| **Partial evidence** | Some link, header, or source evidence was available, but important context is missing. |
| **Expanded evidence** | Visible message text was available together with recognised headers or rich-email data. Attachments and images remain uninspected. |

For details on missing or unsupported evidence, read [assessment limits](limitations.md#assessment-coverage) and [input handling](inputs.md).
