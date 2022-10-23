Param() {
    [Parameter(mandatory = $true)]
    [string]$sourceFolder
    [Parameter(mandatory = $true)]
    [string]$libFolder
    [Parameter(mandatory = $true)]
    [string]$distFolder
    [Parameter(mandatory = $true)]
    [string]$nodeModulesFolder
    [Parameter(mandatory = $true)]
    [string]$distAppPath
    [Parameter(mandatory = $true)]
    [string]$folders
    [Parameter(mandatory = $true)]
    [string]$files
    [Parameter(mandatory = $true)]
    [string]$shoppingListExeFilename
}

function createApplication() {
    Remove-Item -Path $distFolder
    ./Npm-Install.ps1
    ./Install-Production-Scripts.ps1 -pathToDelete $libFolder
    ./Prepare-Electron-Dist-Folder.ps1 -distFolder $distFolder
    ./Npm-Install.ps1 -production -nodeModulesPathToDelete $nodeModulesFolder
    ./Copy-To-Dist.ps1 -sourcePath $sourceFolder -destinationPath $distAppPath -folders $folders -files $files
    ./Rebrand-Electron-Exe.ps1 -distFolder $distFolder -newFileName $shoppingListExeFilename
    ./Npm-Install.ps1
} 

createApplication