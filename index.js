const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv')
const checker = require("leo-profanity")
const express = require('express')

dotenv.config();

const app = express()

app.use(express.json());

const token = process.env.bot_token;


const bot = new TelegramBot(token, { polling: true });

const URL = process.env.RENDER_EXTERNAL_URL; // Your Render HTTPS URL


bot.setWebHook(`${URL}/bot${token}`);

app.post(`/bot${token}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

console.log('Bot is running...');

bot.on('message', async (msg) => {
    console.log(msg);


    if (msg) {
        const messageId = msg.message_id;
        const input = msg.text
        const chatId = msg.chat.id;
        const ownerId = process.env.owner_ID;
        const owner = process.env.ownerUserName;
        const text = `owner ${owner},  ${msg.from.username}  is making trouble in this group`
        if (checker.check(input)) {

            if(owner === msg.chat.username) {
                await bot.sendMessage(
                ownerId, `${ownerId} please be calm`, {
                reply_to_message_id: msg.message_id
                });
            }

            await bot.sendMessage(
                chatId, `${text}`, {
                reply_to_message_id: msg.message_id
            });

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