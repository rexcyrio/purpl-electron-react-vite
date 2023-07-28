Write-Host "minified-release starting..." -NoNewline

Remove-Item $PSScriptRoot\minified-release\*

Copy-Item -Path $PSScriptRoot\bin\Release\net6.0-windows10.0.17763.0\Microsoft.Windows.SDK.NET.dll -Destination $PSScriptRoot\minified-release
Copy-Item -Path $PSScriptRoot\bin\Release\net6.0-windows10.0.17763.0\ThumbnailUtilities.dll -Destination $PSScriptRoot\minified-release
Copy-Item -Path $PSScriptRoot\bin\Release\net6.0-windows10.0.17763.0\ThumbnailUtilities.exe -Destination $PSScriptRoot\minified-release
Copy-Item -Path $PSScriptRoot\bin\Release\net6.0-windows10.0.17763.0\ThumbnailUtilities.runtimeconfig.json -Destination $PSScriptRoot\minified-release
Copy-Item -Path $PSScriptRoot\bin\Release\net6.0-windows10.0.17763.0\WinRT.Runtime.dll -Destination $PSScriptRoot\minified-release

Write-Host "done"
