# CookForMe
Amazon Alexa Skill for our Junior Design Project

# Node Version
Lambda function needs 4.3 and above

# Dependencies
Lambda function uses unirest to do http get calls
Must do npm install unirest

# Setting Up Interaction Model
Copy and paste contents of Intent_Schema.txt into Intent Schema
Copy and paste contents of INGREDIENT.txt into custom slot values and name the slot INGREDIENT
Copy and paste contents of Sample_Utterances.txt into Sample Utterances

# Pushing to AWS
# Using shell script:
./publish.sh
# Using batch file:
publish