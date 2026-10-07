"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const sandbox = {
  URL,
  window: {},
  document: { addEventListener() {} }
};
vm.runInNewContext(source, sandbox, { filename: "app.js" });
const analyser = sandbox.window.phishingEmailAnalyser;

test("legitimate Google message HTML ignores scripts, head metadata, and hidden text", () => {
  const rawMessage = [
    "From: Google <no-reply@google.com>",
    "To: user@gmail.com",
    "Subject: Google Account security alert",
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "",
    "<!doctype html><html><head><title>Google account</title>",
    "<script>var banner = 'Urgent: your account will be suspended today';</script>",
    "</head><body>",
    "<p>We noticed a sign-in to your account. If this was you, no action is needed.</p>",
    "<p>If this was not you, review this activity.</p>",
    "<div style=\"display:none\">Urgent: your account is suspended.</div>",
    "<a href=\"https://myaccount.google.com/security\">Review account security</a>",
    "</body></html>"
  ].join("\n");

  const result = analyser.analyseEmail({ text: rawMessage, html: rawMessage, source: "raw-source" });
  assert.equal(result.score, 0);
  assert.deepEqual(Array.from(result.findings, (finding) => finding.id), []);
  assert.equal(result.links.length, 1);
  assert.equal(result.links[0].host, "myaccount.google.com");
});

test("full webmail page source is rejected with safe Gmail instructions", () => {
  const pageSource = "<!doctype html><html><head><title>Inbox - Gmail</title><script>const shell='gmail menu toolbar';</script></head><body>Inbox</body></html>";
  const message = analyser.validateEvidence({ text: pageSource, html: pageSource, source: "raw-source" });
  assert.match(message, /full webmail page/i);
  assert.match(message, /Show original/);
});

test("inputs larger than the analysis limit are stopped", () => {
  const message = analyser.validateEvidence({ text: "x".repeat(1000001), source: "raw-source" });
  assert.match(message, /1,000,000 characters/);
});

test("rich HTML-only clipboard input can still be analysed", () => {
  const result = analyser.analyseEmail({
    text: "",
    html: "<html><body><p>Your monthly statement is ready.</p><a href=\"https://accounts.google.com/\">Open your account</a></body></html>",
    source: "paste"
  });
  assert.equal(result.coverage.textAvailable, true);
  assert.equal(result.links.length, 1);
});

test("hidden link destinations are excluded while visible links remain inspectable", () => {
  const html = [
    "<html><body>",
    "<div aria-hidden=\"true\"><a href=\"http://198.51.100.25/login\">help</a></div>",
    "<a href=\"https://example.org/account\">https://example.org/account</a>",
    "</body></html>"
  ].join("");
  const result = analyser.analyseEmail({ text: html, html, source: "raw-source" });
  assert.equal(result.links.length, 1);
  assert.equal(result.links[0].host, "example.org");
});

test("fictional practice cases retain their expected classifications", () => {
  const expected = {
    obvious: "high",
    sophisticated: "high",
    microsoft: "high",
    parcel: "suspicious",
    bec: "high",
    legitimate: "low"
  };
  for (const [name, classification] of Object.entries(expected)) {
    assert.equal(analyser.analyseEmail(analyser.examples[name]).classification.key, classification, name);
  }
  assert.ok(analyser.analyseEmail(analyser.examples.obvious).findings.some((finding) => finding.id === "rawIpUrl"));
});
