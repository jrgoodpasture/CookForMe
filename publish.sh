rm cookforme.zip
cd src
zip -X -r ../cookforme.zip *
cd ..
aws lambda update-function-code --function-name MinTest --zip-file fileb://cookforme.zip



# rm cookforme.zip
# cd src
# zip �X �r ../cookforme.zip *
# cd ..
# aws lambda update-function-code --function-name CookForMe --zip-file fileb://cookforme.zip