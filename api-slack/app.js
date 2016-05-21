var SlackBot = require('slackbots');
var recast = require('recastai');
var request = require('request');


// Utility methods
function sendRequestToRecast(text, callback) {
  if (text != "") {
    CLIENT.textRequest(text, callback);
  } else {
    error(text);
  }
}

// Recast Client
const CLIENT = new recast.Client("6e2279f76259410654ada452d8c2404e");

// Intent consts
const INTENT_HELLOGREETINGS = "hello-greetings";
const INTENT_LIGHTS = "lights";

function sendSmartThingsCommand(commandObject) {
    request.post(
    {
        headers: {
          "Authorization": "Bearer 6d0e2a98-c65c-4938-a4fa-04089c88d50e",
          'Content-Type': 'application/json'
        },
        uri: 'https://graph.api.smartthings.com/api/smartapps/installations/9516b0a3-d929-4c05-891a-d5b93ae87f34/devices/switches/a365ec3f-41de-49d7-973e-9efee9191000/commands',
        body: JSON.stringify(
            commandObject
        ),
        method: 'POST'
        }, function (err, res, body) {
            if (err) {
                console.error("SmartThings:", err);
                return;
            }
            console.log("SmartThings:", body);
        }
    );
}

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

    function sendMessageToSlackBot(text) {
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

            var message = data.text;

            sendRequestToRecast(message, function(res, err) {
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

                var intents = res.raw.results.intents;
                // console.log("Recast:", intents);
                var sentences = res.raw.results.sentences;
                // sentences can be > 1

                var filterForIntents = [INTENT_HELLOGREETINGS, INTENT_LIGHTS];

                var intentFiltered = "";
                for (var f = 0; f < filterForIntents.length; f++) {
                    if (intents.indexOf(filterForIntents[f]) > -1) {
                        intentFiltered = filterForIntents[f];
                    }
                }

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
                }

                console.log("Recast:", "Sentence:");
                console.log("Recast:", "type:", sentences_type);
                console.log("Recast:", "action:", sentences_action);
                console.log("Recast:", "noun:", noun);
                console.log("Recast:", "adjective:", adjective);
                console.log("\n");

                sendMessageToSlackBot("message: " + message + "\naction: " + sentences_action);

                if (intentFiltered) {
                    switch (intentFiltered) {
                        case INTENT_HELLOGREETINGS:
                            console.log("Script:", "Custom Intent:", INTENT_HELLOGREETINGS);
                        break;
                        case INTENT_LIGHTS:
                            if (sentences_action === "turn off") {
                                sendSmartThingsCommand({"command":"off","params":{}});
                            } else {
                                sendSmartThingsCommand({"command":"on","params":{}});
                            }
                        break;
                        default:
                            console.warn("failed to find filtered intent", intentFiltered);
                    }
                } else {
                    // Use noun, adjective
                    // Use more logic to understand what is happening
                }
            });
        }
    });
});
