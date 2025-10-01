import { Command } from "@sapphire/framework";
import { readdir, readFile } from "node:fs/promises";
import { report, respond_lengthy } from "../util";

export class ReadCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder => {
      builder.setName('read')
        .setDescription('reads a file')
        .addStringOption(c => c.setName('path').setDescription('file').setRequired(true));
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const path = interaction.options.getString('path', true);
    try {


      const value = await readFile(path);
      await interaction.editReply(respond_lengthy("", value.toString('utf-8'), "ansi"));
    } catch (e) { await report(interaction, e); }
  }
}
