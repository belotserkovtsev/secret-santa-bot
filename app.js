const Telegraf = require('telegraf');
const Stage = require('telegraf/stage');
const session = require('telegraf/session');
const BaseScene = require('telegraf/scenes/base');
const fs = require('fs');
const Room = require('./model/room');
global.__basedir = __dirname;

const bot = new Telegraf(process.env.TOKEN);

/* Making staging work, initializing session for personalized statistics */

const stage = new Stage();
bot.use(session())
bot.use(stage.middleware())

const room = new BaseScene('room');
stage.register(room);

const enterRoom = new BaseScene('enterRoom');
stage.register(enterRoom);

const createRoom = new BaseScene('createRoom');
stage.register(createRoom);

const enterNameJoinRoom = new BaseScene('enterNameJoinRoom');
stage.register(enterNameJoinRoom);

bot.telegram.getMe().then((botInfo) => {
    bot.options.username = botInfo.username
});

enterNameJoinRoom.on("message", ctx => {
    Room.join(ctx.chat.id, ctx.session.roomCodeToJoin, ctx.message.text)
    ctx.reply("Joined successfully. Wait for your message", Telegraf.Markup.keyboard([['Join', 'Create']]).
    oneTime().resize().extra())
    ctx.session.roomCodeToJoin = null //fix that shit
    ctx.scene.leave()
})

createRoom.hears("Cancel", ctx => {
    ctx.reply("Canceled", Telegraf.Markup.keyboard([['Join', 'Create']]).
    oneTime().resize().extra())
    ctx.scene.leave()
})

createRoom.on("message", ctx => {
    ctx.session.room = new Room(ctx.message.text, ctx.from.id, ctx.chat.id)
    ctx.scene.enter("room")
})

enterRoom.hears("Cancel", ctx => {
    ctx.scene.leave()
    ctx.reply("Canceled",
        Telegraf.Markup.keyboard([['Join', 'Create']]).
        oneTime().resize().extra())
})

enterRoom.on("message", ctx => {
    ctx.session.roomCodeToJoin = ctx.message.text
    ctx.scene.enter("enterNameJoinRoom")
        .then(_ => {
        ctx.reply("Enter name")
    })
})

room.enter(ctx => {
    ctx.replyWithHTML('🤖 <b>You joined your room. Room id is ' + ctx.from.id + '</b>',
        Telegraf.Markup.keyboard([['Refresh', 'Start', 'Cancel']]).
        oneTime().resize().extra())
})

room.hears("Cancel", ctx => {
    fs.unlinkSync(global.__basedir + '/roomdata/' + ctx.from.id + '.json')
    ctx.reply("Room was deleted",
        Telegraf.Markup.keyboard([['Join', 'Create']]).
        oneTime().resize().extra())
    ctx.scene.leave()
})

room.hears("Start", ctx => {
    ctx.session.room.start(bot)
})

bot.hears("Create", ctx => {
    if(!fs.existsSync("./roomdata/" + ctx.from.id + ".json")) {
        ctx.reply("Enter your name",  Telegraf.Markup.keyboard([['Cancel']]).
        oneTime().resize().extra())
            .then(_ => {
                ctx.scene.enter('createRoom')
            })
    } else {
        ctx.session.room = new Room(null, ctx.from.id, null, true)
        ctx.scene.enter("room")
    }
})

bot.hears("Join", ctx => {
    ctx.reply("Enter room code", Telegraf.Markup.keyboard([['Cancel']]).
    oneTime().resize().extra())
        .then(_ => {
        ctx.scene.enter("enterRoom")
    })
})

bot.start(async ctx => {
    await ctx.replyWithHTML('🤖 <b>Welcome to secret santa bot!</b> ' +
        'Use menu to start new secret santa ' +
        'or join an existing one',
        Telegraf.Markup.keyboard([['Join', 'Create']]).
        oneTime().resize().extra())
});

bot.launch()