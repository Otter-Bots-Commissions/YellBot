import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { ButtonInteraction, MessageActionRow, MessageButton } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class UserInteractionHandler extends InteractionHandler {
    public override async run(interaction: ButtonInteraction) {
        // Do Whatever
        const channel = await interaction.guild?.channels.create(`ticket-${await this.container.db.get(`ticketCount_${interaction.guildId}`) || 0}`, {type: 'GUILD_TEXT'});
        channel?.setParent(await this.container.db.get(`config_${interaction.guildId}.ticket.category`));`)`;
        channel?.permissionOverwrites.edit(`${interaction.guildId}`, { VIEW_CHANNEL: false });
        channel?.permissionOverwrites.edit(`${interaction.user.id}`, { VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true });
        channel?.permissionOverwrites.edit(`${this.container.client.user?.id}`, { VIEW_CHANNEL: true, SEND_MESSAGES: true, READ_MESSAGE_HISTORY: true });
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('closeTicket')
                    .setLabel('Close Ticket')
                    .setStyle('DANGER'),
                new MessageButton()
                    .setCustomId('transcriptTicket')
                    .setLabel('Generate Transcript')   
                    .setStyle('SECONDARY'),
            );
        interaction.reply({ content: `Created Ticket!`, ephemeral: true });
        channel?.send({ content: `Ticket control panel`, components: [row] });
        await this.container.db.add(`ticketCount_${interaction.guildId}`, 1)
    }
    public override async parse(interaction: ButtonInteraction) {
        // Make sure the interaction you want is what you get
        if (!interaction.isButton()) return this.none();
        if (!interaction.customId.startsWith('openTicket')) return this.none();
        return this.some();
    }
}