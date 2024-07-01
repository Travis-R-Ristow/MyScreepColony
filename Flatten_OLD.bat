
@echo off

setlocal enabledelayedexpansion

set mainFile=".\main.ts"

if exist %mainFile% del /F /Q %mainFile%

copy NUL %mainFile% >nul

for /R ".\src\" %%A in (*.ts) do (
  if "%%A" NEQ "%mainFile%" (
    for /f "delims=" %%B in ('findstr /v /b "import" "%%A"') do (
        set "line=%%B"
        set "line=!line:export=!"
        setlocal disabledelayedexpansion
          echo %line% >> %mainFile%
        endlocal
    )
  )
)

