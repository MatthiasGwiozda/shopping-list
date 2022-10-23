Param(
    [Parameter(mandatory = $true)]
    [string]$sourceFolder,
    [Parameter(mandatory = $true)]
    [string]$libFolder,
    [Parameter(mandatory = $true)]
    [string]$distFolder,
    [Parameter(mandatory = $true)]
    [string]$nodeModulesFolder,
    [Parameter(mandatory = $true)]
    [string]$distAppPath,
    [Parameter(mandatory = $true)]
    [string[]]$folders,
    [Parameter(mandatory = $true)]
    [string[]]$files,
    [Parameter(mandatory = $true)]
    [string]$shoppingListExeFilename
)

function createApplication() {
    &"$PSScriptRoot/Remove-Folder" -folder $distFolder
    &"$PSScriptRoot/Npm-Install.ps1"
    &"$PSScriptRoot/Install-Production-Scripts.ps1" -pathToDelete $libFolder
    &"$PSScriptRoot/Prepare-Electron-Dist-Folder.ps1" -distFolder $distFolder
    &"$PSScriptRoot/Npm-Install.ps1" -production -nodeModulesPathToDelete $nodeModulesFolder
    &"$PSScriptRoot/Copy-To-Dist.ps1" -sourcePath $sourceFolder -destinationPath $distAppPath -folders $folders -files $files
    &"$PSScriptRoot/Rebrand-Electron-Exe.ps1" -distFolder $distFolder -newFileName $shoppingListExeFilename
    &"$PSScriptRoot/Npm-Install.ps1"
} 

createApplication
 