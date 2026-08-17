/**
 * Emits a JSON-LD block.
 *
 * `JSON.stringify` output is escaped before it reaches the DOM: a `<` inside
 * any string value would otherwise let content close the script tag early
 * and inject markup. The data comes from the CMS, so it is not trusted here.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");

  return (
    <script
      type="application/ld+json"
      // The value is serialised JSON with every angle bracket escaped, so it
      // cannot break out of the script element.
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
