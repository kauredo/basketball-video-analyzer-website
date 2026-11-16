import { test } from "node:test";
import assert from "node:assert/strict";
import { pageDates } from "./pageDates.ts";
import { guides } from "./guides.ts";
import { jsonLd } from "../utils/jsonLd.ts";

test("the home page and every guide have dates", () => {
  for (const path of ["/", ...guides.map((g) => g.href)]) {
    assert.ok(pageDates[path], `${path} is missing from pageDates`);
  }
});

test("dates are ISO days and modified is not before published", () => {
  for (const [path, { published, modified }] of Object.entries(pageDates)) {
    assert.match(published, /^\d{4}-\d{2}-\d{2}$/, path);
    assert.match(modified, /^\d{4}-\d{2}-\d{2}$/, path);
    assert.ok(modified >= published, path);
  }
});

test("jsonLd cannot close the script tag", () => {
  const out = jsonLd({ v: "</script><script>alert(1)</script>" });
  assert.ok(!out.includes("<"));
  assert.deepEqual(JSON.parse(out), { v: "</script><script>alert(1)</script>" });
});
