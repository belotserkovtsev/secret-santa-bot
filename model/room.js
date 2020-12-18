const fs = require('fs');

class Room {

    constructor(name, userId, chatId, exists = false) {
        if (!exists) {
            this.owner = userId;

            let data = {
                owner: userId,
                participants: [
                    [name, chatId]
                ]
            };

            let dataJSON = JSON.stringify(data, null, 2);
            fs.writeFileSync(global.__basedir + '/roomdata/' + userId + '.json', dataJSON);
        } else {
            this.owner = userId;
        }
    }

    static join(chatId, roomId, name) {
        return new Promise((resolve, reject) => {
            if(fs.existsSync(global.__basedir + '/roomdata/' + roomId + '.json')) {
                __lock.acquire('join', () =>{
                    let objectData = JSON.parse(fs.readFileSync(global.__basedir + '/roomdata/' + roomId + '.json'));
                    objectData.participants.push([name, chatId])

                    let jsonData = JSON.stringify(objectData, null, 2);
                    fs.writeFileSync(global.__basedir + '/roomdata/' + roomId + '.json', jsonData);
                    return resolve(true)
                })
            } else {
                return resolve(false)
            }
        })

    }

    start(bot) {
        return new Promise((resolve, reject) => {
            let participants = JSON.parse(
                fs.readFileSync(global.__basedir + '/roomdata/' + this.owner + '.json')
            ).participants

            let bag = [...participants]

            for(let i = 0; i < participants.length; i++) {
                const indexOfPartner = Math.floor(Math.random() * bag.length)
                // console.log(indexOfPartner)
                let partner = bag[indexOfPartner];
                if (partner[0] === participants[i][0]) {
                    i-=1
                } else {
                    //send message and remove
                    // console.log("pair for " + participants[i][0] + " is " + bag[indexOfPartner][0])
                    bot.telegram.sendMessage(participants[i][1], "You are preparing present for " + bag[indexOfPartner][0])
                    bag.splice(indexOfPartner, 1);
                }
            }
            resolve(true)
        })

    }
}

module.exports = Room