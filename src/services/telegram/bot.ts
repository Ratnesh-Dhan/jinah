import "dotenv/config";
import { Telegraf } from "telegraf";
import { registerStartHandler } from "./handlers/start.js";
import { registerMessageHandler } from "./handlers/message.js";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  throw new Error(`TELEGRAM_BOT_TOKEN is not configured`);
}

export const bot = new Telegraf(token);
registerStartHandler(bot);
registerMessageHandler(bot);

export const startTelegramBot = () => {
  bot.launch();
  console.log("Telegram bot started!");

  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
};
