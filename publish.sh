rm cookforme.zip
cd src

echo -e "\n******************************* Zipping Project *******************************\n"

zip -X -r ../cookforme.zip *
cd ..
aws lambda update-function-code --function-name CookForMe --zip-file fileb://cookforme.zip

echo -e "\n**************************** Publish Date and Time ****************************\n"

date

echo -e "\n"
