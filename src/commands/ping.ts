import { Command } from "@sapphire/framework";
import { check, report } from "../util";

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
    try {
      await check(interaction);
      await interaction.editReply({ content: a + "ms" });
    } catch (e) {
      await report(interaction, e);
    }
  }
}
