import { z } from "zod";
import { server } from "../../server.js";
import { updateTelegramDB } from "../../services/telegram/telegramServices.js";

server.registerTool(
  "update_telegram_db",
  {
    title: "Update Telegram Database",
    description: "Save new Telegram users to the Telegram database.",
    inputSchema: z.object({
      newEntries: z.array(
        z.object({
          chatId: z.number(),
          name: z.string(),
        }),
      ),
    }),
  },
  async ({ newEntries }) => {
    const result = await updateTelegramDB(newEntries);

    return {
      content: [
        {
          type: "text",
          text: result,
        },
      ],
    };
  },
);
