import {
  LogLevel,
  SapphireClient,
} from "@sapphire/framework";
import { GatewayIntentBits } from "discord.js";
import { REST } from "discord.js";
import { config } from "dotenv";
import { Tracing } from "./tracing";
config({ quiet: true });

export const client = new SapphireClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
  ],
  logger: { instance: new Tracing(LogLevel.Info) },
  defaultPrefix: null,
  disableMentionPrefix: true,
});
export const rest = new REST().setToken(process.env.TOKEN!);

(async () => {
  await client.login(process.env.TOKEN);
})();
