import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

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
						.setDescription('The user to get the XP of.')
				)
		)
		{
			idHits: ['1017522085196742757']
		}
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		const user = interaction.options.getUser('user') || interaction.user;
		const xp = await this.container.db.get(`levels_${interaction.guildId}_${user.id}`);
		interaction.reply({content: `User ${user.username} has ${xp} xp`, ephemeral: true});
	}
}
