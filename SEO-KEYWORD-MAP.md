# SEO Keyword Mapping & Content Strategy

*Internal developer-readable documentation for search intent mapping, target keyword clusters, and internal linking structure. DO NOT expose as a public webpage.*

---

## 1. Primary Keyword Cluster Overview

| Page URL | Primary Target Keyword | Search Intent | Target Keyword Cluster | JSON-LD Schema Types | Internal Link Targets |
|---|---|---|---|---|---|
| `/` | Free Browser Tools | Informational & Navigational | browser tools, online input tester, online hardware tester, web utilities | `WebSite`, `Organization` | `/mouse-tester`, `/mouse-click-test`, `/double-click-test`, `/mouse-scroll-test`, `/mouse-polling-rate-test`, `/mouse-dpi-test`, `/cps-test` |
| `/mouse-tester` | mouse tester | Transactional / Tool Utility | mouse tester, mouse test, mouse tester online, mouse test online, test mouse, check my mouse, online mouse tester, mouse functionality test | `WebApplication`, `BreadcrumbList`, `FAQPage` | `/mouse-click-test`, `/double-click-test`, `/mouse-scroll-test`, `/mouse-polling-rate-test`, `/mouse-dpi-test`, `/cps-test` |
| `/mouse-click-test` | mouse click test | Tool Utility / Troubleshooting | mouse click test, mouse button test, test mouse buttons, left click test, right click test, middle click test, side button test, mouse button checker | `WebApplication`, `BreadcrumbList`, `FAQPage` | `/mouse-tester`, `/double-click-test`, `/cps-test` |
| `/double-click-test` | double click test | Troubleshooting & Hardware Diagnostics | double click test, mouse double click test, double click tester, is my mouse double clicking, mouse switch double click test, double click checker | `WebApplication`, `BreadcrumbList`, `FAQPage` | `/mouse-tester`, `/mouse-click-test` |
| `/mouse-scroll-test` | mouse scroll test | Tool Utility | mouse scroll test, mouse wheel test, scroll wheel test, mouse wheel tester, test mouse wheel, mouse scroll checker | `WebApplication`, `BreadcrumbList`, `FAQPage` | `/mouse-tester`, `/mouse-polling-rate-test` |
| `/mouse-polling-rate-test` | mouse polling rate test | Gaming / Performance Testing | mouse polling rate test, mouse polling rate tester, mouse Hz test, mouse report rate test, 1000Hz mouse test, mouse polling rate checker | `WebApplication`, `BreadcrumbList`, `FAQPage` | `/mouse-tester`, `/mouse-dpi-test` |
| `/mouse-dpi-test` | mouse DPI test | Gaming / Sensitivity Calculation | mouse DPI test, mouse DPI checker, how to test mouse DPI, mouse sensitivity test, DPI calculator online, check mouse DPI | `WebApplication`, `BreadcrumbList`, `FAQPage` | `/mouse-tester`, `/mouse-polling-rate-test` |
| `/cps-test` | CPS test | Gaming / Speed Challenge | CPS test, click speed test, clicks per second test, mouse CPS test, CPS tester, click speed tester online | `WebApplication`, `BreadcrumbList`, `FAQPage` | `/mouse-tester`, `/mouse-click-test` |

---

## 2. Intent Grouping Rules

- **No Thin / Doorway Pages**: Keyword variants sharing identical search intent are unified into one authoritative pillar page.
- **Topical Hierarchy**: Main pillar `/mouse-tester` covers full hardware diagnostics; sub-tools satisfy granular specialized queries (e.g. switch chatter, Hz measuring, click speed challenges).
- **Descriptive Anchor Text**: Avoid generic "click here". Use semantic anchors like `"check mouse polling rate"`, `"test mouse switch double clicking"`, and `"try the CPS click speed test"`.

---

## 3. Privacy & Technical Integrity Constraints

- 100% Client-Side Input Handling: Mouse events stay in DOM memory.
- No Server Uploads: Zero analytics or keystroke/mouse payload transmission.
- Clean AdSense Slots: Pre-reserved `AdSlot` components to maintain CLS (Cumulative Layout Shift) stability without obscuring test interactive areas.
