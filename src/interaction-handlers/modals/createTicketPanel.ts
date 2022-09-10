import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { MessageActionRow, MessageButton, ModalSubmitInteraction } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.ModalSubmit,
})
export class UserInteractionHandler extends InteractionHandler {
    public override async run(interaction: ModalSubmitInteraction) {
        const content = interaction.fields.getTextInputValue('ticketPanel_text');
        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setCustomId('openTicket')
                    .setLabel('Create Ticket')
                    .setStyle('PRIMARY')
            )
        interaction.channel?.send({content: content, components: [row]});
        interaction.reply({ content: 'Ticket panel created!', ephemeral: true });
    }
    public override async parse(interaction: ModalSubmitInteraction) {
        // Make sure the interaction you want is what you get
        if (!interaction.isModalSubmit()) return this.none();
        if (!interaction.customId.startsWith('ticketPanel')) return this.none();
        return this.some();
    }
}