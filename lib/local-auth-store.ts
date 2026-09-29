import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { promises as fs } from "fs";
import path from "path";

type LocalUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "USER" | "ADMIN";
  isPrime: boolean;
  createdAt: string;
};

const STORE_PATH = path.join(process.cwd(), ".data", "local-users.json");

export function isLocalAuthEnabled() {
  return process.env.NODE_ENV === "development" || process.env.ALLOW_LOCAL_AUTH_FALLBACK === "true";
}

async function readStore(): Promise<LocalUser[]> {
  try {
    const raw = await fs.readFile(STORE_PATH, "utf8");
    return JSON.parse(raw) as LocalUser[];
  } catch {
    return [];
  }
}

async function writeStore(users: LocalUser[]) {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  await fs.writeFile(STORE_PATH, JSON.stringify(users, null, 2), "utf8");
}

async function ensureDemoUsers() {
  const users = await readStore();
  if (users.length > 0) return users;

  const seeded: LocalUser[] = [
    {
      id: "local-admin",
      name: "Marketplace Admin",
      email: "admin@example.com",
      password: await bcrypt.hash("Admin@123", 12),
      role: "ADMIN",
      isPrime: true,
      createdAt: new Date().toISOString()
    },
    {
      id: "local-customer",
      name: "Demo Customer",
      email: "customer@example.com",
      password: await bcrypt.hash("User@123", 12),
      role: "USER",
      isPrime: false,
      createdAt: new Date().toISOString()
    }
  ];

  await writeStore(seeded);
  return seeded;
}

export async function findLocalUserByEmail(email: string) {
  const users = await ensureDemoUsers();
  return users.find((user) => user.email.toLowerCase() === email.toLowerCase()) ?? null;
}

export async function createLocalUser(input: { name: string; email: string; password: string }) {
  const users = await ensureDemoUsers();
  const email = input.email.toLowerCase();

  if (users.some((user) => user.email.toLowerCase() === email)) {
    return { error: "exists" as const };
  }

  const user: LocalUser = {
    id: randomBytes(12).toString("hex"),
    name: input.name,
    email,
    password: await bcrypt.hash(input.password, 12),
    role: "USER",
    isPrime: false,
    createdAt: new Date().toISOString()
  };

  users.push(user);
  await writeStore(users);

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  };
}

export async function verifyLocalUser(email: string, password: string) {
  const user = await findLocalUserByEmail(email);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isPrime: user.isPrime
  };
}
