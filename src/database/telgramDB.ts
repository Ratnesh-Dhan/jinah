import fs from "fs/promises";
import path from "path";
import { TelegramDB, TelegramUser } from "../types/telegram.js";
import { getUsers } from "./telegramUsers.js";

const teleDB = path.join(process.cwd(), "db", "telegramDB.json");

async function ensureTelegramDB() {
  try {
    await fs.access(teleDB);
  } catch {
    await fs.writeFile(teleDB, "[]", "utf-8");
  }
}

async function getDB(): Promise<TelegramDB[]> {
  await ensureTelegramDB();
  const data = await fs.readFile(teleDB, "utf-8");
  try {
    return JSON.parse(data);
  } catch {
    throw new Error("telegramDB.json contains invalid JSON");
  }
}

export async function getNewEntry(): Promise<TelegramUser[]> {
  const users = await getUsers();
  const db = await getDB();
  const newEntries: TelegramUser[] = [];

  users.forEach((user) => {
    const nonExsisting = db.findIndex(
      (item: TelegramDB) => item.chatId === user.chatId,
    );
    if (nonExsisting === -1) {
      newEntries.push(user);
    }
  });
  return newEntries;
}

export async function saveTelegramDB(newEntries: TelegramDB[]) {
  try {
    const db = await getDB();
    db.push(...newEntries);
    await fs.writeFile(teleDB, JSON.stringify(db, null, 2), "utf-8");
    return "success";
  } catch (error) {
    return `unable to save telegramDB.json: ${error}`;
  }
}

export async function getChatId(name: string): Promise<number> {
  const db = await getDB();
  const chatId = db.find((item) => item.name === name)?.chatId;
  if (chatId) {
    return chatId;
  } else {
    throw new Error("chatId not found");
  }
}
