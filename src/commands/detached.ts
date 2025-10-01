import { Command } from "@sapphire/framework";
import { execSync, spawn } from "node:child_process";
import { report, respond_lengthy } from "../util";

export class DetachedCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder => {
      builder.setName('detach')
        .setDescription('runs any command in a separate process')
        .addStringOption(c => c.setName('command').setDescription('command to run').setRequired(true));
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const command = interaction.options.getString('command', true);
    try {
      const value = spawn(command, { detached: true, shell: true });
      value.unref();
      await interaction.editReply('ok');
    } catch (e) { await report(interaction, e); }
  }
}
