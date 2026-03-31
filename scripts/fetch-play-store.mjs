/**
 * Fetches real Play Store metadata for all FusionCore apps.
 * Usage: node scripts/fetch-play-store.mjs
 *
 * Hits the Play Store's internal batchexecute RPC endpoint — no scraping, no fake headers.
 */

import gplay from "google-play-scraper";

const APPS = [
  { id: "com.fusionapps.cartwise", lang: "en", country: "us" },
  { id: "com.fusionapps.biblia.tla", lang: "es", country: "ar" },
  { id: "com.fusionapps.bible.tpt", lang: "en", country: "us" },
];

const FIELDS = [
  "title",
  "description",
  "summary",
  "installs",
  "minInstalls",
  "realInstalls",
  "score",
  "scoreText",
  "ratings",
  "reviews",
  "histogram",
  "price",
  "free",
  "currency",
  "contentRating",
  "contentRatingDescription",
  "adSupported",
  "released",
  "updated",
  "version",
  "recentChanges",
  "developer",
  "developerId",
  "developerEmail",
  "developerWebsite",
  "developerAddress",
  "genre",
  "genreId",
  "icon",
  "headerImage",
  "screenshots",
];

for (const app of APPS) {
  try {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`Fetching: ${app.id}`);
    console.log("=".repeat(60));

    const data = await gplay.app({
      appId: app.id,
      lang: app.lang,
      country: app.country,
    });

    for (const field of FIELDS) {
      if (data[field] !== undefined && data[field] !== null && data[field] !== "") {
        const val = typeof data[field] === "string" && data[field].length > 120
          ? data[field].slice(0, 120) + "…"
          : data[field];
        console.log(`  ${field.padEnd(28)} ${JSON.stringify(val)}`);
      }
    }
  } catch (err) {
    console.error(`  ERROR: ${err.message}`);
  }
}
