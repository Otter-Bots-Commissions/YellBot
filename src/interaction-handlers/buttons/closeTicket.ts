import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import type { ButtonInteraction } from "discord.js";

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class UserInteractionHandler extends InteractionHandler {
    public override async run(interaction: ButtonInteraction) {
        interaction.reply({ content: `Closed Ticket!`, ephemeral: true });
        interaction.channel?.delete();
    }
    public override async parse(interaction: ButtonInteraction) {
        // Make sure the interaction you want is what you get
        if (!interaction.isButton()) return this.none();
        if (!interaction.customId.startsWith('closeTicket')) return this.none();
        return this.some();
    }
}