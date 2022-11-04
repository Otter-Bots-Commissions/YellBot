import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';

@ApplyOptions<Command.Options>({
	description: 'ticket config setup command',
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addChannelOption((option) =>
					option
						.setName('category')
						.setDescription('The category to create the ticket channel in')
						.setRequired(true)
				)
		)
		{
			IdHints: ['1017901309787127839', '1038170026559156384']
		}
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		const category = interaction.options.getChannel('category');
		const role = interaction.options.getRole('role');
		if (!category || !role) return interaction.reply({ content: 'Something went wrong', ephemeral: true });
		this.container.db.set(`config_${interaction.guildId}.ticket.category`, category.id);
		return interaction.reply({ content: 'Setup Complete!', ephemeral: true });
	}
}
