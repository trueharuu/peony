import { ApplicationCommandRegistry, Awaitable, ChatInputCommand, Command } from "@sapphire/framework";
import { ChatInputCommandInteraction } from "discord.js";

export class PingCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder => {
      builder.setName('ping').setDescription('is bot working')
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();
    let a = Date.now() - interaction.createdTimestamp;
    await interaction.editReply({ content: a + "ms" });
  }
}
