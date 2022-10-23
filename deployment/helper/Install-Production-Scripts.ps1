param(
    [Parameter(mandatory=$True)]
    [string]$pathToDelete
)

function removeCurrentScripts() {
    &"$PSScriptRoot/Remove-Folder.ps1" -folder $pathToDelete
}

function buildProductionScripts() {
    npm run build:production
}

removeCurrentScripts
buildProductionScripts
