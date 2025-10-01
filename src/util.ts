import { CommandInteraction, InteractionEditReplyOptions } from "discord.js";
import { inspect } from "util";

export function respond_lengthy(
  start: string,
  t: string,
  cb?: string,
): InteractionEditReplyOptions {
  if (t.length >= 1990 - start.length) {
    return {
      content: start,
      files: [{ name: "response.txt", attachment: Buffer.from(t) }],
    };
  }

  return { content: `${start} ${cb ? `\`\`\`${cb}\n` : ""}${t}${cb ? "\n```" : ""}` };
}

export async function report(interaction: CommandInteraction, err: any) {
  await interaction.editReply(respond_lengthy(":warning:", err instanceof Error ? inspect(err) : String(err), 'txt'));
}

export async function check(interaction: CommandInteraction) {
  if (!process.env.HOSTS!.split(',').includes(interaction.id)) {
    throw 'unauthorized';
  }
}
