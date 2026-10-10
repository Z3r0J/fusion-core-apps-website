#!/usr/bin/env node
// Pings IndexNow (Bing, Yandex, Seznam, Naver…) with the URLs in the live sitemap
// so new or updated pages get recrawled within hours instead of weeks. Bing's
// index also feeds ChatGPT search and Copilot answers.
//
// Usage (after a production deploy has finished):
//   node scripts/indexnow.mjs                 # every URL in the sitemap
//   node scripts/indexnow.mjs /blog/foo /es/blog/bar   # only these paths
//
// The key file lives at public/<KEY>.txt — IndexNow verifies ownership by fetching it.

const HOST = "www.fusioncoreapps.com";
const ORIGIN = `https://${HOST}`;
const KEY = "84a4238f079a2b308336a36384e0dec0";

const fromArgs = process.argv.slice(2).map((path) => new URL(path, ORIGIN).href);

async function sitemapUrls() {
	const res = await fetch(`${ORIGIN}/sitemap-0.xml`);
	if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
	const xml = await res.text();
	return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
}

const urlList = fromArgs.length > 0 ? fromArgs : await sitemapUrls();

const res = await fetch("https://api.indexnow.org/indexnow", {
	method: "POST",
	headers: { "Content-Type": "application/json; charset=utf-8" },
	body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
});

// 200 = accepted, 202 = accepted (key validation pending). Anything else is an error.
console.log(`IndexNow: HTTP ${res.status} for ${urlList.length} URL(s)`);
if (res.status !== 200 && res.status !== 202) {
	console.error(await res.text());
	process.exit(1);
}
