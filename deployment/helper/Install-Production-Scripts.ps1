param(
    [Parameter(mandatory=$True)]
    [string]$pathToDelete
)

function removeCurrentScripts() {
    Remove-Item -Path $pathToDelete -Recurse
}

function buildProductionScripts() {
    npm run build:production
}

removeCurrentScripts
buildProductionScripts
