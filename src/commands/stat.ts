import { Command } from "@sapphire/framework";
import { stat } from "node:fs/promises";
import { check, report, respond_lengthy } from "../util";

export class StatCommand extends Command {
  public constructor(context: Command.LoaderContext, options: Command.Options) {
    super(context, { ...options });
  }

  public override registerApplicationCommands(registry: Command.Registry) {
    registry.registerChatInputCommand(builder => {
      builder.setName('stat')
        .setDescription('get stats of a file or directory')
        .addStringOption(c => c.setName('path').setDescription('file').setRequired(true));
    });
  }

  public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
    await interaction.deferReply();
    const path = interaction.options.getString('path', true);
    try {
      await check(interaction);
      const value = await stat(path);

      let z = '';
      z += `file: ${path}\n`;
      z += `size: ${value.size} bytes\n`;
      z += `uid: ${value.uid} | gid: ${value.gid} | dev: ${value.dev} | ino: ${value.ino}\n`;
      z += `links: ${value.nlink}\n`;
      z += `blocks: ${value.blocks} | block size: ${value.blksize}\n`;

      let t = [
        value.isBlockDevice() ? 'block device' : '',
        value.isCharacterDevice() ? 'character device' : '',
        value.isDirectory() ? 'directory' : '',
        value.isFile() ? 'file' : '',
        value.isSocket() ? 'socket' : '',
        value.isSymbolicLink() ? 'symlink' : '',
      ].filter(x => x !== '');
      z += `type ${t.join(', ')} (${value.mode})\n`;
      z += `accessed: ${value.atime.toISOString()}\n`;
      z += `modified: ${value.mtime.toISOString()}\n`;
      z += `status changed: ${value.ctime.toISOString()}\n`;
      z += `created: ${value.birthtime.toISOString()}`;

      await interaction.editReply(respond_lengthy("", z, "ansi"));
    } catch (e) {
      await report(interaction, e);
    }
  }
}
