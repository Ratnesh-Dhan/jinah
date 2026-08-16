import { z } from "zod";
import { server } from "../../server.js";
import fs from "node:fs/promises";
import path from "node:path";

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
      const token = process.env.TELEGRAM_BOT_TOKEN;
      console.log(token);

      if (!token) {
        throw new Error(`TELEGRAM_BOT_TOKEN is not configured`);
      }

      // Send message
      if (message) {
        const response = await fetch(
          `https://api.telegram.org/bot${token}/sendMessage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chat_id: chatId,
              text: message,
            }),
          },
        );
        const data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(JSON.stringify(data));
        }
      }

      // Send document
      if (filePath) {
        const fileBuffer = await fs.readFile(filePath);
        const formData = new FormData();
        formData.append("chat_id", chatId);
        formData.append(
          "document",
          new Blob([fileBuffer]),
          path.basename(filePath),
        );

        const response = await fetch(
          `https://api.telegram.org/bot${token}/sendDocument`,
          {
            method: "POST",
            body: formData,
          },
        );
        const data = await response.json();
        if (!response.ok || !data.ok) {
          throw new Error(JSON.stringify(data));
        }
      }

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
