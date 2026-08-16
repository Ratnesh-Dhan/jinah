import { z } from "zod";
import { server } from "../../server.js";

server.registerTool(
  "send_telegram_message",
  {
    title: "Send Telegram Message",
    description: "Send a message to a Telegram chat.",
    inputSchema: z.object({
      chatId: z.string(),
      message: z.string(),
    }),
  },
  async ({ chatId, message }) => {
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
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

      if (!response.ok) {
        throw new Error(JSON.stringify(data));
      }

      return {
        content: [
          {
            type: "text",
            text: `Message sent successfully to ${chatId}`,
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
