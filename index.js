
'use strict';
var Alexa = require("alexa-sdk");
var unirest = require("unirest");
var appId = 'amzn1.ask.skill.4233738b-7e2a-4fa6-888e-70c9fcd89686';

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);
    alexa.appId = appId;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {

    'Find': function () {

        var ingredient = this.event.request.intent.slots.ingredients.value;

        var url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?limitLicense=false&number=5&offset=0&query=" + ingredient + "&type=main+course";       

        this.emit('Calling', this, url);
    },
    'Calling': function(that, url) {

        console.log("***** Find ***** " + url);
        
        console.log("***** Unirest Call *****");

        unirest.get(url)
                .header("X-Mashape-Key", "9xDOL5oTurmshYJT2VeV7g7pxJ5kp1QNpa7jsn2vnL1Al6AcZJ")
                .header("Accept", "application/json")
                .end(function (result) {
                    console.log(result.status, result.headers, result.body);
                          
                    var recipes = result.body.results;
                    
                    var speechOutput = '';
                    
                    if (recipes.length >= 0) {
                        for (var i = 0; i < recipes.length && i < 5; i++) {
                            speechOutput += (" Number " + (i + 1) + ": " + recipes[i].title + ".");
                        }
                    } else {
                        speechOutput = "No recipes found";
                    }
                    console.log(speechOutput);
                    that.emit(':tell', speechOutput);
                });
    }
};