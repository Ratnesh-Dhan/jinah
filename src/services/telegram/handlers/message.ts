import type { Telegraf } from "telegraf";
import { saveTelegramUser } from "../../../database/telegramUsers.js";

export const registerMessageHandler = (bot: Telegraf) => {
  bot.on("message", async (ctx) => {
    console.log("Telegram message received!");
    if ("text" in ctx.message) {
      console.log({
        chatId: ctx.chat.id,
        userId: ctx.from.id,
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
        message: ctx.message.text,
      });
    } else {
      console.log({
        chatId: ctx.chat.id,
        userId: ctx.from.id,
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
      });
    }
    const user = await saveTelegramUser({
      chatId: ctx.chat.id,
      userId: ctx.from.id,
      username: ctx.from.username,
      firstName: ctx.from.first_name,
      lastName: ctx.from.last_name,
    });
  });
};
