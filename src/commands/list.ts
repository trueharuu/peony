import { Command } from "@sapphire/framework";
import { readdir } from "node:fs/promises";
import { report, respond_lengthy } from "../util";
import { execSync } from "node:child_process";

export class ListCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder => {
      builder.setName('list')
        .setDescription('returns a list of all running processes')
        .addStringOption(c => c.setName('query').setDescription('a fragment of the process name to search for').setRequired(false))
        .addIntegerOption(c => c.setName('limit').setDescription('maximal amount of processes to return').setRequired(false));
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const query = interaction.options.getString('query', false);
    const limit = interaction.options.getInteger('limit', false);
    try {
      const output = execSync(`ps aux ${query ? `| grep ${query}` : ''} ${limit ? `| head -n ${limit}` : ''}`);
      await interaction.editReply(respond_lengthy("", output.toString('utf-8'), 'ansi'));
    } catch (e) { await report(interaction, e); }
  }
}
