# CookForMe
Amazon Alexa Skill for our Junior Design Project to aid in cooking

## Contributors
Min Jung, Min Ho Lee, Jacob Goodpasture, Rohan Avalani, Seth Davis

## Node Version
Lambda function needs 4.3 and above

## Dependencies
Must do inside /src to install dependencies:
```
npm install
```
This will create a /node_module directory inside /src for the dependencies 

## Setting Up Interaction Model
Copy and paste contents of Intent_Schema.txt into Intent Schema
Copy and paste contents of INGREDIENT.txt into custom slot values and name the slot INGREDIENT
Copy and paste contents of Sample_Utterances.txt into Sample Utterances

## Pushing to AWS
Using shell script:
```
./publish.sh
```
Using batch file:
```
publish
```
