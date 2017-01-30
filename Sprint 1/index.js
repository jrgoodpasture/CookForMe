var done = false;

exports.handler = (event, context, callback) => {
    if (!done) {
        output("what would you like to cook today?", context);
        done = true;
    }
     else {
        var utter = event.request.intent.slots.ingredients.value;
        output("Finding Recipes for " + utter, context);
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