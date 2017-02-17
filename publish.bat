del cookforme.zip
cd src
7z a -r ..\cookforme.zip *
cd ..
aws lambda update-function-code --function-name CookForMe --zip-file fileb://cookforme.zip