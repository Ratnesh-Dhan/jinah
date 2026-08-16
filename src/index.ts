import "dotenv/config";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { server } from "./server.js";

import "./tools/filesystem/listDirectory.js";
import "./tools/filesystem/readFile.js";
import "./tools/filesystem/createFile.js";
import "./tools/filesystem/modifyFile.js";
import "./tools/messaging/getChatID.js";
import "./tools/messaging/telegramMessage_DocumentBot.js";
// import { z } from "zod";
// import fs from "node:fs/promises";
// import path from "node:path";

// server.registerTool(
//   "createTxtFile", // Tool name
//   {
//     description:
//       "Creates a .txt file at the specified location with the given text content. Automatically creates parent directories if they don't exist.",
//     inputSchema: z.object({
//       filePath: z.string(),
//       content: z.string(),
//     }),
//   },
//   async ({ filePath, content }) => {
//     try {
//       const safePath = path.resolve(filePath);

//       // Security check: enforce .txt extension
//       if (!safePath.toLowerCase().endsWith(".txt")) {
//         return {
//           content: [
//             {
//               type: "text",
//               text: `Error: File path must end with .txt. Got: ${filePath}`,
//             },
//           ],
//         };
//       }

//       // Create nested directories if needed
//       await fs.mkdir(path.dirname(safePath), { recursive: true });

//       // Write the file
//       await fs.writeFile(safePath, content, "utf-8");

//       return {
//         content: [
//           { type: "text", text: `Successfully created file at: ${safePath}` },
//         ],
//       };
//     } catch (error) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: `Failed to create file: ${(error as Error).message}`,
//           },
//         ],
//       };
//     }
//   },
// );

const transport = new StdioServerTransport();
await server.connect(transport);
