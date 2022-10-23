<#
.SYNOPSIS
    Creates a dist - folder, which contains the ready to use program.
    Please remove the current dist - folder manually before you use this script.
#>
$sourceFolder = Join-Path -Path $PSScriptRoot -ChildPath '../'
$libFolder = Join-Path -Path $sourceFolder -ChildPath "/lib"
$nodeModulesFolder = Join-Path -Path $sourceFolder -ChildPath "/node_modules"
$distFolder = Join-Path -Path $sourceFolder -ChildPath '/dist'
$distAppPath = Join-Path -Path $distFolder -ChildPath '/resources/app'

$shoppingListExeFilename = 'shopping-list.exe'

$folders = @(
    './src/assets',
    './src/components',
    'lib',
    'node_modules',
    './src/sql',
    './src/styles'
)

$files = @(
    'package.json',
    './src/index.html'
)

function deploy() {
    ./helper/Npm-Install.ps1
    ./helper/Install-Production-Scripts.ps1 -pathToDelete $libFolder
    ./helper/Prepare-Electron-Dist-Folder.ps1 -distFolder $distFolder
    ./helper/Npm-Install.ps1 -production -nodeModulesPathToDelete $nodeModulesFolder
    ./helper/Copy-To-Dist.ps1 -sourcePath $sourceFolder -destinationPath $distAppPath -folders $folders -files $files
    ./helper/Rebrand-Electron-Exe.ps1 -distFolder $distFolder -newFileName $shoppingListExeFilename
    ./helper/Npm-Install.ps1
} 

deploy
