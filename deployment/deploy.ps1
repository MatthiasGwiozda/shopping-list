<#
.SYNOPSIS
    Creates a dist - folder, which contains the ready to use program.
    Please remove the current dist - folder manually before you use this script.
#>
Set-Location $PSScriptRoot
$distFolder = Join-Path -Path $PSScriptRoot -ChildPath '../dist'

./helper/Install-Production-Scripts.ps1
./helper/Prepare-Electron-Dist-Folder.ps1 -distFolder $distFolder

# now remove node_modules...
Remove-Item -Path ".\node_modules" -Recurse
# and install the node_modules, which are necessary for production usage
npm install --production

# copy relevant data in the dist - folder:
$appFolders = @(
    './src/assets',
    './src/components',
    'lib',
    'node_modules',
    './src/sql',
    './src/styles'
)

$rootAppFiles = @(
    'package.json'
)
    
$srcAppFiles = @(
    './src/index.html'
)

$appPath = Join-Path -Path $distFolder -ChildPath '/resources/app'

# first copy folders
foreach ($folder in $appfolders) {
    $destination = Join-Path -Path $appPath -ChildPath $folder
    # ts files should not be copied as they are not relevant for production usage:
    Copy-Item -Path $folder -Destination $destination -Recurse -Exclude '*.ts'
}

# copy files
Copy-Item -Path $rootAppFiles -Destination $appPath
$srcPath = Join-Path -Path $appPath -ChildPath '/src'
Copy-Item -Path $srcAppFiles -Destination $srcPath

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
npm install
