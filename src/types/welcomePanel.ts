import type { ColorResolvable, Snowflake} from "discord.js";

export interface IWelcomePanelDBObject {
    title: string
    description: string;
    color: ColorResolvable;
    messageId: Snowflake | undefined ;
    buttons: {
        info: IWelcomePanelInfoButtonsDBObject[] | [] | any;
        role: IWelcomePanelRoleButtonsDBObject[] | [] | any;
    }
}
export interface IWelcomePanelInfoButtonsDBObject {
    name: string;
    label: string;
    content: string;
}
export interface IWelcomePanelRoleButtonsDBObject {
    name: string;
    label: string;
    role: any;
}