@echo OFF

del /f cookforme.zip
cd src

@echo.
@echo ******************************* Zipping Project *******************************
@echo.

7z a -r ..\cookforme.zip 
cd ..
aws lambda update-function-code --function-name CookForMe --zip-file fileb://cookforme.zip

@echo.
@echo **************************** Publish Date and Time ****************************
@echo.

date /T
time /T
