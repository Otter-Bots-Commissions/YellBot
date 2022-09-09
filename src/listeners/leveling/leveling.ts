import { ApplyOptions } from '@sapphire/decorators';
import { Listener, ListenerOptions } from '@sapphire/framework';
import type { Message } from 'discord.js';

@ApplyOptions<ListenerOptions>({
  event: 'messageCreate'
})
export class UserEvent extends Listener {
  public async run(message: Message) {
    if (message.author.bot) return;
    // XP addition
    if (await this.container.db.get(`levels_${message.guildId}_${message.member?.id}`) == undefined || await this.container.db.get(`levels_${message.guildId}_${message.member?.id}`) ==  null) this.container.db.set(`levels_${message.guildId}_${message.member?.id}`, 0);
    await this.container.db.add(`levels_${message.guildId}_${message.member?.id}`, 1);
    this.container.logger.info(`Added 1 xp to ${message.member?.id}`);
    this.container.logger.debug(await this.container.db.get(`levels_${message.guildId}_${message.member?.id}`));
    // Add role check
    const xp: any = await this.container.db.get(`levels_${message.guildId}_${message.member?.id}`);
    const roles: any = await this.container.db.get(`config_${message.guildId}.roles`) || [];
    roles.map((role: any) => {
      if (xp >= role.xp) {
        message.member?.roles.add(role.id);
      }
    });
  }
}
