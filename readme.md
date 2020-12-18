# ☃️ Secret Santa Bot

<b>Secret Santa Bot is a simple telegram bot for ones who want to attend secret santa with friends</b>

## 📟 Features

Bot is able to:

- Create unique room for people attending secret santa
- Randomly distribute pairs

## ⛔️ Possible bugs and failures

- This bot was written in a hurry, hence there might be some bugs. Be gentle :)
- I am planning on fixing critical errors, so please submit issues


## 💻 Installation
Download and install the latest version of [Node.js](https://nodejs.org/en/)

Clone this repo (or download latest [release](https://github.com/belotserkovtsev/secret-santa-bot/releases)), create one dir and install dependencies:
```bash
git clone https://github.com/belotserkovtsev/secret-santa-bot.git
cd secret-santa-bot
mkdir roomdata
npm install
```

Insert your bot token into <b>package.json</b> to <b>npm run app</b>:

```json
"scripts": {
    "app": "TOKEN=yourToken node app.js",
    "test": "mocha"
  }
```
Or right into app.js:
```js
const bot = new Telegraf('token');
```

Launch your application with <b>pm2</b>, <b>node</b> or <b>npm</b>

```bash
node app.js
```

## ❄️ Usage
If you want to host the room, just press "Create" button, enter your name and send room code to your friends. 
As soon as everyone joined press "Start" and everyone will be messaged with
the persons name who you are supposed to prepare present for. Press cancel at any time, and your room will be deleted

You can only create one room, but are able to join multiple ones (even your own. Twice. Its not a bug, but a feature i promise)

## 📱 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.