import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from 'discord.js';

@ApplyOptions<Command.Options>({
	description: 'Create a ticket panel',
	requiredUserPermissions: ['MANAGE_GUILD'],
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder 
				.setName(this.name)
				.setDescription(this.description)
		)
		{
			idHints: ['1017901309787127839']
		}
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		const modal = new Modal()
		.setCustomId('ticketPanel')
		.setTitle('Ticket Panel')

		const panelText = new TextInputComponent()
		.setCustomId('ticketPanel_text')
		.setPlaceholder('Enter the text for the panel')
		.setLabel('Panel Text')
		.setStyle('PARAGRAPH')
		const ActionRow = new MessageActionRow<ModalActionRowComponent>().addComponents(panelText);
		modal.addComponents(ActionRow);
		await interaction.showModal(modal);
	}
}
