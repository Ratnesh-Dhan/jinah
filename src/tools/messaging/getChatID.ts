import { z } from "zod";
import { server } from "../../server.js";

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
    if (username.toLocaleLowerCase() === "tirandars") {
      return {
        content: [
          {
            type: "text",
            text: `${-949335274}`,
          },
        ],
      };
    }
    return {
      content: [
        {
          type: "text",
          text: `${-949335274}`,
        },
      ],
    };
  },
);
