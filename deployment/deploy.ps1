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

./helper/Create-Application.ps1 -sourceFolder $sourceFolder -libFolder $libFolder -distFolder $distFolder -nodeModulesFolder $nodeModulesFolder -distAppPath $distAppPath -folders $folders -files $files -shoppingListExeFilename $shoppingListExeFilename
