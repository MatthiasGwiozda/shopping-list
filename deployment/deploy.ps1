<#
.SYNOPSIS
    Creates a dist - folder, which contains the ready to use program.
    Please remove the current dist - folder manually before you use this script.
#>
Set-Location $PSScriptRoot

$sourceFolder = Join-Path -Path $PSScriptRoot -ChildPath '../'
$libFolder = Join-Path -Path $sourceFolder -ChildPath "/lib"
$nodeModulesFolder = Join-Path -Path $sourceFolder -ChildPath "/node_modules"
$distFolder = Join-Path -Path $sourceFolder -ChildPath '/dist'
$distAppPath = Join-Path -Path $distFolder -ChildPath '/resources/app'


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

./helper/Npm-Install.ps1
./helper/Install-Production-Scripts.ps1 -pathToDelete $libFolder
./helper/Prepare-Electron-Dist-Folder.ps1 -distFolder $distFolder
./helper/Npm-Install.ps1 -production -nodeModulesPathToDelete $nodeModulesFolder
./helper/Copy-To-Dist.ps1 -sourcePath $sourceFolder -destinationPath $distAppPath -folders $folders -files $files




<#
Renames the electron - file.
It would be nice to set a .ico - file for electron but currently
there is a bug in rcedit, which does shady stuff with exe - files:
https://github.com/electron/electron-packager/issues/590
#>
function RebrandElectronExe() {
    $electronFile = Join-Path $distFolder -ChildPath 'electron.exe' -Resolve
    Rename-Item -Path $electronFile -NewName 'shopping-list.exe'
}
RebrandElectronExe

# install dev - dependencies so we can use dev - dependencies for development
./helper/Npm-Install.ps1
