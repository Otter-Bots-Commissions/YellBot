import { fetch} from "@sapphire/fetch";
import type { TextChannel } from "discord.js";
interface JSONhastebinPlaceholder {
    key: string;
}
export class GenerateTranscript {
    private channel: TextChannel;
    constructor(channel: TextChannel) {
        this.channel = channel;
    }
    public async format() {
        const messages = await this.channel.messages.fetch({ limit: 100 });
        const arr = messages.map((message) => {
            return `${message.author.tag}#${message.author.discriminator} - ${message.content}`;
        });
        const formatted = `TiCKET TRANSCRIPT\n-----------------\n${arr.join(`\n`)}`;
        return formatted;
    }
    public async paste() {
        const res = await fetch<JSONhastebinPlaceholder>(`https://hastebin.com/documents`, {
            method: "POST",
            body: await this.format(),
        })
        return `https://hastebin.com/${res.key}`;
    }
}