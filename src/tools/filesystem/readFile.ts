import { z } from "zod";
import { server } from "../../server.js";
import { readFile } from "../../services/filesystemServices.js";

server.registerTool(
  "read_file",
  {
    title: "Read File",
    description:
      "Reads a supported file. Supports text files (.txt, .md, .json, .csv) and binary files (.xlsx, .docx).",
    inputSchema: z.object({
      filePath: z.string(),
    }),
  },
  async ({ filePath }) => {
    try {
      const result = await readFile(filePath);

      //   if (Buffer.isBuffer(result)) {
      //     return {
      //       content: [
      //         {
      //           type: "text",
      //           text: `Successfully read binary file: ${filePath}\nSize: ${result.length} bytes`,
      //         },
      //       ],
      //     };
      //   }

      return {
        content: [
          {
            type: "text",
            text: result,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to read file: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  },
);
