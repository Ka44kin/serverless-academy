import TelegramBot from 'node-telegram-bot-api';
import { Command } from 'commander';

const program = new Command();
const TOKEN = ''; // bot token
const ID = ''; // your telegram id

const bot = new TelegramBot(TOKEN , { polling: true })

program
    .command('help')
    .action(() => {
        console.log('Message or m: send message to the telegram bot after m/Message flag \nphoto: send photo to the telegram bot, just drug and drop it to console, after p/Photo flag')
        process.exit();
    });

program
    .command('Message <message>' )
    .alias('m')
    .action((message) => {
        bot.sendMessage(ID, message)
        .then(() => process.exit())
    });

program
    .command('Photo <path>')
    .alias('p')
    .action((path) => {
        bot.sendPhoto(ID, path)
        .then(() => process.exit())
    });
    
program.parse(process.argv);


