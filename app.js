(function () {
  "use strict";

  var RULES = [
    {
      id: "urgency",
      points: 10,
      category: "Pressure",
      label: "Urgent or high-pressure language",
      explanation: "The message pushes you to act quickly, which can reduce careful checking."
    },
    {
      id: "accountThreat",
      points: 14,
      category: "Threat",
      label: "Threat of account suspension or closure",
      explanation: "The message warns that access will be suspended, closed, disabled, or locked."
    },
    {
      id: "passwordRequest",
      points: 20,
      category: "Credentials",
      label: "Request for a password or passcode",
      explanation: "Legitimate organisations should not ask you to share a password by email."
    },
    {
      id: "mfaRequest",
      points: 20,
      category: "Credentials",
      label: "Request for an MFA or verification code",
      explanation: "Never share one-time verification codes; they can let someone sign in as you."
    },
    {
      id: "paymentRequest",
      points: 18,
      category: "Payment",
      label: "Payment or transfer request",
      explanation: "Unexpected payment pressure is a common social-engineering technique."
    },
    {
      id: "giftCardRequest",
      points: 25,
      category: "Payment",
      label: "Gift-card request",
      explanation: "Gift cards are difficult to recover and are commonly requested in scams."
    },
    {
      id: "bankChange",
      points: 25,
      category: "Payment",
      label: "Request to change bank details",
      explanation: "Payment-detail changes should be independently confirmed using a trusted contact method."
    },
    {
      id: "suspiciousUrl",
      points: 12,
      category: "Link",
      label: "Suspicious URL pattern",
      explanation: "The address has a risky technical pattern such as plain HTTP, a non-standard port, an @ sign, or a lookalike name."
    },
    {
      id: "shortenedUrl",
      points: 15,
      category: "Link",
      label: "Shortened URL",
      explanation: "A shortened address hides the final destination, making it harder to check before visiting."
    },
    {
      id: "rawIpUrl",
      points: 25,
      category: "Link",
      label: "URL using a raw IP address",
      explanation: "A direct IP address can make a destination harder to identify and is unusual for many customer-facing services."
    },
    {
      id: "misleadingLink",
      points: 20,
      category: "Link",
      label: "Misleading visible link text",
      explanation: "The visible URL-like text does not match the actual destination in pasted HTML or Markdown."
    },
    {
      id: "impersonation",
      points: 8,
      category: "Impersonation",
      label: "Impersonation-style language",
      explanation: "The message claims to represent a trusted service, team, executive, or department."
    },
    {
      id: "unusualAttachment",
      points: 12,
      category: "Attachment",
      label: "Unusual attachment filename",
      explanation: "The message names an archive, macro-enabled document, disk image, or web-file attachment."
    },
    {
      id: "executableAttachment",
      points: 30,
      category: "Attachment",
      label: "Executable attachment type",
      explanation: "The message names a file type that can run code or scripts."
    },
    {
      id: "macroRequest",
      points: 25,
      category: "Attachment",
      label: "Request to enable macros or content",
      explanation: "Attackers often ask recipients to enable content so harmful code can run."
    },
    {
      id: "invoiceLanguage",
      points: 10,
      category: "Business email",
      label: "Unexpected invoice language",
      explanation: "Unexpected invoices, remittance notices, or balance requests can be used to rush a payment."
    },
    {
      id: "credentialHarvesting",
      points: 14,
      category: "Credentials",
      label: "Credential-harvesting language",
      explanation: "The message asks you to sign in, reauthenticate, or verify an account to keep access."
    },
    {
      id: "replyToMismatch",
      points: 18,
      category: "Header",
      label: "From and Reply-To domains differ",
      explanation: "A different Reply-To address can redirect replies away from the apparent sender."
    },
    {
      id: "spfFail",
      points: 16,
      category: "Header",
      label: "SPF authentication failure",
      explanation: "The pasted authentication headers report an SPF failure or soft failure."
    },
    {
      id: "dkimFail",
      points: 16,
      category: "Header",
      label: "DKIM authentication failure",
      explanation: "The pasted authentication headers report a DKIM failure."
    },
    {
      id: "dmarcFail",
      points: 18,
      category: "Header",
      label: "DMARC authentication failure",
      explanation: "The pasted authentication headers report a DMARC failure."
    }
  ];

  var RULE_BY_ID = {};
  RULES.forEach(function (rule) {
    RULE_BY_ID[rule.id] = rule;
  });
  var latestResult = null;

  var EXAMPLES = {
    obvious: [
      "From: Account Security <security@account-check.example>",
      "Reply-To: verify@account-check.example>",
      "Subject: URGENT: your account will be suspended",
      "",
      "Dear customer,",
      "",
      "Your account will be closed in 24 hours unless you verify your password immediately.",
      "Use the secure link below and reply with your one-time verification code:",
      "http://198.51.100.24:8080/secure-login",
      "",
      "Attachment: Account_Update.exe",
      "Enable macros if the file asks for permission.",
      "",
      "Account Security Team"
    ].join("\n"),
    sophisticated: [
      "From: Finance Operations <finance@northwind.example>",
      "Reply-To: payments@northwind-billing.example>",
      "Subject: Revised supplier payment instructions",
      "Authentication-Results: mx.northwind.example; spf=fail smtp.mailfrom=northwind.example; dkim=fail; dmarc=fail",
      "",
      "Hello,",
      "",
      "Please note that our bank details have changed for the attached Q4_renewal_invoice.pdf.",
      "Settle the outstanding invoice by wire transfer today to avoid an interruption to service.",
      "Please use the updated beneficiary details below.",
      "",
      "Finance Operations"
    ].join("\n"),
    microsoft: [
      "From: Microsoft 365 Account Team <notice@microsoft365-alerts.example>",
      "Reply-To: security@account-verify.example>",
      "Subject: Immediate action required: Outlook access expires today",
      "",
      "Your Microsoft 365 mailbox is scheduled for closure due to an account policy update.",
      "Sign in now to verify your account and restore access:",
      "https://micros0ft365-login.example/account-verify",
      "",
      "Microsoft 365 Security Team"
    ].join("\n"),
    parcel: [
      "From: Parcel Express <delivery@parcel-service.example>",
      "Subject: Delivery held - action needed today",
      "",
      "We could not deliver your parcel. A small redelivery payment is required today.",
      "Track the parcel and pay the fee here:",
      "https://tinyurl.example/parcel-redelivery",
      "",
      "Parcel Express"
    ].join("\n"),
    bec: [
      "From: Anika Rao, Finance Director <anika@northwind.example>",
      "Reply-To: ar@northwind-payments.example>",
      "Subject: Confidential: updated bank details for invoice 4817",
      "",
      "Hi,",
      "",
      "Please update the beneficiary bank details for our outstanding invoice 4817.",
      "This must be paid by bank transfer today. Do not delay while I am in meetings.",
      "",
      "Anika"
    ].join("\n"),
    legitimate: [
      "From: Learning Club <hello@learners.example>",
      "Reply-To: hello@learners.example>",
      "Subject: Study group reminder for Tuesday",
      "Authentication-Results: mx.learners.example; spf=pass smtp.mailfrom=learners.example; dkim=pass; dmarc=pass",
      "",
      "Hello everyone,",
      "",
      "A reminder that our study group meets in the library at 4:00 PM on Tuesday.",
      "No reply is needed. Please bring your notes.",
      "",
      "Learning Club"
    ].join("\n")
  };

  var SHORTENER_HOSTS = [
    "bit.ly",
    "tinyurl.com",
    "t.co",
    "goo.gl",
    "ow.ly",
    "is.gd",
    "buff.ly",
    "rebrand.ly",
    "tinyurl.example",
    "short.example",
    "lnk.example",
    "short-url.example"
  ];

  var LOOKALIKE_PATTERNS = [
    /micr[o0]s[o0]ft/i,
    /micros0ft/i,
    /paypa[l1]/i,
    /g[o0]{2}g[l1]e/i,
    /g[o0]{1,2}g1e/i,
    /app[l1]e/i,
    /amaz[o0]n/i,
    /docusign[-_]?secure/i
  ];

  function getDom() {
    return {
      input: document.getElementById("emailInput"),
      textareaShell: document.querySelector(".textarea-shell"),
      stats: document.getElementById("messageStats"),
      analyseButton: document.getElementById("analyseButton"),
      clearButton: document.getElementById("clearButton"),
      status: document.getElementById("analysisStatus"),
      emptyState: document.getElementById("emptyState"),
      results: document.getElementById("resultsContent"),
      riskSummary: document.getElementById("riskSummary"),
      riskRing: document.getElementById("riskRing"),
      scoreValue: document.getElementById("scoreValue"),
      riskPill: document.getElementById("riskPill"),
      riskTitle: document.getElementById("riskTitle"),
      riskDescription: document.getElementById("riskDescription"),
      resultCount: document.getElementById("resultCount"),
      scoreFormula: document.getElementById("scoreFormula"),
      rawScoreBadge: document.getElementById("rawScoreBadge"),
      scoreRange: document.getElementById("scoreRange"),
      findings: document.getElementById("findingsList"),
      recommendations: document.getElementById("recommendationsList"),
      linkEvidence: document.getElementById("linkEvidenceList"),
      linkEvidenceCount: document.getElementById("linkEvidenceCount"),
      headerEvidence: document.getElementById("headerEvidenceList"),
      headerEvidenceState: document.getElementById("headerEvidenceState"),
      copyReportButton: document.getElementById("copyReportButton"),
      downloadReportButton: document.getElementById("downloadReportButton"),
      reportStatus: document.getElementById("reportStatus"),
      rulesList: document.getElementById("rulesList")
    };
  }

  function uniqueMatches(text, regexes) {
    var found = [];
    regexes.forEach(function (regex) {
      var cloned = new RegExp(regex.source, regex.flags.indexOf("g") === -1 ? regex.flags + "g" : regex.flags);
      var match;
      while ((match = cloned.exec(text)) !== null) {
        var value = String(match[0]).replace(/\s+/g, " ").trim();
        if (value && found.indexOf(value.toLowerCase()) === -1) {
          found.push(value);
        }
        if (match.index === cloned.lastIndex) {
          cloned.lastIndex += 1;
        }
      }
    });
    return found;
  }

  function quotedTerms(items, limit) {
    var take = items.slice(0, limit || 3).map(function (item) {
      var tidy = item.replace(/\s+/g, " ").trim();
      return "“" + (tidy.length > 54 ? tidy.slice(0, 51) + "…" : tidy) + "”";
    });
    if (items.length > take.length) {
      take.push("and " + (items.length - take.length) + " more");
    }
    return take.join(", ");
  }

  function addFinding(findings, id, detail) {
    if (!RULE_BY_ID[id]) {
      return;
    }
    if (!findings.some(function (finding) { return finding.id === id; })) {
      findings.push({
        id: id,
        rule: RULE_BY_ID[id],
        detail: detail
      });
    }
  }

  function splitEmail(input) {
    var normalized = input.replace(/\r\n?/g, "\n");
    var boundary = normalized.indexOf("\n\n");
    var possibleHeaders = boundary >= 0 ? normalized.slice(0, boundary) : "";
    var hasHeaders = /^(from|to|subject|date|reply-to|return-path|authentication-results|received-spf)\s*:/im.test(possibleHeaders);
    return {
      all: normalized,
      headerText: hasHeaders ? possibleHeaders : "",
      body: hasHeaders ? normalized.slice(boundary + 2) : normalized
    };
  }

  function parseHeaders(headerText) {
    var headers = {};
    if (!headerText) {
      return headers;
    }
    var currentName = "";
    headerText.split("\n").forEach(function (line) {
      if (/^[ \t]/.test(line) && currentName) {
        headers[currentName][headers[currentName].length - 1] += " " + line.trim();
        return;
      }
      var match = line.match(/^([^:\s][^:]{0,80}):\s*(.*)$/);
      if (!match) {
        currentName = "";
        return;
      }
      currentName = match[1].toLowerCase();
      if (!headers[currentName]) {
        headers[currentName] = [];
      }
      headers[currentName].push(match[2].trim());
    });
    return headers;
  }

  function getHeader(headers, name) {
    return headers[name] ? headers[name].join(" ") : "";
  }

  function getAddressDomain(value) {
    if (!value) {
      return "";
    }
    var email = value.match(/[A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,})/i);
    return email ? email[1].toLowerCase().replace(/\.+$/, "") : "";
  }

  function domainsRelated(first, second) {
    if (!first || !second) {
      return true;
    }
    return first === second || first.endsWith("." + second) || second.endsWith("." + first);
  }

  function cleanHost(host) {
    return String(host || "").toLowerCase().replace(/^www\./, "").replace(/\.$/, "");
  }

  function isIpv4(host) {
    var parts = host.split(".");
    if (parts.length !== 4) {
      return false;
    }
    return parts.every(function (part) {
      return /^\d{1,3}$/.test(part) && Number(part) >= 0 && Number(part) <= 255;
    });
  }

  function stripMarkup(value) {
    return String(value || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/\s+/g, " ")
      .trim();
  }

  function toUrl(value) {
    var candidate = String(value || "").trim().replace(/[.,;:!?]+$/, "");
    if (!candidate) {
      return null;
    }
    if (/^www\./i.test(candidate)) {
      candidate = "https://" + candidate;
    }
    try {
      var parsed = new URL(candidate);
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return null;
      }
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function visibleHost(value) {
    var text = stripMarkup(value);
    var match = text.match(/(?:https?:\/\/|www\.)[^\s<>"')\]]+/i);
    var maybeHost = match ? match[0] : text.match(/^[a-z0-9.-]+\.[a-z]{2,}(?:\/|$)/i);
    var parsed = toUrl(maybeHost || "");
    return parsed ? cleanHost(parsed.hostname) : "";
  }

  function extractLinks(text) {
    var results = [];
    var seen = {};

    function add(rawUrl, linkText) {
      var parsed = toUrl(rawUrl);
      if (!parsed) {
        return;
      }
      var key = parsed.href.toLowerCase();
      if (!seen[key]) {
        seen[key] = true;
        results.push({
          raw: rawUrl,
          href: parsed.href,
          host: cleanHost(parsed.hostname),
          port: parsed.port,
          protocol: parsed.protocol,
          username: parsed.username,
          text: linkText || ""
        });
      } else if (linkText) {
        results.some(function (item) {
          if (item.href.toLowerCase() === key && !item.text) {
            item.text = linkText;
            return true;
          }
          return false;
        });
      }
    }

    var anchorPattern = /<a\b[^>]*\bhref\s*=\s*(["'])(.*?)\1[^>]*>([\s\S]*?)<\/a>/gi;
    var anchorMatch;
    while ((anchorMatch = anchorPattern.exec(text)) !== null) {
      add(anchorMatch[2], stripMarkup(anchorMatch[3]));
    }

    var markdownPattern = /\[([^\]]{1,160})\]\((https?:\/\/[^)\s]+)\)/gi;
    var markdownMatch;
    while ((markdownMatch = markdownPattern.exec(text)) !== null) {
      add(markdownMatch[2], markdownMatch[1]);
    }

    var plainPattern = /\b(?:https?:\/\/|www\.)[^\s<>"')\]]+/gi;
    var plainMatch;
    while ((plainMatch = plainPattern.exec(text)) !== null) {
      add(plainMatch[0], "");
    }

    return results;
  }

  function hasLookalike(host) {
    return LOOKALIKE_PATTERNS.some(function (pattern) {
      return pattern.test(host);
    });
  }

  function inspectLink(link) {
    var suspiciousReasons = [];
    var rawIp = isIpv4(link.host) || (link.host.indexOf(":") >= 0 && /^[0-9a-f:]+$/i.test(link.host));

    if (link.protocol === "http:") {
      suspiciousReasons.push("uses plain HTTP");
    }
    if (link.port && link.port !== "80" && link.port !== "443") {
      suspiciousReasons.push("uses a non-standard port");
    }
    if (link.username || link.raw.indexOf("@") >= 0) {
      suspiciousReasons.push("contains an @ sign before the destination");
    }
    if (link.host.indexOf("xn--") === 0 || link.host.indexOf(".xn--") >= 0) {
      suspiciousReasons.push("uses a punycode hostname");
    }
    if (hasLookalike(link.host)) {
      suspiciousReasons.push("looks similar to a well-known brand name");
    }

    var shown = link.text ? visibleHost(link.text) : "";
    return {
      suspiciousReasons: suspiciousReasons,
      shortened: SHORTENER_HOSTS.indexOf(link.host) >= 0,
      rawIp: rawIp,
      misleading: Boolean(shown && !domainsRelated(shown, link.host)),
      shownHost: shown
    };
  }

  function detectLinkWarnings(links, findings) {
    var suspiciousHosts = [];
    var shortenedHosts = [];
    var ipHosts = [];
    var mismatches = [];

    links.forEach(function (link) {
      var inspection = inspectLink(link);
      if (inspection.suspiciousReasons.length) {
        suspiciousHosts.push(link.host + " (" + inspection.suspiciousReasons.join("; ") + ")");
      }
      if (inspection.shortened) {
        shortenedHosts.push(link.host);
      }
      if (inspection.rawIp) {
        ipHosts.push(link.host);
      }
      if (inspection.misleading) {
        mismatches.push("shown as " + inspection.shownHost + " but points to " + link.host);
      }
    });

    if (suspiciousHosts.length) {
      addFinding(findings, "suspiciousUrl", "Detected: " + quotedTerms(suspiciousHosts, 2) + ".");
    }
    if (shortenedHosts.length) {
      addFinding(findings, "shortenedUrl", "Detected shortener-like address: " + quotedTerms(shortenedHosts, 3) + ".");
    }
    if (ipHosts.length) {
      addFinding(findings, "rawIpUrl", "Detected raw IP address: " + quotedTerms(ipHosts, 2) + ".");
    }
    if (mismatches.length) {
      addFinding(findings, "misleadingLink", "Detected: " + quotedTerms(mismatches, 2) + ".");
    }
  }

  function detectTextWarnings(text, findings) {
    var lower = text.toLowerCase();
    var urgency = uniqueMatches(text, [
      /\b(?:urgent|urgently|immediate(?:ly)?|act now|action required|final (?:notice|warning)|do not delay|without delay)\b/gi,
      /\bwithin\s+(?:\d+|one|two|three)\s+(?:hour|hours|day|days)\b/gi,
      /\b(?:today|right away)\b/gi
    ]);
    if (urgency.length) {
      addFinding(findings, "urgency", "Detected pressure language: " + quotedTerms(urgency, 3) + ".");
    }

    var accountThreat = uniqueMatches(text, [
      /\b(?:account|access|mailbox|profile|subscription|service).{0,85}\b(?:suspend(?:ed|ing|sion)?|close[dr]?|closure|disable[dr]?|deactivat(?:e|ed|ion)|lock(?:ed)?|terminat(?:e|ed|ion))\b/gi,
      /\b(?:suspend(?:ed|ing|sion)?|close[dr]?|closure|disable[dr]?|deactivat(?:e|ed|ion)|lock(?:ed)?).{0,85}\b(?:account|access|mailbox|profile|subscription|service)\b/gi
    ]);
    if (accountThreat.length) {
      addFinding(findings, "accountThreat", "Detected: " + quotedTerms(accountThreat, 2) + ".");
    }

    var password = uniqueMatches(text, [
      /\b(?:enter|provide|confirm|share|submit|reply with|type|verify)\s+(?:your\s+)?(?:password|passcode|login credentials?)\b/gi,
      /\b(?:password|passcode|login credentials?).{0,55}\b(?:required|needed|to continue|to restore|to keep)\b/gi
    ]);
    if (password.length) {
      addFinding(findings, "passwordRequest", "Detected: " + quotedTerms(password, 2) + ".");
    }

    var mfa = uniqueMatches(text, [
      /\b(?:send|share|provide|reply with|enter|confirm|give)\b.{0,35}\b(?:mfa|2fa|one[- ]time|verification|security|authenticator|otp)\s*(?:code|token)\b/gi,
      /\b(?:mfa|2fa|one[- ]time|verification|security|authenticator|otp)\s*(?:code|token).{0,45}\b(?:send|share|provide|reply|enter|confirm|give)\b/gi
    ]);
    if (mfa.length) {
      addFinding(findings, "mfaRequest", "Detected: " + quotedTerms(mfa, 2) + ".");
    }

    var payment = uniqueMatches(text, [
      /\b(?:pay|payment|wire transfer|bank transfer|transfer funds|settle).{0,55}\b(?:invoice|amount|balance|fee|payment|transfer)\b/gi,
      /\b(?:invoice|balance|fee|payment).{0,55}\b(?:pay|payment|wire transfer|bank transfer|settle)\b/gi
    ]);
    if (payment.length) {
      addFinding(findings, "paymentRequest", "Detected: " + quotedTerms(payment, 2) + ".");
    }

    var giftCards = uniqueMatches(text, [
      /\bgift[- ]?cards?\b/gi,
      /\b(?:itunes|steam|amazon)\s+gift\s*cards?\b/gi
    ]);
    if (giftCards.length) {
      addFinding(findings, "giftCardRequest", "Detected: " + quotedTerms(giftCards, 2) + ".");
    }

    var bankChange = uniqueMatches(text, [
      /\b(?:change|update|amend|replace|new)\b.{0,65}\b(?:bank (?:details|account)|beneficiary|payment details|remittance details)\b/gi,
      /\b(?:bank (?:details|account)|beneficiary|payment details|remittance details)\b.{0,65}\b(?:change|update|amend|replace|new)\b/gi
    ]);
    if (bankChange.length) {
      addFinding(findings, "bankChange", "Detected: " + quotedTerms(bankChange, 2) + ".");
    }

    var impersonation = uniqueMatches(text, [
      /\b(?:microsoft 365|office 365|microsoft support|microsoft security)\b/gi,
      /\b(?:it support|it desk|help ?desk|security team|accounts? department|finance (?:team|operations|director)|human resources|hr department)\b/gi,
      /\b(?:chief executive|ceo|managing director)\b/gi
    ]);
    if (impersonation.length) {
      addFinding(findings, "impersonation", "Claims or references: " + quotedTerms(impersonation, 3) + ".");
    }

    var attachmentCue = /\b(?:attachment|attached|enclosed|file)\b/i.test(lower);
    var unusualAttachment = attachmentCue ? uniqueMatches(text, [
      /\b[a-z0-9][a-z0-9_().\-\[\] ]{0,80}\.(?:zip|rar|7z|iso|img|html?|docm|xlsm|pptm)\b/gi
    ]) : [];
    if (unusualAttachment.length) {
      addFinding(findings, "unusualAttachment", "Named attachment: " + quotedTerms(unusualAttachment, 3) + ".");
    }

    var executableAttachment = uniqueMatches(text, [
      /\b[a-z0-9][a-z0-9_().\-\[\] ]{0,80}\.(?:exe|scr|js|jse|vbs|vbe|bat|cmd|ps1|msi|jar|lnk|hta|com|pif)\b/gi
    ]);
    if (executableAttachment.length) {
      addFinding(findings, "executableAttachment", "Named executable or script file: " + quotedTerms(executableAttachment, 3) + ".");
    }

    var macros = uniqueMatches(text, [
      /\benable\s+(?:macros|content|editing)\b/gi,
      /\bdisable\s+protected\s+view\b/gi,
      /\bprotected\s+view.{0,45}\b(?:enable|content|editing)\b/gi
    ]);
    if (macros.length) {
      addFinding(findings, "macroRequest", "Detected: " + quotedTerms(macros, 2) + ".");
    }

    var invoice = uniqueMatches(text, [
      /\b(?:attached|enclosed|review|pay|settle|outstanding|overdue).{0,50}\b(?:invoice|remittance advice|balance due|purchase order)\b/gi,
      /\b(?:invoice|remittance advice|balance due|purchase order).{0,50}\b(?:attached|enclosed|review|pay|settle|outstanding|overdue)\b/gi
    ]);
    if (invoice.length) {
      addFinding(findings, "invoiceLanguage", "Detected: " + quotedTerms(invoice, 2) + ".");
    }

    var credentialHarvesting = uniqueMatches(text, [
      /\b(?:sign in|log in|login|reauthenticate|verify (?:your )?(?:account|identity)|confirm (?:your )?(?:identity|account)|restore access).{0,95}\b(?:keep|restore|avoid|continue|maintain|prevent)\b/gi,
      /\b(?:keep|restore|avoid|continue|maintain|prevent).{0,95}\b(?:sign in|log in|login|reauthenticate|verify (?:your )?(?:account|identity)|confirm (?:your )?(?:identity|account)|restore access)\b/gi
    ]);
    if (credentialHarvesting.length) {
      addFinding(findings, "credentialHarvesting", "Detected: " + quotedTerms(credentialHarvesting, 2) + ".");
    }
  }

  function detectHeaderWarnings(headers, headerText, findings) {
    var fromDomain = getAddressDomain(getHeader(headers, "from"));
    var replyDomain = getAddressDomain(getHeader(headers, "reply-to"));
    if (fromDomain && replyDomain && !domainsRelated(fromDomain, replyDomain)) {
      addFinding(findings, "replyToMismatch", "From uses " + fromDomain + " while Reply-To uses " + replyDomain + ".");
    }

    var authenticationText = (headerText + "\n" + getHeader(headers, "authentication-results") + "\n" + getHeader(headers, "received-spf")).toLowerCase();
    if (/\bspf\s*=\s*(?:fail|softfail|temperror|permerror)\b/.test(authenticationText) || /^received-spf:\s*(?:fail|softfail)/im.test(authenticationText)) {
      addFinding(findings, "spfFail", "Pasted headers contain an SPF failure or soft failure.");
    }
    if (/\bdkim\s*=\s*(?:fail|temperror|permerror)\b/.test(authenticationText)) {
      addFinding(findings, "dkimFail", "Pasted headers contain a DKIM failure.");
    }
    if (/\bdmarc\s*=\s*(?:fail|temperror|permerror)\b/.test(authenticationText)) {
      addFinding(findings, "dmarcFail", "Pasted headers contain a DMARC failure.");
    }
  }

  function getAuthenticationStatus(authenticationText, mechanism) {
    var match = authenticationText.match(new RegExp("\\b" + mechanism + "\\s*=\\s*(pass|fail|softfail|temperror|permerror|neutral|none)\\b", "i"));
    if (!match && mechanism === "spf") {
      match = authenticationText.match(/\breceived-spf:\s*(pass|fail|softfail|temperror|permerror|neutral|none)\b/i);
    }
    return match ? match[1].toLowerCase() : "not-found";
  }

  function buildHeaderSummary(headers, headerText) {
    var authenticationText = (headerText + "\n" + getHeader(headers, "authentication-results") + "\n" + getHeader(headers, "received-spf")).toLowerCase();
    return {
      available: Boolean(headerText),
      fromDomain: getAddressDomain(getHeader(headers, "from")),
      replyDomain: getAddressDomain(getHeader(headers, "reply-to")),
      spf: getAuthenticationStatus(authenticationText, "spf"),
      dkim: getAuthenticationStatus(authenticationText, "dkim"),
      dmarc: getAuthenticationStatus(authenticationText, "dmarc")
    };
  }

  function classify(score) {
    if (score >= 60) {
      return {
        key: "high",
        label: "High risk",
        title: "Several strong warning signs",
        description: "Treat this message with caution. Do not use its links, attachments, or contact details to verify it."
      };
    }
    if (score >= 20) {
      return {
        key: "suspicious",
        label: "Suspicious",
        title: "Warning signs need checking",
        description: "Pause before acting. Independently verify the message through a trusted channel."
      };
    }
    return {
      key: "low",
      label: "Low risk",
      title: "Few configured warning signs",
      description: "This result is not proof that the email is safe; use context and independent verification."
    };
  }

  function analyseEmail(input) {
    var split = splitEmail(input);
    var headers = parseHeaders(split.headerText);
    var links = extractLinks(split.all);
    var findings = [];
    detectTextWarnings(split.all, findings);
    detectLinkWarnings(links, findings);
    detectHeaderWarnings(headers, split.headerText, findings);
    findings.sort(function (first, second) {
      return second.rule.points - first.rule.points || first.rule.label.localeCompare(second.rule.label);
    });

    var rawScore = findings.reduce(function (total, finding) {
      return total + finding.rule.points;
    }, 0);
    var score = Math.min(100, rawScore);
    return {
      findings: findings,
      rawScore: rawScore,
      score: score,
      classification: classify(score),
      headersPresent: Boolean(split.headerText),
      links: links,
      headerSummary: buildHeaderSummary(headers, split.headerText)
    };
  }

  function recommendationItems(result) {
    var ids = result.findings.map(function (finding) { return finding.id; });
    var items = [];

    function add(message) {
      if (items.indexOf(message) === -1) {
        items.push(message);
      }
    }

    if (result.classification.key === "high") {
      add("Do not click any links, open attachments, or reply using contact details in this message.");
    } else if (result.classification.key === "suspicious") {
      add("Pause before responding or following a link. Verify the message independently first.");
    } else {
      add("No major configured warning signs were found. Still check whether the message is expected before acting.");
    }

    if (ids.some(function (id) { return ["suspiciousUrl", "shortenedUrl", "rawIpUrl", "misleadingLink"].indexOf(id) >= 0; })) {
      add("Do not use the email’s link. Open the organisation’s official website or app yourself instead.");
    }
    if (ids.some(function (id) { return ["unusualAttachment", "executableAttachment", "macroRequest"].indexOf(id) >= 0; })) {
      add("Do not open the attachment or enable macros/content. Ask the sender through a known contact method if it is expected.");
    }
    if (ids.some(function (id) { return ["passwordRequest", "mfaRequest", "credentialHarvesting"].indexOf(id) >= 0; })) {
      add("Do not share a password, recovery code, or MFA/OTP code. A genuine support team should not ask for them by email.");
    }
    if (ids.some(function (id) { return ["paymentRequest", "giftCardRequest", "bankChange", "invoiceLanguage"].indexOf(id) >= 0; })) {
      add("Confirm payment or bank-detail changes using a known phone number or an existing official contact, not this email.");
    }
    if (ids.some(function (id) { return ["replyToMismatch", "spfFail", "dkimFail", "dmarcFail"].indexOf(id) >= 0; })) {
      add("Keep the original email and report it through your organisation’s normal security or phishing-reporting process.");
    }
    add("If this concerns a real account, use the official website, app, or a contact address you already trust to check it.");
    return items.slice(0, 5);
  }

  function riskColour(key) {
    if (key === "high") {
      return "#e85d45";
    }
    if (key === "suspicious") {
      return "#f1b64c";
    }
    return "#b8cf63";
  }

  function findingLevel(points) {
    if (points >= 20) {
      return "high";
    }
    if (points >= 12) {
      return "suspicious";
    }
    return "low";
  }

  function clearChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  function renderRules(dom) {
    clearChildren(dom.rulesList);
    RULES.forEach(function (rule) {
      var item = document.createElement("li");
      var name = document.createElement("span");
      var points = document.createElement("strong");
      name.textContent = rule.label;
      points.textContent = "+" + rule.points;
      item.appendChild(name);
      item.appendChild(points);
      dom.rulesList.appendChild(item);
    });
  }

  function renderFindings(dom, result) {
    clearChildren(dom.findings);
    if (!result.findings.length) {
      var noFindings = document.createElement("div");
      noFindings.className = "no-findings";
      noFindings.textContent = "No configured warning signs were detected in this text. That is useful, but it is not a guarantee that the email is genuine or safe.";
      dom.findings.appendChild(noFindings);
      return;
    }

    result.findings.forEach(function (finding) {
      var level = findingLevel(finding.rule.points);
      var card = document.createElement("article");
      card.className = "finding-card finding-" + level;

      var top = document.createElement("div");
      top.className = "finding-top";
      var titleWrap = document.createElement("div");
      titleWrap.className = "finding-title";
      var icon = document.createElement("span");
      icon.className = "finding-icon";
      icon.setAttribute("aria-hidden", "true");
      icon.textContent = "!";
      var labelWrap = document.createElement("div");
      var heading = document.createElement("h4");
      var category = document.createElement("span");
      heading.textContent = finding.rule.label;
      category.textContent = finding.rule.category;
      labelWrap.appendChild(heading);
      labelWrap.appendChild(category);
      titleWrap.appendChild(icon);
      titleWrap.appendChild(labelWrap);

      var points = document.createElement("span");
      points.className = "points-badge";
      points.textContent = "+" + finding.rule.points;
      top.appendChild(titleWrap);
      top.appendChild(points);

      var detail = document.createElement("p");
      detail.textContent = finding.detail;

      card.appendChild(top);
      card.appendChild(detail);
      dom.findings.appendChild(card);
    });
  }

  function renderRecommendations(dom, result) {
    clearChildren(dom.recommendations);
    recommendationItems(result).forEach(function (recommendation) {
      var item = document.createElement("li");
      item.textContent = recommendation;
      dom.recommendations.appendChild(item);
    });
  }

  function linkEvidenceLabels(link) {
    var inspection = inspectLink(link);
    var labels = [];
    inspection.suspiciousReasons.forEach(function (reason) {
      labels.push({ label: reason, tone: "warning" });
    });
    if (inspection.shortened) {
      labels.push({ label: "shortened URL", tone: "warning" });
    }
    if (inspection.rawIp) {
      labels.push({ label: "raw IP address", tone: "high" });
    }
    if (inspection.misleading) {
      labels.push({ label: "visible text differs", tone: "high" });
    }
    if (!labels.length) {
      labels.push({ label: "no configured technical flag", tone: "neutral" });
    }
    return labels;
  }

  function addEvidenceFlag(container, label, tone) {
    var flag = document.createElement("span");
    flag.className = "evidence-flag evidence-" + tone;
    flag.textContent = label;
    container.appendChild(flag);
  }

  function renderLinkEvidence(dom, result) {
    clearChildren(dom.linkEvidence);
    var links = result.links || [];
    dom.linkEvidenceCount.textContent = links.length + (links.length === 1 ? " link" : " links");

    if (!links.length) {
      var noLinks = document.createElement("div");
      noLinks.className = "no-evidence";
      noLinks.textContent = "No HTTP(S) or www links were found in the pasted text.";
      dom.linkEvidence.appendChild(noLinks);
      return;
    }

    links.forEach(function (link) {
      var card = document.createElement("article");
      card.className = "url-evidence-card";
      var code = document.createElement("code");
      code.textContent = link.raw;
      var host = document.createElement("p");
      host.textContent = "Destination host: " + (link.host || "not available");
      var flags = document.createElement("div");
      flags.className = "evidence-flags";
      linkEvidenceLabels(link).forEach(function (item) {
        addEvidenceFlag(flags, item.label, item.tone);
      });

      card.appendChild(code);
      card.appendChild(host);
      card.appendChild(flags);
      dom.linkEvidence.appendChild(card);
    });
  }

  function authenticationDisplay(status) {
    if (status === "pass") {
      return { label: "Pass", tone: "pass" };
    }
    if (["fail", "softfail", "temperror", "permerror"].indexOf(status) >= 0) {
      return { label: status === "softfail" ? "Soft fail" : status.charAt(0).toUpperCase() + status.slice(1), tone: "fail" };
    }
    if (status === "neutral" || status === "none") {
      return { label: status.charAt(0).toUpperCase() + status.slice(1), tone: "neutral" };
    }
    return { label: "Not found", tone: "unknown" };
  }

  function addHeaderCheck(container, label, value, tone) {
    var item = document.createElement("div");
    item.className = "header-check";
    var name = document.createElement("span");
    name.textContent = label;
    var status = document.createElement("strong");
    status.className = "header-status header-" + tone;
    status.textContent = value;
    item.appendChild(name);
    item.appendChild(status);
    container.appendChild(item);
  }

  function renderHeaderEvidence(dom, result) {
    clearChildren(dom.headerEvidence);
    var summary = result.headerSummary;
    dom.headerEvidenceState.textContent = summary.available ? "Headers included" : "No headers";

    if (!summary.available) {
      var noHeaders = document.createElement("div");
      noHeaders.className = "no-evidence";
      noHeaders.textContent = "Paste the full email, including headers, to check sender domains and email authentication results.";
      dom.headerEvidence.appendChild(noHeaders);
      return;
    }

    addHeaderCheck(dom.headerEvidence, "From domain", summary.fromDomain || "Not found", summary.fromDomain ? "neutral" : "unknown");
    addHeaderCheck(dom.headerEvidence, "Reply-To domain", summary.replyDomain || "Not found", summary.replyDomain ? "neutral" : "unknown");
    [
      { label: "SPF", status: summary.spf },
      { label: "DKIM", status: summary.dkim },
      { label: "DMARC", status: summary.dmarc }
    ].forEach(function (check) {
      var display = authenticationDisplay(check.status);
      addHeaderCheck(dom.headerEvidence, check.label, display.label, display.tone);
    });
  }

  function reportText(result) {
    var lines = [
      "PHISHING EMAIL ANALYSER — LOCAL ASSESSMENT REPORT",
      "Generated locally in this browser. The pasted email body is not included.",
      "",
      "Risk score: " + result.score + "/100 (" + result.classification.label + ")",
      "Detected signals: " + result.findings.length,
      "Raw rule points: " + result.rawScore,
      "",
      "RECORDED INDICATORS"
    ];

    if (result.findings.length) {
      result.findings.forEach(function (finding) {
        lines.push("- +" + finding.rule.points + " " + finding.rule.label + ": " + finding.detail);
      });
    } else {
      lines.push("- No configured warning signs were detected. This is not proof that the email is genuine.");
    }

    lines.push("", "EXTRACTED LINK EVIDENCE");
    if (result.links.length) {
      result.links.forEach(function (link) {
        lines.push("- " + link.raw + " | host: " + link.host + " | " + linkEvidenceLabels(link).map(function (item) { return item.label; }).join(", "));
      });
    } else {
      lines.push("- No HTTP(S) or www links found.");
    }

    lines.push("", "HEADER CHECKS");
    if (result.headerSummary.available) {
      lines.push("- From domain: " + (result.headerSummary.fromDomain || "Not found"));
      lines.push("- Reply-To domain: " + (result.headerSummary.replyDomain || "Not found"));
      ["spf", "dkim", "dmarc"].forEach(function (mechanism) {
        lines.push("- " + mechanism.toUpperCase() + ": " + authenticationDisplay(result.headerSummary[mechanism]).label);
      });
    } else {
      lines.push("- No recognised headers were included.");
    }

    lines.push("", "RECOMMENDED PROTOCOL");
    recommendationItems(result).forEach(function (item) {
      lines.push("- " + item);
    });
    lines.push("", "This educational triage result is not a definitive determination that an email is safe or malicious.");
    return lines.join("\n");
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var temporary = document.createElement("textarea");
      temporary.value = text;
      temporary.setAttribute("readonly", "");
      temporary.style.position = "fixed";
      temporary.style.opacity = "0";
      document.body.appendChild(temporary);
      temporary.select();
      var copied = document.execCommand("copy");
      document.body.removeChild(temporary);
      if (copied) {
        resolve();
      } else {
        reject(new Error("Copy was unavailable."));
      }
    });
  }

  function downloadReport(result) {
    var blob = new Blob([reportText(result)], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "phishing-email-assessment-report.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 0);
  }

  function resetRenderedResult(dom) {
    latestResult = null;
    dom.emptyState.hidden = false;
    dom.results.hidden = true;
    dom.reportStatus.textContent = "";
  }

  function renderResult(dom, result) {
    var risk = result.classification;
    latestResult = result;
    dom.emptyState.hidden = true;
    dom.results.hidden = false;
    dom.riskSummary.setAttribute("data-risk", risk.key);
    dom.riskRing.style.setProperty("--score", String(result.score));
    dom.riskRing.style.setProperty("--risk-color", riskColour(risk.key));
    dom.riskRing.setAttribute("aria-label", "Risk score " + result.score + " out of 100, " + risk.label);
    dom.scoreValue.textContent = String(result.score);
    dom.riskPill.textContent = risk.label;
    dom.riskTitle.textContent = risk.title;
    dom.riskDescription.textContent = risk.description;
    dom.resultCount.textContent = result.findings.length + (result.findings.length === 1 ? " signal" : " signals");
    dom.rawScoreBadge.textContent = result.rawScore + " raw point" + (result.rawScore === 1 ? "" : "s");
    dom.scoreRange.textContent = risk.key === "high" ? "High: 60–100" : risk.key === "suspicious" ? "Suspicious: 20–59" : "Low: 0–19";
    dom.scoreFormula.textContent = result.rawScore > 100
      ? "The detected rules add to " + result.rawScore + " points. Scores are capped at 100 so the result remains easy to compare."
      : "The detected rules add to " + result.rawScore + " points. Low: 0–19 · Suspicious: 20–59 · High: 60–100.";
    renderFindings(dom, result);
    renderRecommendations(dom, result);
    renderLinkEvidence(dom, result);
    renderHeaderEvidence(dom, result);
    dom.reportStatus.textContent = "";
  }

  function updateStats(dom) {
    var length = dom.input.value.length;
    var lines = dom.input.value ? dom.input.value.split(/\r\n|\r|\n/).length : 0;
    dom.stats.textContent = length.toLocaleString() + " character" + (length === 1 ? "" : "s") + " · " + lines + " line" + (lines === 1 ? "" : "s");
  }

  function initialise() {
    var dom = getDom();
    renderRules(dom);
    updateStats(dom);

    dom.analyseButton.addEventListener("click", function () {
      var text = dom.input.value.trim();
      if (!text) {
        dom.textareaShell.classList.add("input-error");
        dom.status.textContent = "Paste an email first, then select Analyse email.";
        dom.input.focus();
        return;
      }
      dom.textareaShell.classList.remove("input-error");
      var result = analyseEmail(text);
      renderResult(dom, result);
      dom.status.textContent = "Analysis complete: " + result.score + " out of 100 — " + result.classification.label + ".";
    });

    dom.clearButton.addEventListener("click", function () {
      dom.input.value = "";
      dom.textareaShell.classList.remove("input-error");
      resetRenderedResult(dom);
      updateStats(dom);
      dom.status.textContent = "Email content cleared from this page.";
      dom.input.focus();
    });

    dom.input.addEventListener("input", function () {
      dom.textareaShell.classList.remove("input-error");
      updateStats(dom);
      if (!dom.results.hidden) {
        resetRenderedResult(dom);
        dom.status.textContent = "Email content changed. Inspect evidence again to update the assessment.";
      }
    });

    dom.input.addEventListener("keydown", function (event) {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        dom.analyseButton.click();
      }
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-example]"), function (button) {
      button.addEventListener("click", function () {
        var key = button.getAttribute("data-example");
        dom.input.value = EXAMPLES[key];
        resetRenderedResult(dom);
        updateStats(dom);
        dom.input.focus();
        dom.status.textContent = "Fictional example loaded. Select Analyse email to inspect it.";
      });
    });

    dom.copyReportButton.addEventListener("click", function () {
      if (!latestResult) {
        return;
      }
      copyText(reportText(latestResult)).then(function () {
        dom.reportStatus.textContent = "Assessment report copied locally. The pasted email body was not included.";
      }).catch(function () {
        dom.reportStatus.textContent = "Copy was blocked by this browser. You can download the local .txt report instead.";
      });
    });

    dom.downloadReportButton.addEventListener("click", function () {
      if (!latestResult) {
        return;
      }
      downloadReport(latestResult);
      dom.reportStatus.textContent = "Local .txt report downloaded. The pasted email body was not included.";
    });
  }

  if (typeof window !== "undefined") {
    window.phishingEmailAnalyser = {
      analyseEmail: analyseEmail,
      examples: EXAMPLES,
      rules: RULES
    };
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", initialise);
  }
}());
