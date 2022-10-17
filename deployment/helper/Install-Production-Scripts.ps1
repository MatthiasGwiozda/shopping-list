
function getLibPath() {
    return Join-Path -Path $PSScriptRoot -ChildPath "../../lib"
}

function removeLibPath() {
    $libPath = getLibPath
    Remove-Item -Path $libPath -Recurse
}

function installModulesAndBuildProduction() {
    npm install
    npm run build:production
}

removeLibPath
installModulesAndBuildProduction
