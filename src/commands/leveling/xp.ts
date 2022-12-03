import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
/*import  Canvas from '@napi-rs/canvas';
import { readFile } from 'fs/promises';
import { MessageAttachment } from 'discord.js';*/

@ApplyOptions<Command.Options>({
	description: 'Your XP'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder 
				.setName(this.name)
				.setDescription(this.description)
				.addUserOption((option) =>
					option
						.setName('user')
						.setDescription('The user to get the xp of')
				)
		)
		{
			idHits: ['1017522085196742757', '1038170029352550450']
		}
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		const user = interaction.options.getUser('user') || interaction.user;
		if (await this.container.db.get(`levels_${interaction.guildId}_${user.id}`) == undefined) this.container.db.set(`levels_${interaction.guildId}_${user.id}`, 0);
		if (await this.container.db.get(`levels_${interaction.guildId}_${user.id}`) ==  null) this.container.db.set(`levels_${interaction.guildId}_${user.id}`, 0)
		const xp = await this.container.db.get(`levels_${interaction.guildId}_${user.id}`);
		this.container.logger.debug(xp);
		interaction.reply({content: `User ${user.username} has ${xp} xp`, ephemeral: true, /*attachments: [await this.buildCanvas()]*/});
	}
	/*private async buildCanvas() {
		const canvas = Canvas.createCanvas(700, 250);
		const context = canvas.getContext('2d');
		//const backgroundFile = await readFile(`${process.env.ASSETS_BASE_URL}/pngs/canvas-bg.png`);
		const backgroundFile = await readFile(`../../../assets/pngs/canvas-bg.png`);
		const background = new Canvas.Image();
		background.src = backgroundFile;
		context.drawImage(background, 0, 0, canvas.width, canvas.height);
		const attachment = new MessageAttachment(canvas.toBuffer('image/png'), 'profile-image.png');
		return attachment;
	}*/
}
