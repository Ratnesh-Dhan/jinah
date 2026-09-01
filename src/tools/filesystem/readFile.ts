import { z } from "zod";
import { server } from "../../server.js";
import { readFile } from "../../services/filesystemServices.js";

server.registerTool(
  "read_file",
  {
    title: "Read File",
    description:
      "Reads a supported file. Supports text files (txt, md, json, csv, py, js, ts, html, css, xml, yaml, yml) and binary files (.xlsx, .docx).",
    inputSchema: z.object({
      filePath: z.string(),
    }),
  },
  async ({ filePath }) => {
    try {
      const result = await readFile(filePath);

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
