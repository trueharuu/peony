import { Command } from "@sapphire/framework";
import { execSync } from "node:child_process";
import { report, respond_lengthy } from "../util";

export class ExecCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder => {
      builder.setName('exec')
        .setDescription('runs any command')
        .addStringOption(c => c.setName('command').setDescription('command to run').setRequired(true));
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const command = interaction.options.getString('command', true);
    try {
      const value = execSync(command);
      await interaction.editReply(respond_lengthy('', value.toString('utf-8'), 'ansi'));
    } catch (e) { await report(interaction, e); }
  }
}
