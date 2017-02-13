var done = true;
var unirest = require("unirest");

exports.handler = (event, context, callback) => {
    if (!done) {
        output("what would you like to cook today?", context);
        done = true;
    } else {
        var utter = event.request.intent.slots.ingredients.value;
        // output("Finding Recipes for " + utter, context);

        var url = "https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?limitLicense=false&number=5&offset=0&query="+utter+"&type=main+course";

        unirest.get(url)
                .header("X-Mashape-Key", "9xDOL5oTurmshYJT2VeV7g7pxJ5kp1QNpa7jsn2vnL1Al6AcZJ")
                .header("Accept", "application/json")
                .end(function (result) {
                    var recipes = result.body.results;
                    var speechOutput = '';
                    if (recipes.length >= 0) {
                        for (var i = 0; i < recipes.length && i < 5; i++) {
                            speechOutput += (" Number " + (i + 1) + " " + recipes[i].title + ".");
                        }
                        output(speechOutput, context);
                    } else {
                        output("No recipes", context);
                    }
                });
    }
};

function output( text, context ) {

    var response = {
        outputSpeech: {
            type: "PlainText",
            text: text
        },
        card: {
            type: "Simple",
            title: "CookForMe",
            content: text
        },
        shouldEndSession: false
    };
    
    context.succeed( { response: response } );
}