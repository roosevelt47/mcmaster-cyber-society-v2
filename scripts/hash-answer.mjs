// Usage: node scripts/hash-answer.mjs <challenge-id> "<answer>"
// Prints the hash to paste into src/data/challenges.ts. Keep the plaintext answer out of the repo.
import { createHash } from "node:crypto";

const [id, ...rest] = process.argv.slice(2);
const answer = rest.join(" ");
if (!id || !answer) {
  console.error('Usage: node scripts/hash-answer.mjs <challenge-id> "<answer>"');
  process.exit(1);
}

const normalized = answer.trim().toLowerCase().replace(/\s+/g, " ");
console.log(createHash("sha256").update(`${id}|${normalized}`).digest("hex"));
