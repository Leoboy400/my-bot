const TelegramBot = require('node-telegram-bot-api');
const options = require('./options');
const { gameOptions, againOptions } = require('./options.js')


const token = '6516265634:AAGtJVciKMLFbqLHkFmum6-dbb76a0kneIw';
const bot = new TelegramBot(token, { polling: true });




// bot.onText(/\/echo (.+)/, function (msg, match) {
//   var fromId = msg.from.id; // Получаем ID отправителя
//   var resp = match[1]; // Получаем текст после /echo
//   bot.sendMessage(fromId, resp);
// });


const chats = {}

const startGame = async (chatId) => {
  await bot.sendMessage(chatId, `Я загадал цыфру от 0 до 9, а ты отгадывай`);
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, 'Отгадай!', gameOptions)
}
const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начало работы с ботом' },
    { command: '/info', description: 'Твое имя и юзернейм' },
    { command: '/game', description: 'Игра угадай цифру' },
  ])

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const firstТame = msg.chat.first_name;
    const text = msg.text;

    if (text === "/start") {
      await bot.sendMessage(chatId, 'Привет дебич')
      await bot.sendSticker(chatId, 'CAACAgIAAxkBAQx0b2U8FV4xXb9XWfrH5LEAAX9B0QwZ7AACZQ8AAnJ7kUimcDEhKO2_XDAE')
      return;
    }

    if (text === "/info") {
      await bot.sendMessage(chatId, `Ты ${msg.from.first_name} ${msg.from.username}`)
      await bot.sendMessage(chatId, `${new Date()} для пользователя ${firstТame}`);
      return;
    }

    if (text === "/game") {
      startGame(chatId)
    }

    console.log(msg)


  });

  bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id;
    if (data == '/again') {
      return startGame(chatId)
    }
    if (data == chats[chatId]) {
      await bot.sendMessage(chatId, `Браво ты угадал, это реально была цифра ${chats[chatId]}`, againOptions)
      return
    } else {
      await bot.sendMessage(chatId, `СОСИ НУБЛО правильный ответ -  ${chats[chatId]}`, againOptions)
    }
    console.log(msg)
  })

}

start()