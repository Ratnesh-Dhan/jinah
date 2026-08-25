import { z } from "zod";
import { server } from "../../server.js";
import { getChatId } from "../../services/telegram/telegramServices.js";

server.registerTool(
  "get_chat_id",
  {
    title: "Get Telegram Chat ID",
    description: "Get the Telegram chat ID for a given username.",
    inputSchema: z.object({
      username: z.string(),
    }),
  },
  async ({ username }) => {
    try {
      const id = await getChatId(username);
      return {
        content: [
          {
            type: "text",
            text: `${id}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to get chat id: ${error instanceof Error ? error.message : String(error)}`,
          },
        ],
      };
    }
  },
);
