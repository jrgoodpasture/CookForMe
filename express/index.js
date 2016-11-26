/*!
 * express
 * Copyright(c) 2009-2013 TJ Holowaychuk
 * Copyright(c) 2013 Roman Shtylman
 * Copyright(c) 2014-2015 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

module.exports = require('./lib/express');
var express = require('express')
var app = express()
var http = require('http');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use("/styles",  express.static(__dirname + '/stylesheets'));
app.use("/scripts", express.static(__dirname + '/javascripts'));
app.use("/images",  express.static(__dirname + '/images'));



var path = require('path');

var unirest = require('unirest');

app.post('/', function(req, res) {
    // HANDLE POST
    console.log('reached here')
    var data = req.body.val
    console.log(data)

    unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?limitLicense=false&number=10&offset=0&query="+data+"&type=main+course")
	.header("X-Mashape-Key", "9xDOL5oTurmshYJT2VeV7g7pxJ5kp1QNpa7jsn2vnL1Al6AcZJ")
	.header("Accept", "application/json")
	.end(function (result) {
  	console.log(result.status, result.headers, result.body);
});
    // DO STUFF WITH THE DATA
})

//These code snippets use an open-source library. http://unirest.io/nodejs
// unirest.get("https://spoonacular-recipe-food-nutrition-v1.p.mashape.com/recipes/search?limitLicense=false&number=10&offset=0&query=burger&type=main+course")
// .header("X-Mashape-Key", "9xDOL5oTurmshYJT2VeV7g7pxJ5kp1QNpa7jsn2vnL1Al6AcZJ")
// .header("Accept", "application/json")
// .end(function (result) {
//   console.log(result.status, result.headers, result.body);
// });

app.get('/', function (req, res) {
  //res.send('Hello World!')
  res.sendFile( __dirname + '/search.html');
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})