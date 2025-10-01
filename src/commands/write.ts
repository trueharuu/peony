import { Command } from "@sapphire/framework";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { report, respond_lengthy } from "../util";

export class WriteCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder => {
      builder.setName('write')
        .setDescription('writes a file')
        .addStringOption(c => c.setName('path').setDescription('file').setRequired(true))
        .addAttachmentOption(c => c.setName('content').setDescription('content to write').setRequired(true));
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const path = interaction.options.getString('path', true);
    const content = interaction.options.getAttachment('content', true);
    try {
      const req = await fetch(content.url);
      const data = Buffer.from(await req.arrayBuffer());

      await writeFile(path, data);
      await interaction.editReply(`wrote to \`${path}\``);
    } catch (e) { await report(interaction, e); }
  }
}
