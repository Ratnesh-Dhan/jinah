import { z } from "zod";
import { createDocx } from "../../services/filesystemServices.js";
import { server } from "../../server.js";

server.registerTool(
  "createDocx",
  {
    description:
      "Creates a Microsoft Word DOCX document at the specified location with the given text content. Automatically creates parent directories if they don't exist. The resulting DOCX file can be opened and edited with Microsoft Word or LibreOffice Writer.",
    inputSchema: z.object({
      filePath: z
        .string()
        .describe("Path where the DOCX file should be created."),
      content: z
        .string()
        .describe("Text content to place into the Word document."),
    }),
  },
  async ({ filePath, content }) => {
    try {
      const safePath = await createDocx(filePath, content);

      return {
        content: [
          {
            type: "text",
            text: `Successfully created DOCX document at: ${safePath}`,
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
