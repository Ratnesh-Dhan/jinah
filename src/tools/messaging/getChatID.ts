import { z } from "zod";
import { server } from "../../server.js";
import { getChatId } from "../../services/telegram/telegramServices.js";

server.registerTool(
  "get_chat_id",
  {
    title:
      "Gets the Telegram chat ID for a given Telegram username or contact name. Use this tool whenever the user asks for, wants to find, or wants to check whether we have someone's Telegram chat ID. Examples: 'What is Prem's chat ID?', 'Do we have Prem's chat ID?', 'Find Tirandars Telegram ID'. Do not use file search for Telegram chat ID lookups.",
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
