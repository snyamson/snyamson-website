/**
 * Nav and footer links are authored in the Studio as bare anchors ("#work")
 * because they point at sections of the home page. On any other route those
 * anchors resolve to nothing, so they have to be rewritten against "/".
 */
export function resolveHref(href: string, isHome: boolean): string {
  if (!href.startsWith("#")) return href;
  return isHome ? href : `/${href}`;
}
