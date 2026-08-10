/**
 * Reusable JSON-LD structured data component.
 *
 * Renders a `<script type="application/ld+json">` tag with the given data.
 * Safe to use in Server Components — outputs no client JS.
 */
export function JsonLd<T extends Record<string, unknown>>({ data }: { data: T }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
