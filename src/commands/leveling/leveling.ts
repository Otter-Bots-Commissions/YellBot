import { ApplyOptions } from '@sapphire/decorators';
import { CommandOptions, Command, ChatInputCommand} from '@sapphire/framework'
import { inlineCodeBlock } from '@sapphire/utilities';

@ApplyOptions<CommandOptions>({
	description: 'The leveling tree of commands for config / admin',
	requiredUserPermissions: ['MANAGE_GUILD'],
})
export class UserCommand extends Command {
	public async chatInputRun(interaction: Command.ChatInputInteraction) {
		switch (interaction.options.getSubcommand()) {
			case 'add':
				return await this.addRole(interaction);
			case 'remove':
				return await this.removeRole(interaction);
			case 'reset':
				return await this.resetXp(interaction);
			case 'set':
				return await this.setXp(interaction);
			default:
				return interaction.reply({content: 'Invalid subcommand', ephemeral: true});
		}
	}
	private async resetXp(interaction: Command.ChatInputInteraction) {
		const user = interaction.options.getUser('user');
		await this.container.db.set(`level_${interaction.guildId}_${user?.id}`, 0);
		interaction.reply({content: `Reset ${inlineCodeBlock((user?.username) as any)}'s xp`, ephemeral: true});
	}
	private async setXp(interaction: Command.ChatInputInteraction) {
		const user = interaction.options.getUser('user');
		const xp = interaction.options.getInteger('xp');
		await this.container.db.set(`level_${interaction.guildId}_${user?.id}`, xp);
		this.container.logger.debug(await this.container.db.get(`level_${interaction.guildId}_${user?.id}`));
		interaction.reply({content: `Set ${inlineCodeBlock((user?.username) as any)}'s xp to ${xp}`, ephemeral: true});
	}
	private async removeRole(interaction: Command.ChatInputInteraction) {
		const role = interaction.options.getRole('role');
		const roles: any = await this.container.db.get(`config_${interaction.guildId}.roles`) || [];
		const newRoles = roles.filter((r: any) => r.id !== role?.id);
		await this.container.db.set(`config_${interaction.guildId}.roles`, newRoles);
		interaction.reply({content: `Removed ${role?.name} from the leveling system`, ephemeral: true});
	}
	private async addRole(interaction: Command.ChatInputInteraction) {
		const role = interaction.options.getRole('role');
		const xp = interaction.options.getInteger('xp');
		const roles: any = await this.container.db.get(`config_${interaction.guildId}.roles`) || [];
		roles.push({ id: role?.id, xp: xp});
		await this.container.db.set(`config_${interaction.guildId}.roles`, roles);
		interaction.reply({content: `Added ${role?.name} to the leveling system`, ephemeral: true});
	}
	public override registerApplicationCommands(registry: ChatInputCommand.Registry) {
		registry.registerChatInputCommand((builder) =>
		  builder
		  	.setName(this.name)
			.setDescription(this.description)
			.addSubcommandGroup((group) =>
			  group
			  	.setName('roles')
				.setDescription('The config subtree for levelling roles')
				.addSubcommand((subcommand) =>
					subcommand
						.setName('add')
						.setDescription('Add a role to the levelling system')
						.addRoleOption((option) =>
							option
								.setName('role')
								.setDescription('The role to add')
								.setRequired(true)
						)
						.addIntegerOption((option) =>
							option
								.setName('xp')
								.setDescription('The amount of xp required to get the role')
								.setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('remove')
						.setDescription('Remove a role from the levelling system')
						.addRoleOption((option) =>
							option
								.setName('role')
								.setDescription('The role to remove')
								.setRequired(true)
					)
				)
			)
			.addSubcommandGroup((group) =>
			  group
			  	.setName('admin')
				.setDescription('The admin subtree for levelling')
				.addSubcommand((subcommand) =>
					subcommand
						.setName('reset')
						.setDescription('Reset the xp of a user')
						.addUserOption((option) =>
							option
								.setName('user')
								.setDescription('The user to reset')
								.setRequired(true)
						)
				)
				.addSubcommand((subcommand) =>
					subcommand
						.setName('set')
						.setDescription('Set the xp of a user')
						.addUserOption((option) =>
							option
								.setName('user')
								.setDescription('The user to set')
								.setRequired(true)
					)
					.addIntegerOption((option) =>
						option
							.setName('xp')
							.setDescription('The amount of xp to set')
							.setRequired(true)
					)
				)
			)
		)
		{
			idHints: ['1017475017015037953', '1038170030845743224']
		}
	  }
}
