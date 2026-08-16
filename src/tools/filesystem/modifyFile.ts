import { z } from "zod";
import { server } from "../../server.js";
import { modifyFile } from "../../services/filesystemServices.js";

server.registerTool(
  "modify_file",
  {
    title: "Modify or Edit File",
    description:
      "Modifies a text file by replacing, appending, prepending, or inserting text.",
    inputSchema: z.object({
      filePath: z.string(),

      operation: z.enum([
        "replace",
        "append",
        "prepend",
        "insert_after",
        "insert_before",
      ]),
      content: z.string(),
      target: z.string().optional(),
    }),
  },
  async ({ filePath, operation, content, target }) => {
    try {
      const modifiedPath = await modifyFile(
        filePath,
        operation,
        content,
        target,
      );
      return {
        content: [
          {
            type: "text",
            text: `Successfully modified :${modifiedPath}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to modify file: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  },
);
