var SlackBot = require('slackbots');
 
// create a bot 
var bot = new SlackBot({
    token: 'xoxb-44793896054-XIdcvJTyqeAjfBLrLudZi6bH', // Add a bot https://my.slack.com/services/new/bot and put the token  
    name: 'smarterthingsbot'
});
 
bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    console.log("start");
    var params = {
        icon_emoji: ':cat:'
    };
    
    // // define channel, where bot exist. You can adjust it there https://my.slack.com/services  
    // bot.postMessageToChannel('general', 'meow!', params);
    
    // // define existing username instead of 'user_name' 
    // bot.postMessageToUser('user_name', 'meow!', params); 
    
    // // define private group instead of 'private_group', where bot exist 
    // bot.postMessageToGroup('private_group', 'meow!', params); 

    
    bot.on('message', function(data) {
        // all ingoing events https://api.slack.com/rtm 
        // console.log(data);

        if (data.type === "message") {
            console.log("channel:", message.channel);
            console.log("user:", message.user);
            console.log("text:", message.text);
            console.log("ts:", message.ts);
        }
    });
});
