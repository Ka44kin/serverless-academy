import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import NodeCache from 'node-cache';
const cache = new NodeCache({ stdTTL: 600 });


const TOKEN = '';// Bot token
const API_KEY = ''; // OpenWeather API key
const url = `https://api.openweathermap.org/data/2.5/forecast?lat=50.390205&lon=30.154007&units=metric&appid=${API_KEY}`;
const urlPrivat = 'https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11';
const urlMono = 'https://api.monobank.ua/bank/currency';


const bot = new TelegramBot(TOKEN, { polling: true });

const menuButton = {
    reply_markup: {
        keyboard: [[{ text: 'Weather in Kyiv' }], [{ text: 'Exchange Rates' }]],
    },
};

const selectButton = {
    reply_markup: {
        keyboard: [
            [{ text: 'Every 3 hours' }, { text: 'Every 6 hours' },{ text: 'Back' }],
        ],
    },
};

const selectCurrency = {
    reply_markup: {
        keyboard: [
            [{ text: 'USD' }, { text: 'EUR' },{ text: 'Back' }],
        ],
    },
};

let cachedCourse = null;

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const message = msg.text;

    let interval;
    let selectedCurrency;
    let monoCourse;
    let forecasts;

    const currencyCode = {
        USD: 840,
        EUR: 978,
        UAH: 980,
      };

    const getWeather = async () => {
        try {
            const response = await axios.get(url);
            forecasts = response.data.list;

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

    const getMonoCourse = async () => {
        await 
            axios
                .get(urlMono)
                .then(response => {
                    monoCourse = response.data;
                    if (cache.has('monoCourse') === false){
                        cache.set('monoCourse', monoCourse, 3600);
                        cachedCourse = cache.get('monoCourse')
                        monoConstructor(cachedCourse, selectedCurrency);
                    }
                })
    }

    const callMono = () => {
        if (cache.has('monoCourse') === true){
            monoConstructor(cachedCourse, selectedCurrency);
        } else {
            getMonoCourse();
        }
    }

    const monoConstructor = (cachedCourse, selectedCurrency) => {
        const currencyCode = {
            USD: 840,
            EUR: 978,
            UAH: 980,
        };

        let text = 'Monobank course: \n';
      
        const currencyInfo = cachedCourse.find(item => 
            item.currencyCodeA === currencyCode[selectedCurrency] && item.currencyCodeB === currencyCode.UAH);
      
        if (currencyInfo) {
          text += `Currency: ${selectedCurrency}\n`;
          text += `Buy: ${currencyInfo.rateBuy}\n`;
          text += `Sale: ${currencyInfo.rateSell}\n`;
      
          bot.sendMessage(chatId, text);
        }
      }

    const getPrivateCourse = async () => {
        try {
            const response = await axios.get(urlPrivat);
            const course = response.data;
            const messageText = privateConstructor(course);
        } catch (error) {
            console.error(error);
            bot.sendMessage(chatId, 'Failed to receive data');
        }
    }
    
    const privateConstructor = (course) => {
        let text = 'Privat Bank course: \n'

        const selectedCurrency = message === 'EUR' ? 'EUR' : 'USD';
        const currencyInfo = course.find(item => item.ccy === selectedCurrency);
    
        if (currencyInfo) {
            text += `Currency: ${currencyInfo.ccy}\n`;
            text += `Buy: ${currencyInfo.buy}\n`;
            text += `Sale: ${currencyInfo.sale}\n`;
            
        bot.sendMessage(chatId, text);
        }
    }

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
        case 'Exchange Rates':
            bot.sendMessage(chatId, 'Select currency', selectCurrency);
            break;
        case 'USD':
            selectedCurrency = message
            callMono();
            getPrivateCourse();
            break;
        case 'EUR':
            selectedCurrency = message
            callMono();
            getPrivateCourse();
            break;
        case 'Back':
            bot.sendMessage(chatId, 'Select option', menuButton);
            break;
        default:
            bot.sendMessage(chatId, 'Select option', menuButton);
            break;
    }
});
