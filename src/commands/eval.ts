import { Command } from "@sapphire/framework";
import { inspect } from "node:util";
import { check, respond_lengthy } from "../util";

export class EvalCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder => {
      builder.setName('eval')
        .setDescription('runs a node.js script')
        .addStringOption(c => c.setName('script').setDescription('the script to run').setRequired(true));
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const script = interaction.options.getString('script', true);
    let value;
    try {
      await check(interaction);
      value = await eval(script);
    } catch (e) {
      value = e;
    }
    await interaction.editReply(respond_lengthy('', inspect(value, { colors: true }), 'ansi'));
  }
}
