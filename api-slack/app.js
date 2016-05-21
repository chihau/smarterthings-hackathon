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

var binaryAdjectiveMap = {
    "open" : 1,
    "close" : 0
}

// Recast Client
const CLIENT = new recast.Client("6e2279f76259410654ada452d8c2404e");

// create a bot 
var bot = new SlackBot({
    token: process.env.SLACK_TOKEN, // Add a bot https://my.slack.com/services/new/bot and put the token  
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

        if (data.type === "message" && data.user) {
            console.log("Slack:", "channel:", data.channel);
            console.log("Slack:", "user:", data.user);
            console.log("Slack:", "text:", data.text);
            console.log("Slack:", "ts:", data.ts);

            sendMessage("User: " + data.user + " sent: " + data.text);

            var message = data.text;

            request(message, function(res, err) {
                if (err) {
                    console.error("Recast:", "Error: " + err);
                    return;
                }

                // {
                //     "source": "are my windows closed?",
                //     "intents": [
                //         "windows"
                //     ],
                //     "sentences": [
                //         {
                //             "source": "are my windows closed?",
                //             "type": "yes_no",
                //             "action": "be",
                //             "agent": "my window",
                //             "polarity": "positive",
                //             "entities": {}
                //         }
                //     ],
                //     "version": "0.1.4",
                //     "timestamp": "2016-05-21T21:24:57+02:00",
                //     "status": 200
                // }

                // console.log("Recast:", res.raw.results.sentences);

                var sentences = res.raw.results.sentences;
                // sentences can be > 1

                var noun = "";
                var adjective = "";

                for (var i = 0; i < sentences.length; i++) {
                    // type can be "yes_no", or "command"
                    var sentence = sentences[i];
                    var sentences_type = sentence.type;
                    var sentences_action = sentence.action;
                    var sentences_agent = sentence.agent;
                    var sentences_polarity = sentence.polarity;
                    var sentences_entities = sentence.entities;

                    if (typeof sentences_entities === "array") {
                        // This is the use-case when multiple sentences are asked
                        for (var j; j < sentences_entities.length; j++) {
                            var entity = sentences_entities[j];
                            // console.log("Recast:", JSON.stringify(entity, null, 2));
                        }
                    } else {
                        // console.log("Recast:", JSON.stringify(sentences_entities, null, 2));
                        var entity = sentences_entities;
                        noun = entity.noun ? (entity.noun[0] || entry.noun).value : "";
                        adjective = entity.adjective ? (entity.adjective[0] || entry.adjective).value : "";
                    }

                    console.log("Recast:", "Sentence:");
                    console.log("Recast:", "type:", sentences_type);
                    console.log("Recast:", "action:", sentences_action);
                    console.log("Recast:", "noun:", noun);
                    console.log("Recast:", "adjective:", adjective);
                    console.log("Script:", "binary:", binaryAdjectiveMap[adjective]);
                    console.log("\n");
                }

            });
        }
    });
});
