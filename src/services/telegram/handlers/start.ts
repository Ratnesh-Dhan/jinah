import type { Telegraf } from "telegraf";
import { saveTelegramUser } from "../../../database/telegramUsers.js";

export const registerStartHandler = (bot: Telegraf) => {
  bot.start(async (ctx) => {
    console.log("Bot started.!");
    const user = await saveTelegramUser({
      chatId: ctx.chat.id,
      userId: ctx.from.id,
      username: ctx.from.username,
      firstName: ctx.from.first_name,
      lastName: ctx.from.last_name,
    });

    console.log("Telegram user saved: ", user);

    await ctx.reply(`Hello there! ${user?.username}`);
  });
};
