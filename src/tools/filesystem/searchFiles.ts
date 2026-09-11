import { z } from "zod";
import { server } from "../../server.js";
import { globby } from "globby";
import * as path from "path";

server.registerTool(
  "search_files",
  {
    title: "Search Files",
    description:
      "Searches the local filesystem recursively for files matching a filename pattern. Use this ONLY when the user wants to find files or filenames on the filesystem. This tool is NOT for searching database records, Telegram contacts, Telegram usernames, Telegram chat IDs, or other application data.",
    inputSchema: z.object({
      query: z
        .string()
        .describe(
          "The filename or pattern to search for. Supports wildcards like '*.pdf' or 'report_*.docx'. Do NOT include paths here, just the name.",
        ),
      directory: z
        .string()
        .describe(
          "The root directory to start searching from. If empty, it searches the current working directory of the server.",
        )
        .optional(),
    }),
  },
  async ({ query, directory = "." }) => {
    try {
      const searchPath = path.resolve(directory || process.cwd());

      //   const pattern = path.join(searchPath, "**", query); // '**' means search in all subdirectories
      const files = await globby(`**/${query}`, {
        cwd: searchPath,
        onlyFiles: true,
        absolute: true,
        caseSensitiveMatch: false,
        suppressErrors: true,
        followSymbolicLinks: true,
        throwErrorOnBrokenSymbolicLink: true,
        ignore: [
          "**/node_modules/**",
          "**/.git/**",

          // Windows system/protected directories
          "**/System Volume Information/**",
          "**/$Recycle.Bin/**",
          "**/Recovery/**",

          // Common application/build junk
          "**/.cache/**",
          "**/.next/**",
          "**/dist/**",
          "**/build/**",
          "**/coverage/**",
        ],
      }); // Ignore junk folders!

      if (files.length === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No files found matching "${query}" in ${searchPath}`,
            },
          ],
        };
      }
      const fileList = files
        .slice(0, 50)
        .map((f) => `- ${f}`)
        .join("\n");
      let message = `Found ${files.length} file(s) matching "${query}":\n\n${fileList}`;
      if (files.length > 50) {
        message += `\n\n...and ${files.length - 50} more. Showing only first 50.`;
      }
      return {
        content: [{ type: "text", text: message }],
      };
    } catch (e) {
      console.error(`Error searching files: ${e}`);
      return {
        content: [
          {
            type: "text",
            text: `An unexpected error occurred during search: ${e instanceof Error ? e.message : String(e)}`,
          },
        ],
      };
    }
  },
);
