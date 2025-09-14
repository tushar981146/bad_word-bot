const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv')
const checker = require("leo-profanity")
const express = require('express')

dotenv.config();

const app = express()

app.use(express.json());

const token = '8119835279:AAEqielr4FGSkDPmHNcG_Iq5SAMANP5pP_Y';


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
        // const text = "shut your mouth"
        const chatId = msg.chat.id;
        const ownerId = 1852300364
        const owner = "tushar8282282822828"
        const text = `owner ${owner},  ${msg.from.username}  is making trouble in this group`
        if (checker.check(input)) {

            if(ownerId === msg.chat.username) {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});