import { readFileSync } from "node:fs";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const failures = [];
const check = (condition, message) => {
  if (!condition) failures.push(message);
};

check(
  html.includes('rel="canonical" href="https://sub3man.github.io/inbody-livelively-demo/"'),
  "canonical URL is missing or incorrect",
);
check(/<meta\s+name=["']theme-color["']/i.test(html), "theme-color metadata is missing");
check(!/(?:YOUR|REPLACE_WITH)_[A-Z_]+/.test(html), "placeholder metadata remains");

for (const [index, match] of [...html.matchAll(/<img\b[^>]*>/gi)].entries()) {
  check(/\balt\s*=/.test(match[0]), `image ${index + 1} is missing alt text`);
}

for (const [index, match] of [...html.matchAll(/<button\b[^>]*>/gi)].entries()) {
  check(/\btype\s*=/.test(match[0]), `button ${index + 1} is missing an explicit type`);
}

for (const [index, match] of [...html.matchAll(/<a\b[^>]*target=["']_blank["'][^>]*>/gi)].entries()) {
  check(/\brel=["'][^"']*noopener/.test(match[0]), `external link ${index + 1} is missing noopener`);
  check(/\brel=["'][^"']*noreferrer/.test(match[0]), `external link ${index + 1} is missing noreferrer`);
}

const insecure = [...html.matchAll(/http:\/\/[^"'\s)<]+/gi)]
  .map((match) => match[0])
  .filter((url) => !url.includes("www.w3.org"));
check(insecure.length === 0, `insecure external URLs: ${insecure.join(", ")}`);

if (failures.length) {
  console.error("Static HTML validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Static HTML validation passed.");
