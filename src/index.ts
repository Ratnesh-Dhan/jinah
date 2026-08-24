import "dotenv/config";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio";
import { server } from "./server.js";
import { startTelegramBot } from "./services/telegram/bot.js";

startTelegramBot();

import "./tools/filesystem/listDirectory.js";
import "./tools/filesystem/readFile.js";
import "./tools/filesystem/createFile.js";
import "./tools/filesystem/modifyFile.js";
import "./tools/messaging/getChatID.js";
import "./tools/messaging/telegramMessage_DocumentBot.js";
import "./tools/messaging/getNewTelegramUsers.js";
import "./tools/messaging/addNewTelegramEntries.js";

const transport = new StdioServerTransport();
await server.connect(transport);
