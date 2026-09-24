/**
 * Consent Mode v2 default bootstrap for this repo's specific template —
 * the inline `<script>` `app/layout.tsx` has always rendered when at
 * least one gtag id (GA4 and/or Ads) is configured. Unlike a generic
 * default/update pair, this one reads the consent cookie itself to decide
 * the default (`granted` for a visitor who already accepted, `denied`
 * otherwise) and loads gtag.js in its own last line — see the source
 * file's own comment for why (script-ordering, not `next/script`).
 *
 * Byte order and whitespace matter: this is compared byte-for-byte
 * against the pre-migration inline template (phase 3 gate, docs/migration/DECISIONS.md D7)
 * — never reformat this template literal.
 */
export function buildConsentDefaultScript(cookieName: string, ids: readonly string[]): string {
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)};
var paConsent=/(^|; )${cookieName}=aceptado/.test(document.cookie)?'granted':'denied';
gtag('consent','default',{ad_storage:paConsent,ad_user_data:paConsent,ad_personalization:paConsent,analytics_storage:paConsent,wait_for_update:500});
gtag('set','ads_data_redaction',true);
gtag('set','url_passthrough',true);
gtag('js',new Date());
${ids.map((id) => `gtag('config','${id}');`).join('\n')}
(function(){var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id=${ids[0]}';document.head.appendChild(s)})();`
}
