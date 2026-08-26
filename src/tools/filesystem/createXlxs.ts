import { z } from "zod";
import { createXlsx } from "../../services/filesystemServices.js";
import { server } from "../../server.js";

server.registerTool(
  "createXlsx",
  {
    description:
      "Creates an Excel XLSX spreadsheet at the specified location using the provided rows of data. Automatically creates parent directories if they don't exist. The resulting XLSX file can be opened and edited with Microsoft Excel or LibreOffice Calc.",
    inputSchema: z.object({
      filePath: z
        .string()
        .describe("Path where the XLSX file should be created."),
      data: z
        .array(z.array(z.string()))
        .describe(
          "Spreadsheet rows. Each inner array represents one row and each value represents one cell.",
        ),
    }),
  },
  async ({ filePath, data }) => {
    try {
      const safePath = await createXlsx(filePath, data);

      return {
        content: [
          {
            type: "text",
            text: `Successfully created XLSX spreadsheet at: ${safePath}`,
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
