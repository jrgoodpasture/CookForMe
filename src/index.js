'use strict';
var Alexa = require("alexa-sdk");
var unirest = require("unirest");
var mysql = require("mysql");
var appId = 'amzn1.ask.skill.754eb63a-1172-440b-a711-8bd1a23d0c2f';

var prevState = '';
var instructionSteps = [];
var ingredientsArr = [];
var currentStep = 0;
var recipeName = '';
var continued = false;
var saved = false;
var userid = '';
var sqlinfo = {
                host     : 'cookformedb.ci5n0kf1z0rv.us-east-1.rds.amazonaws.com',
                user     : 'cookforme',
                password : 'Soundify2017',
                port     : '3306',
                database : 'cookformedb'
            }
var connection;

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

    'Continue': function() {
        continued = true;
        this.emit('GetFromDatabase');
    },

    'GetFromDatabase': function() {

        var userid = this.event.session.user.userId;
        var current = this;
		connectToDB();

        if(!connection){
			console.log("DB not connected");
    	}

    	var queryString = "INSERT INTO USER_HISTORY VALUES " + "(\'" + userid + "\', \'" + prevState + "\', \'" + recipeName + "\', " + currentStep + ")" +
        " ON DUPLICATE KEY UPDATE intent =\'" + prevState + "\', recipe= \'" + recipeName + "\', stepNum = " + currentStep;

        if (continued)
        	queryString = "SELECT * FROM USER_HISTORY WHERE User_ID = \'" + userid + "\'";

        console.log(queryString);
        connection.query(queryString, function(err, rows, fields) {
            if (err) {
                throw err;
            }
            if (continued) {
            	//console.log("Continuing");
	            prevState = rows[0].intent;
	            recipeName = rows[0].recipe;
	            currentStep = rows[0].stepNum;
        	}

            console.log("State: " + prevState + "name: " + recipeName + "currentStep: " + currentStep);

            //connection.end(function() {
            	if (continued) {
            		continued = false;
	                if (prevState == 'GetInstruction') {
	                    current.emit('GetInstruction');
	                } else if (prevState == 'GetInstructionStepByStep') {
	                    current.emit('GetInstructionStepByStep');
	                } else {
	                    current.emit(':tell', "failed");
	                }
	            } else {
	            	saved = true;
	            	current.emit('SayStep');
	            }
                // current.emit(':tell', 'failed');
           // });
        });
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
                                        current.emit(':ask', "I could not find the recipe.", "What else would you like to cook today?");
                                    }
                                });

                    } else {
                        current.emit(':ask', "Could not find the recipe.", "What else would you like to cook today?");
                    }
                });
    },

    'GetInstructionStepByStep': function() {

        prevState = 'GetInstructionStepByStep';
        console.log("current:  " + current);

        var current = this;

        var name = '';

        var sqlinfo = {
                host     : 'cookformedb.ci5n0kf1z0rv.us-east-1.rds.amazonaws.com',
                user     : 'cookforme',
                password : 'Soundify2017',
                port     : '3306',
                database : 'cookformedb'
            }

		connectToDB();
		// If the recipe name does not exist, it is set equal to what was said
		// The else if checks if something exists in the request slot and then sees if recipeName is equal to it
        if (!recipeName) {
        	//console.log("Test1");
            recipeName = current.event.request.intent.slots.ingredients.value;   
        } else if (current.event.request.intent.slots != undefined && recipeName && recipeName != current.event.request.intent.slots.ingredients.value) {
            //console.log("Test2");
        	recipeName = current.event.request.intent.slots.ingredients.value;
        	currentStep = 1;
        }
        console.log("Recipe name: " + recipeName);

        name = recipeName.split(" ").join("+");

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
                                        var counter = 0;

                                        for (var i = 0; i < instruction.length; i++) {
                                            instructionSteps[i] = instruction[i].step;
                                             for (var j = 0; j < instruction[i].ingredients.length; j++) {
                                                 ingredientsArr[counter++] = instruction[i].ingredients[j].name;
                                            } 
                                        }
                                        if (!currentStep) {
                                            currentStep = 1;
                                        }

                                        current.emit('SayStep', currentStep);

                                    } else {
                                        current.emit(':ask', "I could not find the recipe.", "What else would you like to cook today?");
                                    }
                                });

                    } else {
                        current.emit(':ask', "Could not find the recipe.", "What else would you like to cook today?");
                    }
                });
    },

    'ModifyRecipe': function() {
        var current = this;
        console.log(current.event.request.intent.slots.ingredients.value);
        var ing = current.event.request.intent.slots.ingredients.value.split(" to ");
        var idx = ingredientsArr.indexOf(ing[0]);
        console.log(ing[0], ing[1], idx);
        console.log(ingredientsArr);
        var modified = "{\"name\":\"\", \"steps\": ["; 
        if (idx > -1) {
            var speechOutput = "";
            for (var i = 0; i < instructionSteps.length; i++) {
                speechOutput += (" Step " + (i + 1) + ": " + instructionSteps[i].split(ing[0]).join(ing[1]) + ".");
                modified += "{\"number\":" + (i + 1) + ", \"step\":" + instructionSteps[i].split(ing[0]).join(ing[1]) 
                    + ", \"ingredients\":[], \"equipment\":[]},";
                instructionSteps[i] = instructionSteps[i].split(ing[0]).join(ing[1]);
            }
            modified = modified.substring(0, modified.length-1);
            modified += "]}";
            console.log(modified);
            var json = JSON.stringify(eval("(" + modified + ")"));
            speechOutput = speechOutput.replace("(PRINTABLE)", "");
            
            current.emit('SayStep', 1);
        } else {
            current.emit(':tell', "The " + ing[0] + " does not exist in the recipe")
        }
    },

    'SayStep': function(stepNumber) {
    	var current = this;
        userid = current.event.session.user.userId;
        if (stepNumber < instructionSteps.length && stepNumber > 0) {
            var message = "Step " + stepNumber + ": " + instructionSteps[stepNumber - 1] + ". ";
            message += "Would you like to continue?";
            //saveState();
            if (!saved) {
            	console.log("Not saved... saving")
            	current.emit('GetFromDatabase');
            }
            saved = !saved;
            current.emit(':ask', message);
        } else {
        	console.log("Step Num: " + stepNumber + "   Steps Length: " + instructionSteps.Length);
        	current.emit(':tell', "Could not get this step.");
        }
    },

    'AMAZON.YesIntent': function() {
    	var current = this;
    	if (prevState == 'GetInstructionStepByStep') {
    		currentStep += 1;
    		current.emit('SayStep', currentStep);
    	} else {
    		current.emit('Unhandled');
    	}
    },

    'AMAZON.NoIntent': function() {
        this.emit('Stop');
    },

    'RepeatStep': function() {
    	var current = this;
    	if (prevState == 'GetInstructionStepByStep') {
    		current.emit('SayStep', currentStep);
    	} else {
    		current.emit('Unhandled');
    	}
    },

    'AMAZON.StopIntent': function() {
        this.emit(':tell', "See you next time!");
    },

    'AMAZON.HelpIntent': function() {
        var message = "You can ask me to find a recipe by saying, find me recipes for ... burgers. "
        message += "Or you can ask me to get instructions for a recipe by saying, get me instructions for ... taco burger."
        this.emit(':ask', message);
    },

    'Unhandled': function() {
        var message = "I didn't get what you said. What would you like me to do?";
        this.emit(':ask', message);
    }
};

function saveState() {

    var sqlinfo = {
            host     : 'cookformedb.ci5n0kf1z0rv.us-east-1.rds.amazonaws.com',
            user     : 'cookforme',
            password : 'Soundify2017',
            port     : '3306',
            database : 'cookformedb'
        }

    var connection = mysql.createConnection(sqlinfo);
    connection.connect(function(err){
		if(err){
		    console.log('Error connecting to Db');
		    return;
		}
		console.log('Connection established');
	});

    var queryString = "INSERT INTO USER_HISTORY VALUES " + "(\'" + userid + "\', \'" + prevState + "\', \'" + recipeName + "\', " + currentStep + ")" +
        " ON DUPLICATE KEY UPDATE intent =\'" + prevState + "\', recipe= \'" + recipeName + "\', stepNum = " + currentStep;

    console.log(queryString);

    connection.query(queryString, function(err, rows, fields) {
        if (err) {
            throw err;
        }
        connection.end();
    });
}

function connectToDB() {
	if (!connection) {
		connection = mysql.createConnection(sqlinfo);
	    connection.connect(function(err) {
			if (err) {
				console.log('error connecting: ' + err.stack);
			} else {
				console.log('DB connection successful!');
			}
		});
	}

}
