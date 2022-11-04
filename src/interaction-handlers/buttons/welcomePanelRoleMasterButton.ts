import { ApplyOptions } from '@sapphire/decorators';
import { InteractionHandler, InteractionHandlerTypes } from "@sapphire/framework";
import { MessageActionRow, MessageButton, MessageEmbed, ModalSubmitInteraction } from "discord.js";
import type { IWelcomePanelDBObject } from '../../types/welcomePanel.js';

@ApplyOptions<InteractionHandler.Options>({
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class UserInteractionHandler extends InteractionHandler {
    public override async run(interaction: ModalSubmitInteraction) {
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
                ],
			}
		};
        const embed = new MessageEmbed()
            .setTitle("Role Menu")
            .setDescription("Please select a role to get or remove")
            .setColor(dbField.color);
        const row = new MessageActionRow();
        dbField.buttons.role.map((btn: any) => {
            row.addComponents(
                new MessageButton()
                    .setCustomId(`roleBtn_${btn.name}`)
                    .setLabel(btn.label)
                    .setStyle("PRIMARY")
            )
        });
        await interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    }
    public override async parse(interaction: ModalSubmitInteraction) {
        // Make sure the interaction you want is what you get
        if (!interaction.isButton()) return this.none();
        if (!interaction.customId.startsWith('roleBtnMaster')) return this.none();
        return this.some();
    }
}