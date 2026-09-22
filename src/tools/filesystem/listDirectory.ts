import { z } from "zod";
import { server } from "../../server.js";
import { listDirectory } from "../../services/filesystemServices.js";

server.registerTool(
  "listDirectory",
  {
    title: "List Directory",
    description: "List the files and directories in the specified directory.",
    inputSchema: z.object({
      dirPath: z.string(),
    }),
  },
  async ({ dirPath }) => {
    try {
      const result = await listDirectory(dirPath);
      return {
        content: [
          {
            type: "text",
            text: `Successfully listed directory: ${dirPath}
            Direcotries: ${result.directories.join(", ")}
            Files: ${result.files.join(", ")}`,
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
