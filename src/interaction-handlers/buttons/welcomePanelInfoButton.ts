import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { ButtonInteraction, MessageEmbed } from "discord.js";
import type { IWelcomePanelDBObject } from '../../types/welcomePanel.js';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class UserInteractionHandler extends InteractionHandler {
    public override async run(interaction: ButtonInteraction, customId: string) {
        const btnName = customId[1];
        const dbField: IWelcomePanelDBObject = await this.container.db.get(`welcomePanel_${interaction.guildId}_${interaction.channelId}`) || {
			title: "Welcome to the server!",
			description: "Please read the rules and enjoy your stay!",
			color: "RANDOM",
            messageId: undefined,
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
        const btn = dbField.buttons.info.find((btn: any) => btn.name === btnName);
        if (!btn) return;
        const embed = new MessageEmbed()
            .setTitle(btn.label)
            .setDescription(btn.content)
            .setColor(dbField.color);
        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
    public override async parse(interaction: ButtonInteraction) {
        // Make sure the interaction you want is what you get
        if (!interaction.isButton()) return this.none();
        if (!interaction.customId.startsWith('infoBtn')) return this.none();
        const customId = interaction.customId.split(`_`);
        return this.some(customId);
    }
}