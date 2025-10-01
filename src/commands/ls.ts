import { Command } from "@sapphire/framework";
import { readdir } from "node:fs/promises";
import { report, respond_lengthy } from "../util";

export class LsCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder => {
      builder.setName('ls')
        .setDescription('reads a directory')
        .addStringOption(c => c.setName('path').setDescription('directory').setRequired(true));
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const directory = interaction.options.getString('path', true);
    try {
      const value = await readdir(directory);
      await interaction.editReply(respond_lengthy("", value.join("\n"), "ansi"));
    } catch (e) {
      await report(interaction, e);
    }
  }
}
