# CookForMe
Amazon Alexa Skill for our Junior Design Project to aid in cooking

## Contributors
Min Jung, Min Ho Lee, Jacob Goodpasture, Rohan Avalani, Seth Davis

## Try our Wiki Page
Want a more concise, spread-out view? Try our Wiki Page.

## Node Version
Lambda function needs 4.3 and above

## Node Dependencies
* mysql
* unirest
* alexa-sdk


# Detailed Installation Guide

## Installing Node.js
Node.js must be installed first for this project since we are using node modules.

Install from [here](https://nodejs.org/en)

## Cloning Github Repository
This repository must be cloned or downloaded to use the code. An example is below:
```
git clone https://github.com/jrgoodpasture/CookForMe.git
```
Must use own application ID and copy it into index.js (can be found in AWS).

## Installing Node Modules
Inside the /src directory, there is a file called package.json. This file contains all the dependencies for this project.

Install them using command below inside the /src directory:
```
npm install
```
This will create a /node_module directory inside /src for the dependencies

## AWS
Amazon Web Services is required for this project. Create an account from [here](https://aws.amazon.com/).

Getting started with Lambda functions can be found [here](http://docs.aws.amazon.com/lambda/latest/dg/getting-started.html).

### CLI
The command line interface is required to publish using the batch or shell script

Install from [here](https://aws.amazon.com/cli/)

Detailed guide to setting up is also provided in the link.

### Developer Portal
Set up the lambda function in AWS and connect it with the [developer portal](developer.amazon.com).

Copy and paste contents of Intent_Schema.txt into Intent Schema

Copy and paste contents of INGREDIENT.txt into custom slot values and name the slot INGREDIENT

Copy and paste contents of Sample_Utterances.txt into Sample Utterances

## Publishing
Use the scripts provided to send the /src directory zipped to AWS. Example is below for Windows and Unix, respectively:
```
publish
```
or
```
./publish.sh
```
Must have AWS CLI setup and must edit script to publish to correct lambda function

## Spoonacular API
An account must be made from [here](https://market.mashape.com/spoonacular/recipe-food-nutrition).

Currently, a username and password is provided.

## Database
This project is using a mysql database in AWS. Creating a new database is possible but not currently required.


# FAQ
## What is CookForMe?
* The goal of this project was to create a hands free cooking assistant in the kitchen using Amazon’s Alexa. The features for CookForMe include the ability to find and read out recipes, modify recipes, and recommend recipes. 

## How do I use it?
Simply say “Alexa, CookForMe” to turn on the alexa skill. Say “help” to find the commands you can use or look at “What commands can I use?” question below.

## What commands can I use?
* Find me recipe for .. “recipe”: CookForMe will search the recipe and return top 5 recipes from Spoonacular API.

* Get me instructions for… “recipe”: CookForMe will read of the instruction of the recipe step by step. It stops after each step to ask whether user wants it to proceed to next step. Say “YES” to continue, say “NO” to stop.

* Change “ingredient1” to “ingredient2”: By saying this command, the recipe’s ingredient1 will be replaced by ingredient2, and the modified recipe will be stored in the user’s database. When the user gets the instruction for the modified recipe, CookForMe will get it from the user’s database and read off the modified recipe.

* Recommend me recipe {for vegetarian}: CookForMe will recommend 5 random recipes. User can get 5 recipes for vegetarian by simply saying  “Recommend me recipe for vegetarian”.

* Continue: In a case CookForMe gets turned off because of user’s inactivity for a long time, user can return to the state the time it was turned off. It will start reading off from where it was reading previously.

## Change does not work. How do I make it work?
* You need to activate “Get me instructions for.. “ first in order to use “Change”. First, you get the instruction for the recipe you want to find, and you can say “Change ingredient1 to ingredient2”. The ingredient1 must exist in the recipe you searched.

* If it does not work, check the format of the command. Say “Change ingredient1 to ingredient2.”

## Nothing else works and my code is broken, what should I do?
* Try looking at AWS CloudWatch for errors. You can see console logging and errors here. If there is a syntax error, try using a syntax checker for javascript online.

* If CloudWatch says there are no error, try republishing the project using either the batch file or the shell script.


# Release Notes

* Ability to search for recipes given keywords
* Ability to hear recipes read out step by step
* Ability to continue from where you left off in a recipe after closing skill
* Ability to modify recipe by ingredient
* Ability to have recipes recommended to you