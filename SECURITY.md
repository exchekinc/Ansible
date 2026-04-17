# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✓ Current |

## Scope

This project is a static Next.js website (all routes prerendered). The attack surface is minimal:

- No user authentication
- No database
- No server-side API routes
- No user-generated content stored or persisted
- No financial or sensitive personal data

The interactive simulator runs entirely client-side in the user's browser.

## Reporting a Vulnerability

If you discover a security vulnerability — including in dependencies — please report it privately rather than opening a public GitHub issue.

**Contact:** [matt@mrdula.co](mailto:matt@mrdula.co)

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact assessment
- Any suggested remediation

We will acknowledge receipt within 48 hours and aim to resolve confirmed vulnerabilities within 14 days.

## Dependency Security

We use `npm audit` to track known vulnerabilities in dependencies. Run:

```bash
cd site && npm audit
```

If you find a vulnerable dependency, please open a PR updating it, or file a private report if the fix isn't straightforward.
