# Development and tests

The app uses plain HTML, CSS, and JavaScript. It has no runtime package dependencies, build step, backend, or API key.

## Run locally

```bash
git clone https://github.com/Namitesh07/phishing-email-analyser.git
cd phishing-email-analyser
```

Open `index.html` in a modern browser.

## Run regression tests

Install Node.js, then run:

```bash
node tests/analyser.test.js
```

The tests cover legitimate rich-email handling, quoted-printable and base64 MIME behavior, coverage reporting, report redaction, oversized/webmail-source guardrails, hidden-link handling, and fictional practice cases.

For repository history and current changes, see [GitHub commits](https://github.com/Namitesh07/phishing-email-analyser/commits/main).
