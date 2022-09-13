import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import type { ButtonInteraction, TextChannel } from "discord.js";
import { GenerateTranscript } from '../../lib/Transcript/generate.js';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class UserInteractionHandler extends InteractionHandler {
    public override async run(interaction: ButtonInteraction) {
        const transcript = new GenerateTranscript(interaction.channel as TextChannel);
        interaction.reply({ content: `transcript of the last 100 messages generated, it will be kept around for 6 days and be accessible to anyone\n${await transcript.paste()}`, ephemeral: true });
    }
    public override async parse(interaction: ButtonInteraction) {
        // Make sure the interaction you want is what you get
        if (!interaction.isButton()) return this.none();
        if (!interaction.customId.startsWith('transcriptTicket')) return this.none();
        return this.some();
    }
}