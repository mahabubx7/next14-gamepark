import { compare, hash } from "bcrypt";

const saltRounds = 10;

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return hash(password, saltRounds);
}

// Compare password
export async function comparePassword(
  hash: string, // Hashed password
  password: string // Plain password
): Promise<boolean> {
  return compare(password, hash);
}
