import fs from "fs/promises";
import path from "path";

export interface TelegramUser {
  chatId: number;
  userId: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
  updatedAt: string;
}

const dbDirectory = path.join(process.cwd(), "db");
const usersFile = path.join(dbDirectory, "telegramUsers.json");

async function ensureDatabase() {
  await fs.mkdir(dbDirectory, { recursive: true });

  try {
    await fs.access(usersFile);
  } catch {
    await fs.writeFile(usersFile, "[]", "utf-8");
  }
}

async function getUsers(): Promise<TelegramUser[]> {
  await ensureDatabase();

  const data = await fs.readFile(usersFile, "utf-8");

  try {
    return JSON.parse(data);
  } catch {
    throw new Error("telegramUsers.json contains invalid JSON");
  }
}

export async function saveTelegramUser(
  user: Omit<TelegramUser, "createdAt" | "updatedAt">,
) {
  const users = await getUsers();

  const now = new Date().toISOString();

  const existingUserIndex = users.findIndex(
    (existingUser) => existingUser.userId === user.userId,
  );

  if (existingUserIndex !== -1) {
    users[existingUserIndex] = {
      ...users[existingUserIndex],
      ...user,
      updatedAt: now,
    };
  } else {
    users.push({
      ...user,
      createdAt: now,
      updatedAt: now,
    });
  }

  await fs.writeFile(usersFile, JSON.stringify(users, null, 2), "utf-8");

  return users.find((existingUser) => existingUser.userId === user.userId);
}
