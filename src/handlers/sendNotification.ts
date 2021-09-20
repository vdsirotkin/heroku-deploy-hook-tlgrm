import {Telegraf} from "telegraf";
import {findAll} from "@/models";
import {HerokuPush} from "@/app";
import Mustache = require("mustache");
import {i18n} from "@/helpers/i18n";

export async function sendNotification(bot: Telegraf, push: HerokuPush) {
    const users = await findAll();
    for (const {id, language} of users) {
        const template = i18n.t(language,'notification');
        await bot.telegram.sendMessage(id, Mustache.render(template, push), {parse_mode: "HTML"})
    }
}