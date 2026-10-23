# CRSCheck — Hello Elementor child theme + native calculator

## Installation order
1. Back up WordPress and use a staging website. Install **Hello Elementor** parent theme and **Elementor** plugin.
2. Appearance → Themes → Add New → Upload: `crscheck-hello-child.zip`. Activate it. Do not delete Hello Elementor.
3. Plugins → Add New → Upload: `crscheck-calculator-native.zip`. Activate it. **Deactivate and remove the older iframe-based CRSCheck Calculator plugin first** (same shortcode and Elementor widget ID).
4. Tools → Import → WordPress: import `crscheck-wordpress-content.xml` (unzip full bundle if needed). This creates actual `wp_posts` and `wp_postmeta` entries, all as drafts.
5. Create/edit a page named **CRS Calculator**; insert `[crscheck_calculator]` in a Shortcode block, or drag **CRSCheck Calculator (Native)** from Elementor widgets. Publish only after verification.
6. Settings → Reading: choose A static page, select your calculator page as Homepage. Settings → Permalinks: Post name; Save.
7. Elementor → Tools → Regenerate CSS & Data (if necessary); configure your menus and review drafts before publishing.

## Architecture
- Child theme: Hello Elementor parent (`Template: hello-elementor`); header/footer/page templates and CSS in child theme.
- Plugin: HTML fields, CSS and JavaScript render **inline in the page DOM**. No iframe. Multiple instances are scoped individually.
- Content: WordPress WXR XML for 46 pages and 12 posts; native database content and Elementor metadata.

## Limitations
- Not installed or tested on a live WordPress/Elementor server.
- Calculator retains legacy scoring assumptions, including optional **future** November 2026 rules. The prior 48 test cases do not verify this new inline integration; re-run score regression and official IRCC side-by-side checks before public use.
- The 58 content items are editorial drafts; review accuracy and quality before publication.
- Elementor widget exposes calculator placement, not each individual field as an Elementor control. CSS can be customized in child theme.
- If importing over a previous import, duplicate pages may appear; clean staging is recommended.
