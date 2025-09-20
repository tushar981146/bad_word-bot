const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv')
const checker = require("leo-profanity")
const express = require('express')

dotenv.config();

const app = express()

app.use(express.json());

const token = process.env.bot_token;


const bot = new TelegramBot(token, { polling: false});

const URL = process.env.RENDER_EXTERNAL_URL; // Your Render HTTPS URL


bot.setWebHook(`${URL}/bot${token}`);

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

console.log('working ----------------------------------------------------');


bot.on('message', async (msg) => {

    if (msg) {

        console.log(msg);
        
        const messageId = msg.message_id;
        const input = msg.text
        const chatId = msg.chat.id;
        const admins =  await bot.getChatAdministrators(chatId);
        const creator = admins.find(a => a.status === "creator");
        const owner = creator.user.username || creator.user.first_name;
        const ownerId = creator.user.id;
        const text = `owner @${owner},  @${msg.from.username}  is making trouble in this group`
        if (checker.check(input)) {

            if(creator.user.username === msg.from.username) {
                await bot.sendMessage(
                ownerId, `${owner} please be calm`, {
                reply_to_message_id: msg.message_id
                });
            }

            else {
                await bot.sendMessage(
                chatId, `${text}`, {
                reply_to_message_id: msg.message_id
            });
            }

            await bot.deleteMessage(chatId, messageId);
            console.log(`Deleted message: ${msg.text}`);
        };
    };

});

bot.on('polling_error', (error) => {
    console.error(`[POLLING ERROR] Code: ${error.code}, Message: ${error.message}`);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});