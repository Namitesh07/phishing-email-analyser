# Reports and redaction

The analyser offers two report modes. Both include the risk result and assessment coverage, omit the complete pasted email body, and are generated locally when you choose **Copy report** or **Download .txt**.

| Report | Includes | Intended use |
| --- | --- | --- |
| **Shareable Summary** | Score, classification, coverage, triggered signal names, and safe next steps. Omits link and header details. | A brief handoff with less sensitive detail. |
| **Full Evidence Report** | Summary plus host-level link evidence, relevant header findings, and short matching text excerpts. | A more detailed review when the recipient needs supporting evidence. |

The Full Evidence Report redacts URL paths, query parameters, and fragments. Matching excerpts can still reveal snippets of the original message; review the report before sharing it.

Reports do not establish sender authenticity or prove that a message is malicious. See [how the score works](scoring-rules.md) and [project limitations](limitations.md).
