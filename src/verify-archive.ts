import { createHash } from "node:crypto";
import { createReadStream } from "node:fs";

export async function verifyArchive(
  file: string,
  archive: { url: string; sha256: string },
): Promise<void> {
  const hash = createHash("sha256");
  for await (const chunk of createReadStream(file)) {
    hash.update(chunk);
  }
  if (hash.digest("hex") !== archive.sha256) {
    throw new Error(`SHA-256 mismatch for ${archive.url}.`);
  }
}
