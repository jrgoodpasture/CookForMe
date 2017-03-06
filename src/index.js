
'use strict';
var Alexa = require("alexa-sdk");
var unirest = require("unirest");
var appId = 'amzn1.ask.skill.4233738b-7e2a-4fa6-888e-70c9fcd89686';

var prevState = '';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {

    'LaunchRequest': function() {
        prevState = 'LaunchRequest';
        var message = 'What would you like to cook today?';
        this.emit(':ask', message);
    },

    'Find': function() {

        prevState = 'Find';

        var current = this;

        var ingredient = current.event.request.intent.slots.ingredients.value;

        var url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?limitLicense=false&number=5&offset=0&query=" + ingredient + "&type=main+course";       

        unirest.get(url)
                .header("X-Mashape-Key", "9xDOL5oTurmshYJT2VeV7g7pxJ5kp1QNpa7jsn2vnL1Al6AcZJ")
                .header("Accept", "application/json")
                .end(function (result) {
                    console.log(result.status, result.headers, result.body);
                          
                    var recipes = result.body.results;
                    
                    var speechOutput = '';
                    
                    if (result.body.totalResults > 0) {
                        for (var i = 0; i < recipes.length; i++) {
                            speechOutput += (" Number " + (i + 1) + ": " + recipes[i].title + ".");
                        }
                        speechOutput = speechOutput.replace("&", "and");
                        current.emit(':tell', speechOutput)
                    } else {
                        current.emit(':ask', "I could not find any recipes.")
                    }
                });
    },

    'GetInstruction': function() {

        prevState = 'GetInstruction';

        var current = this;
        var name = current.event.request.intent.slots.ingredients.value.split(" ").join("+");

        var key = "9xDOL5oTurmshYJT2VeV7g7pxJ5kp1QNpa7jsn2vnL1Al6AcZJ";
        var url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/autocomplete?number=1&query=" + name;
        
        // //Getting the recipe id
        
        unirest.get(url)
                .header("X-Mashape-Key", "9xDOL5oTurmshYJT2VeV7g7pxJ5kp1QNpa7jsn2vnL1Al6AcZJ")
                .header("Accept", "application/json")
                .end(function (result) {
                    console.log(result.status, result.headers, result.body);
                          
                    var recipes = result.body;
                    var id = 0;
                                        
                    if (result.body.length > 0) {
                        id = recipes[0] .id;

                        var url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/" + id + "/analyzedInstructions?stepBreakdown=true";
                        unirest.get(url)
                                .header("X-Mashape-Key", "9xDOL5oTurmshYJT2VeV7g7pxJ5kp1QNpa7jsn2vnL1Al6AcZJ")
                                .header("Accept", "application/json")
                                .end(function (result) {
                                    console.log(result.status, result.headers, result.body);
                                    if (result.body.length > 0) {
                                        var instruction = result.body[0].steps;

                                        var speechOutput = '';

                                        for (var i = 0; i < instruction.length; i++) {
                                            speechOutput += (" Step " + (i + 1) + ": " + instruction[i].step + ".");
                                        }

                                        speechOutput = speechOutput.replace("(PRINTABLE)", "");

                                        current.emit(':tell', speechOutput);
                                    } else {
                                        current.emit(':ask', "I could not find the recipe.", "What else would you like to cook today?");
                                    }
                                });

                    } else {
                        current.emit(':ask', "Could not find the recipe.", "What else would you like to cook today?");
                    }
                });
    },

    'AMAZON.StopIntent': function () {
        this.emit(':tell', "See you next time!");
    },

    'AMAZON.HelpIntent': function () {
        var message = "You can ask me to find a recipe by saying, find me recipes for ... burgers. "
        message += "Or you can ask me to get instructions for a recipe by saying, get me instructions for ... taco burger."
        this.emit(':ask', message);
    },

    'Unhandled': function() {
        var message = "I didn't get what you said. What would you like me to do?";
        this.emit(':ask', message);
    }
};
