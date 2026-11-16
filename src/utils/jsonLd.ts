// JSON for a <script type="application/ld+json"> block. JSON.stringify leaves
// "<" alone, so a value holding "</script>" could close the tag early.
export const jsonLd = (data: unknown): string => JSON.stringify(data).replace(/</g, "\\u003c");
