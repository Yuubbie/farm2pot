// One-time helper script: uploads any files from the local folder that
// aren't already in the Supabase "menu-images" bucket. Safe to re-run —
// it skips anything already uploaded, so partial/interrupted uploads
// just pick up where they left off.
//
// Usage:
//   node upload-images.js "C:\Users\HP\Desktop\farm2pot-asset"

const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://udjushobeawcltcotwrt.supabase.co";
// IMPORTANT: this must be the SERVICE ROLE key (Settings → API → service_role),
// not the anon key — only the service role key can bypass storage permissions
// for this one-time upload. Never put this key anywhere in your website code.
const SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkanVzaG9iZWF3Y2x0Y290d3J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODE4NDg0MiwiZXhwIjoyMTAzNzYwODQyfQ.TAp6v6V3iTt0ZQ4N_ffgLez5ilhFLHEpZl79FQRtblg";

const BUCKET = "menu-images";
const folder = process.argv[2];

if (!folder) {
  console.error("Please provide the folder path, e.g.:");
  console.error('  node upload-images.js "C:\\Users\\HP\\Desktop\\farm2pot-asset"');
  process.exit(1);
}

if (SERVICE_ROLE_KEY === "PASTE_YOUR_SERVICE_ROLE_KEY_HERE") {
  console.error("Please edit this file and paste your real service role key first.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  console.log("Checking what's already uploaded...");
  const { data: existing, error: listError } = await supabase.storage
    .from(BUCKET)
    .list("", { limit: 1000 });

  if (listError) {
    console.error("Could not list existing files:", listError.message);
    process.exit(1);
  }

  const existingNames = new Set(existing.map((f) => f.name));
  console.log(`Found ${existingNames.size} files already in the bucket.`);

  const localFiles = fs.readdirSync(folder).filter((f) => {
    const ext = path.extname(f).toLowerCase();
    return [".jpg", ".jpeg", ".png", ".webp"].includes(ext);
  });

  console.log(`Found ${localFiles.length} image files locally.`);

  let uploaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const filename of localFiles) {
    if (existingNames.has(filename)) {
      skipped++;
      continue;
    }

    const filePath = path.join(folder, filename);
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();
    const contentType =
      ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";

    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(filename, fileBuffer, { contentType, upsert: false });

    if (error) {
      console.error(`FAILED: ${filename} — ${error.message}`);
      failed++;
    } else {
      console.log(`Uploaded: ${filename}`);
      uploaded++;
    }
  }

  console.log("\n--- Done ---");
  console.log(`Uploaded: ${uploaded}`);
  console.log(`Already there (skipped): ${skipped}`);
  console.log(`Failed: ${failed}`);
}

main();