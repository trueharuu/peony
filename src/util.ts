import { CommandInteraction, Interaction, InteractionEditReplyOptions } from "discord.js";

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
  await interaction.editReply(respond_lengthy(":warning:", err instanceof Error ? err.message : String(err), 'txt'));
}
