import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';

const TOKEN = process.env['TOKEN'];
const URL = process.env['URL'];

const bot = new TelegramBot(TOKEN, { polling: true });

const weatherButton = {
    reply_markup: {
        keyboard: [[{ text: 'Weather in Kyiv' }],],
    },
};

const selectButton = {
    reply_markup: {
        keyboard: [
            [{ text: 'Every 3 hours' }, { text: 'Every 6 hours' }],
        ],
    },
};

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text;

    let interval;

    const getWeather = async () => {
        try {
            const response = await axios.get(URL);
            let forecasts = response.data.list;

            messageConstructor(forecasts);
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, 'Failed to receive data');
        }
    };

    const messageConstructor = (forecasts) => {
        let text = '';
        if (interval === 3 ){
            forecasts = forecasts.slice(0, 8) 
            forecasts.forEach(el => {
                text += `Date: ${el.dt_txt}\n`;
                text += `Weather: ${el.weather[0].description}\n`;
                text += `Temperature: ${el.main.temp}°C\n`;
                text += `Clouds: ${el.clouds.all}%\n`;
                text += `\n`;
    
            });
        } else if ( interval === 6){
            forecasts = forecasts.filter((el, index) => index % 2 === 1 ).slice(0, 4) 
            forecasts.forEach(el => {
                text += `Date: ${el.dt_txt}\n`;
                text += `Weather: ${el.weather[0].description}\n`;
                text += `Temperature: ${el.main.temp}°C\n`;
                text += `Clouds: ${el.clouds.all}%\n`;
                text += `\n`;
            });
        }
        bot.sendMessage(chatId, text);
    };

    switch (message) {
        case 'Weather in Kyiv':
            bot.sendMessage(chatId, 'Select interval', selectButton);
            break;
        case 'Every 3 hours':
            interval = 3;
            getWeather();
            break;
        case 'Every 6 hours':
            interval = 6;
            getWeather();
            break;
        default:
            bot.sendMessage(chatId, 'Tap on Weather', weatherButton);
            break;
    }
});
