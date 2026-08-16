import { z } from "zod";
import { createFile } from "../../services/filesystemServices.js";
import { server } from "../../server.js";

server.registerTool(
  "createFile",
  {
    description:
      "Creates a file at the specified location with the given content. Automatically creates parent directories if they don't exist.",
    inputSchema: z.object({
      filePath: z.string(),
      content: z.string(),
    }),
  },
  async ({ filePath, content }) => {
    try {
      const safePath = await createFile(filePath, content);
      return {
        content: [
          {
            type: "text",
            text: `Successfully created file at: ${safePath}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${(error as Error).message}`,
          },
        ],
      };
    }
  },
);
