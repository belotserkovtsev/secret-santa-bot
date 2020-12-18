# 👻 Secret Santa Bot

<b>Secret Santa Bot is a simple telegram bot for ones who want to attend secret santa with friends</b>

## 📟 Features

Bot is able to:

- Create unique room for people attending secret santa
- Randomly distribute pairs


## 💻 Installation
Download and install the latest version of [Node.js](https://nodejs.org/en/)

Clone this repo and install dependencies:
```bash
git clone https://github.com/belotserkovtsev/secret-santa-bot.git
cd secret-santa-bot
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