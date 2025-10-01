import { Command } from "@sapphire/framework";
import { report } from "../util";
import { kill } from "node:process";

export class KillCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder => {
      builder.setName('kill')
        .setDescription('kills a process by its pid')
        .addIntegerOption(c => c.setName('pid').setDescription('the pid of the process to kill').setRequired(true))
        .addStringOption(c => c.setName('signal').setDescription('the signal to send').setRequired(false));
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const pid = interaction.options.getInteger('pid', true);
    const signal = interaction.options.getString('signal', false) ?? undefined;
    try {
      kill(pid, signal);
      await interaction.editReply(`killed \`${pid}\``);
    } catch (e) {
      await report(interaction, e);
    }
  }
}
