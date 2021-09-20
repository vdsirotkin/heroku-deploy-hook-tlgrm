import { localeActions } from './handlers/language'
// Setup @/ aliases for modules
import 'module-alias/register'
// Config dotenv
import * as dotenv from 'dotenv'
dotenv.config({ path: `${__dirname}/../.env` })
// Dependencies
import { bot } from '@/helpers/bot'
import { ignoreOldMessageUpdates } from '@/middlewares/ignoreOldMessageUpdates'
import { sendHelp } from '@/handlers/sendHelp'
import { i18n, attachI18N } from '@/helpers/i18n'
import { setLanguage, sendLanguage } from '@/handlers/language'
import { attachUser } from '@/middlewares/attachUser'

import * as express from 'express'
import * as bodyParser from 'body-parser'
import {sendNotification} from "@/handlers/sendNotification";

// Middlewares
bot.use(ignoreOldMessageUpdates)
bot.use(attachUser)
bot.use(i18n.middleware(), attachI18N)
// Commands
bot.command(['help', 'start'], sendHelp)
bot.command('language', sendLanguage)
// Actions
bot.action(localeActions, setLanguage)
// Errors
bot.catch(console.error)
// Start bot
bot.launch().then(() => {
  console.info(`Bot ${bot.botInfo.username} is up and running`)
})

const app = express()
app.use(bodyParser.urlencoded({extended: true}))
app.post("/hook", async (req: HerokuPushRequest, res) => {
  console.log(req.body)
  try {
    await sendNotification(bot, req.body)
    res.status(200).end()
  } catch (e) {
    console.log(e)
    res.status(500).end()
  }
})

interface HerokuPushRequest extends express.Request<{}, {}, HerokuPush> {}

export interface HerokuPush {
  app: string,
  user: string,
  url: string,
  head: string,
  head_long: string,
  prev_head: string,
  git_log: string,
  release: string,
}

//app=secure-woodland-9775&user=example%40example.com&url=http%3A%2F%2Fsecure-woodland-9775.herokuapp.com&head=4f20bdd&head_long=4f20bdd&prev_head=&git_log=%20%20*%20Michael%20Friis%3A%20add%20bar&release=v7

app.listen(8080, () => console.log('started web server'))