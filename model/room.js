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
        if(fs.existsSync(global.__basedir + '/roomdata/' + roomId + '.json')){

            let objectData = JSON.parse(fs.readFileSync(global.__basedir + '/roomdata/' + roomId + '.json'));
            objectData.participants.push([name, chatId])

            let jsonData = JSON.stringify(objectData, null, 2);
            fs.writeFileSync(global.__basedir + '/roomdata/' + roomId + '.json', jsonData);
        }
    }

    start(bot) {
        let participants = JSON.parse(fs.readFileSync(global.__basedir + '/roomdata/' + this.owner + '.json')).participants
        let bag = [...participants]

        for(let i = 0; i < participants.length; i++) {
            const indexOfPartner = Math.floor(Math.random() * bag.length)
            // console.log(indexOfPartner)
            let partner = bag[indexOfPartner];
            if (partner[0] === participants[i][0]) {
                i-=1
            } else {
                //send message and remove
                console.log("pair for " + participants[i][0] + " is " + bag[indexOfPartner][0])
                bot.telegram.sendMessage(participants[i][1], "Your partner is " + bag[indexOfPartner][0])
                bag.splice(indexOfPartner, 1);
            }
        }
    }
}

module.exports = Room