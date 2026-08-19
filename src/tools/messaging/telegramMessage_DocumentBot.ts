import { z } from "zod";
import { server } from "../../server.js";
import { telegramMessageBot } from "../../services/telegram/telegramServices.js";

server.registerTool(
  "telegramMessageBot",
  {
    title: "Send message or document on Telegram",
    description:
      "Sends a text message, a document, or both to a Telegram chat. filePath must be the full path to the document.",
    inputSchema: z
      .object({
        chatId: z.string(),
        message: z.string().optional(),
        filePath: z.string().optional(),
      })
      .refine((data) => data.message || data.filePath, {
        message: "Either message or filePath must be provided",
      }),
  },
  async ({ chatId, message, filePath }) => {
    try {
      await telegramMessageBot(chatId, message, filePath);

      return {
        content: [
          {
            type: "text",
            text: `Successfully sent ${message && filePath ? "message and document" : message ? "message" : "document"} to Telegram chat ${chatId}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to send Telegram message: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  },
);
