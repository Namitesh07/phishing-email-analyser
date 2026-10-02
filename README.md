# Phishing Email Analyser

[Open the live demo](https://namitesh07.github.io/phishing-email-analyser/)

A privacy-first, educational phishing-email triage tool. Paste the text of a suspicious email and the analyser highlights visible warning signs, explains their fixed point values, and suggests safe next steps.

> This is an educational triage tool, not a verdict that an email is safe or malicious.

## Why I built it

Phishing detection should be understandable. Instead of producing a mysterious score, this project shows the evidence behind every result and keeps private email content on the visitor's own device.

## Features

- Gives an explainable phishing-risk score from 0–100.
- Classifies messages as Low Risk, Suspicious, or High Risk.
- Explains each detected indicator and its fixed point value.
- Checks for common social-engineering techniques, including urgency, account threats, credential requests, payment requests, suspicious links, impersonation language, and risky attachments.
- Reads pasted email headers when available, including From/Reply-To differences and SPF, DKIM, and DMARC failures.
- Shows extracted URLs as non-clickable, plain-text evidence with the configured technical warning signs.
- Summarises pasted sender and authentication headers in a dedicated Header checks panel.
- Includes six fictional, safe practice emails for learning.
- Provides practical recommendations without opening links or attachments.
- Copies or downloads a local assessment report without including the pasted email body.

## Privacy by design

All analysis happens locally in the browser using plain JavaScript.

- No email content is uploaded.
- No database, accounts, tracking, telemetry, AI service, or external API is used.
- The site can be hosted as a completely static website.
- Downloaded reports are generated locally and omit the pasted message body by default.

## Technology

- HTML
- CSS
- Vanilla JavaScript

No framework, backend, package installation, or API key is required.

## Running it locally

1. Download or clone this repository.
2. Open `index.html` in a modern web browser.
3. Paste one of the fictional examples or a suspicious email *without clicking its links or opening attachments*.

## What I learned

- How phishing and social-engineering indicators can be expressed as transparent rules.
- Why SPF, DKIM, DMARC, and sender/header mismatches are useful clues rather than definitive proof.
- How to design an educational cybersecurity tool that protects privacy by default.
- How to build and deploy a responsive static web application with no backend.

## Safety note

Never use this tool to test a suspicious link or attachment. Verify important messages through an organisation's official website, application, or a contact method you already trust.

## Usage

This repository is shared for portfolio and educational viewing. No licence is granted at this time.
