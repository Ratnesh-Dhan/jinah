import { z } from "zod";
import { server } from "../../server.js";
import { getNewTelegramUsers } from "../../services/telegram/telegramServices.js";

server.registerTool(
  "get_new_telegram_users",
  {
    title: "Get New Telegram Users",
    description:
      "Get Telegram users who have recently started interacting with the bot.",
    inputSchema: z.object({}),
  },
  async () => {
    const users = await getNewTelegramUsers();

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(users),
        },
      ],
    };
  },
);
