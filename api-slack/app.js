var SlackBot = require('slackbots');
var recast = require('recastai');


// Utility methods
function request(text, callback) {
  if (text != "") {
    CLIENT.textRequest(text, callback);
  } else {
    error(text);
  }
}

// Recast Client
const CLIENT = new recast.Client("6e2279f76259410654ada452d8c2404e");

// create a bot 
var bot = new SlackBot({
    token: '', // Add a bot https://my.slack.com/services/new/bot and put the token  
    name: 'smarterthingsbot'
});
 
bot.on('start', function() {
    // more information about additional params https://api.slack.com/methods/chat.postMessage
    console.log("start");
    var params = {
        icon_emoji: ':cat:'
    };

    function sendMessage(text) {
      bot.postMessageToChannel('general', text, params);
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

        if (data.type === "message" && data.user != undefined) {
            console.log("channel:", data.channel);
            console.log("user:", data.user);
            console.log("text:", data.text);
            console.log("ts:", data.ts);

            sendMessage("User: " + data.user + " sent: " + data.text);

            var message = data.text;

            request(message, (res, err) => {
              if (err == null) {
                console.log(res);
              } else {
                console.log("Error: " + err);

              }
            });

            request(message, (res, err) => {
              if (err == null) {
                console.log(res);
              } else {
                console.log("Error: " + err);
              }
            });
        }
    });
});
