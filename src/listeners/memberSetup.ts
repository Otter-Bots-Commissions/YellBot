import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { GuildMember } from 'discord.js';

@ApplyOptions<ListenerOptions>({
	event: 'guildMemberAdd',
})
export class UserEvent extends Listener {
	public run(member: GuildMember) {
		this.container.db.set(`levels_${member.guild.id}_${member.id}`, 0);
		this.container.logger.info(`Added ${member.user.username} to the database`);
	}
}
