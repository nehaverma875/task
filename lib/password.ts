import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";

const iterations = 120_000;
const keyLength = 64;
const digest = "sha512";

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = createHashWithSalt(password, salt);
  return `${iterations}:${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [storedIterations, salt, hash] = stored.split(":");
  if (!storedIterations || !salt || !hash || Number(storedIterations) !== iterations) return false;

  const candidate = createHashWithSalt(password, salt);
  const storedBuffer = Buffer.from(hash, "hex");
  const candidateBuffer = Buffer.from(candidate, "hex");

  return storedBuffer.length === candidateBuffer.length && timingSafeEqual(storedBuffer, candidateBuffer);
}

function createHashWithSalt(password: string, salt: string) {
  return pbkdf2Sync(password, salt, iterations, keyLength, digest).toString("hex");
}
