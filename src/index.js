
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

    	var current = this;

        var ingredient = current.event.request.intent.slots.ingredients.value;

        var url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?limitLicense=false&number=5&offset=0&query=" + ingredient + "&type=main+course";       

        console.log("***** Find ***** " + url);
        
        console.log("***** Unirest Call *****");

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
                    } else {
                        speechOutput = "No recipes found";
                    }
                    console.log(speechOutput);
                    current.emit(':tell', speechOutput);
                });
    },
	'GetInstruction': function() {
		var current = this;
		var name = current.event.request.intent.slots.food.value;
		console.log("*************" + name);

    	var key = "9xDOL5oTurmshYJT2VeV7g7pxJ5kp1QNpa7jsn2vnL1Al6AcZJ";
    	var url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?limitLicense=false&number=1&offset=0&query=" + name + "&type=main+course";
    	// //Getting the recipe id
    	unirest.get(url)
                .header("X-Mashape-Key", "9xDOL5oTurmshYJT2VeV7g7pxJ5kp1QNpa7jsn2vnL1Al6AcZJ")
                .header("Accept", "application/json")
                .end(function (result) {
                    console.log(result.status, result.headers, result.body);
                          
                    var recipes = result.body.results;
                    var id = 0;
                                        
                    if (result.body.totalResults > 0) {
                    	id = recipes[0].id;

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
				                		current.emit(':ask', "Could not find the recipe you wanted.", "What else would you like to cook today?");
				                	}
				                });

                    } else {
                        current.emit(':ask', "Could not find the recipe you wanted.", "What else would you like to cook today?");
                    }
                });
    },
    'Unhandled': function () {
		var message = "What would you like to cook today?";
		this.emit(':ask', message);
	}
};