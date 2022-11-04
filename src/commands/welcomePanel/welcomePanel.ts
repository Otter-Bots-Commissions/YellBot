import { ApplyOptions } from '@sapphire/decorators';
import { Command} from '@sapphire/framework';
import { MessageActionRow, MessageButton, MessageEmbed } from 'discord.js';
import type { IWelcomePanelDBObject } from '../../types/welcomePanel.js';

@ApplyOptions<Command.Options>({
	description: 'A basic slash command'
})
export class UserCommand extends Command {
	public override registerApplicationCommands(registry: Command.Registry) {
		registry.registerChatInputCommand((builder) =>
			builder //
				.setName(this.name)
				.setDescription(this.description)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('send')
						.setDescription('Send a new welcome panel')
				)
				.addSubcommandGroup((subcommandGroup) =>
					subcommandGroup
						.setName('info')
						.setDescription('Info subcommand group')
						.addSubcommand((subcommand) =>
							subcommand
								.setName('addinfobutton')
								.setDescription('Add a new info button')
								.addStringOption((option) =>
									option
										.setName('label')
										.setDescription('the label of the button')
										.setRequired(true)
								)
								.addStringOption((option) =>
									option
										.setName('content')
										.setDescription('the content of the button')
										.setRequired(true)
								)
						)
						.addSubcommand((subcommand) =>
							subcommand
								.setName('deleteinfobutton')
								.setDescription('Delete an info button')
								.addStringOption((option) =>
									option
										.setName('label')
										.setDescription('the label of the button')
										.setRequired(true)
								)
						)
				)
				.addSubcommandGroup((subcommandGroup) =>
					subcommandGroup
						.setName('role')
						.setDescription('Role subcommand group')
						.addSubcommand((subcommand) =>
							subcommand
								.setName('addrolebutton')
								.setDescription('Add a new role button')
								.addStringOption((option) =>
									option
										.setName('label')
										.setDescription('the label of the button')
										.setRequired(true)
								)
								.addRoleOption((option) =>
									option
										.setName('role')
										.setDescription('the role of the button')
										.setRequired(true)
								)
						)
						.addSubcommand((subcommand) =>
							subcommand
								.setName('deleterolebutton')
								.setDescription('Delete a role button')
								.addStringOption((option) =>
									option
										.setName('label')
										.setDescription('the label of the button')
										.setRequired(true)
								)
						)
				)
		)
		{
			idHints: ["1035832126442057779"]
		}
	}

	public override async chatInputRun(interaction: Command.ChatInputInteraction) {
		switch (interaction.options.getSubcommand()) {
			case 'send':
				return await this.createPanel(interaction);
		}
		if (interaction.options.getSubcommandGroup() === 'info') {
			switch (interaction.options.getSubcommand()) {
				case 'addinfobutton':
					return await this.addInfoButton(interaction);
				case 'deleteinfobutton':
					return await this.deleteInfoButton(interaction);
			}
		}
		if (interaction.options.getSubcommandGroup() === 'role') {
			switch (interaction.options.getSubcommand()) {
				case 'addrolebutton':
					return await this.addRoleButton(interaction);
				case 'deleterolebutton':
					return await this.deleteRoleButton(interaction);
			}
		}
	}
	private async deleteRoleButton(interaction: Command.ChatInputInteraction) {
		const dbField: IWelcomePanelDBObject = await this.container.db.get(`welcomePanel_${interaction.guildId}_${interaction.channelId}`) || {
			title: "Welcome to the server!",
			description: "Please read the rules and enjoy your stay!",
			messageId: undefined,
			color: "RANDOM",
			buttons: {
				info: [{
					name: "hi",
					label: "Hi",
					content: "You Can delete this button",
				}],
				role: [
					{
                        name: "delete_this",
                        label: "delete this",
                        role: "",
                    }
				]
			}
		};
		const btns = dbField.buttons.role;
		if (btns.find((btn: any) => btn.name === interaction.options.getString('label', true).replace(' ', '_'))) {
			dbField.buttons.role = btns.filter((btn: any) => btn.name !== interaction.options.getString('label', true).replace(' ', '_'));
			await this.container.db.set(`welcomePanel_${interaction.guildId}_${interaction.channelId}`, dbField);
			return interaction.reply({ content: `Deleted button ${interaction.options.getString('label', true)} from the role buttons!`, ephemeral: true });
		} else {
			return interaction.reply({ content: `Button ${interaction.options.getString('label', true)} not found!`, ephemeral: true });
		}
	}
	private async addRoleButton(interaction: Command.ChatInputInteraction) {
		const dbField: IWelcomePanelDBObject = await this.container.db.get(`welcomePanel_${interaction.guildId}_${interaction.channelId}`) || {
			title: "Welcome to the server!",
			description: "Please read the rules and enjoy your stay!",
			messageId: undefined,
			color: "RANDOM",
			buttons: {
				info: [{
					name: "hi",
					label: "Hi",
					content: "You Can delete this button",
				}],
				role: [
					{
                        name: "delete_this",
                        label: "delete this",
                        role: "",
                    }
				]
			}
		};
		// Create the button JSON
		const btn = {
			name: `${interaction.options.getString('label', true).replace(' ', '_')}`,
			label: `${interaction.options.getString('label', true)}`,
			role: `${interaction.options.getRole('role', true).id}`
		}
		dbField.buttons.role.push(btn);
		await this.container.db.set(`welcomePanel_${interaction.guildId}_${interaction.channelId}`, dbField);
		return interaction.reply({ content: `Added button ${btn.label} to the role buttons!`, ephemeral: true });
	}
	private async deleteInfoButton(interaction: Command.ChatInputInteraction) {
		const dbField: IWelcomePanelDBObject = await this.container.db.get(`welcomePanel_${interaction.guildId}_${interaction.channelId}`) || {
			title: "Welcome to the server!",
			description: "Please read the rules and enjoy your stay!",
			messageId: undefined,
			color: "RANDOM",
			buttons: {
				info: [{
					name: "hi",
					label: "Hi",
					content: "You Can delete this button",
				}],
				role: [
					{
                        name: "delete_this",
                        label: "delete this",
                        role: "",
                    }
				]
			}
		};
		const btns = dbField.buttons.info;
		if (btns.find((btn: any) => btn.name === interaction.options.getString('label', true).replace(' ', '_'))) {
			dbField.buttons.info = btns.filter((btn: any) => btn.name !== interaction.options.getString('label', true).replace(' ', '_'));
			await this.container.db.set(`welcomePanel_${interaction.guildId}_${interaction.channelId}`, dbField);
			return interaction.reply({ content: `Deleted button ${interaction.options.getString('label', true)} from the info buttons!`, ephemeral: true });
		} else {
			return interaction.reply({ content: `Button ${interaction.options.getString('label', true)} not found!`, ephemeral: true });
		}
	}
	private async addInfoButton(interaction: Command.ChatInputInteraction) {
		const dbField: IWelcomePanelDBObject = await this.container.db.get(`welcomePanel_${interaction.guildId}_${interaction.channelId}`) || {
			title: "Welcome to the server!",
			description: "Please read the rules and enjoy your stay!",
			messageId: undefined,
			color: "RANDOM",
			buttons: {
				info: [{
					name: "hi",
					label: "Hi",
					content: "You Can delete this button",
				}],
				role: [
					{
                        name: "delete_this",
                        label: "delete this",
                        role: "",
                    }
				]
			}
		};
		// Create the button JSON
		const btn = {
			name: `${interaction.options.getString('label', true).replace(' ', '_')}`,
			label: `${interaction.options.getString('label', true)}`,
			content: `${interaction.options.getString('content', true)}`
		}
		dbField.buttons.info.push(btn);
		await this.container.db.set(`welcomePanel_${interaction.guildId}_${interaction.channelId}`, dbField);
		return interaction.reply({ content: `Added button ${btn.label} to the info buttons!`, ephemeral: true });
	}
	private async createPanel(interaction: Command.ChatInputInteraction) {
		// Get Field from DB and set defaults
		const dbField: IWelcomePanelDBObject = await this.container.db.get(`welcomePanel_${interaction.guildId}_${interaction.channelId}`) || {
			title: "Welcome to the server!",
			description: "Please read the rules and enjoy your stay!",
			messageId: undefined,
			color: "RANDOM",
			buttons: {
				info: [{
					name: "hi",
					label: "Hi",
					content: "You Can delete this button",
				}],
				role: [
					{
                        name: "delete_this",
                        label: "delete this",
                        role: "",
                    }
				]
			}
		};
		// Generate Embed
		const embed = new MessageEmbed()
			.setTitle(dbField.title)
			.setDescription(dbField.description)
			.setColor(dbField.color);
		// Compute Buttons
		const row = new MessageActionRow()
		row.addComponents(
			new MessageButton()
				.setCustomId('roleBtnMaster')
				.setLabel('Roles')
				.setStyle('PRIMARY')
		)
		dbField.buttons.info.map((button: any) => {
			row.addComponents(
				new MessageButton()
					.setCustomId(`infoBtn_${button.name}`)
					.setLabel(button.name)
					.setStyle("SECONDARY")
			)
		});
		// Send Message
		const msg = await interaction.channel?.send({ embeds: [embed], components: [row] });
		// Delete old message
		if (dbField.messageId) interaction.channel?.messages.delete(dbField.messageId);
		dbField.messageId = msg?.id;
		// Reply to interaction
		interaction.reply({ content: "Welcome Panel Sent!", ephemeral: true });
		// Set the DB Field
		await this.container.db.set(`welcomePanel_${interaction.guildId}_${interaction.channelId}`, dbField);
	}
}
