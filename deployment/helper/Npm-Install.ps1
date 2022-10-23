
Param(
    [switch]$production,
    [string]$nodeModulesPathToDelete
)

function nodeModulesPathValid() {
    return $null -ne $nodeModulesPathToDelete -and $nodeModulesPathToDelete -ne ''
}

if (nodeModulesPathValid) {
    Remove-Item -Path $nodeModulesPathToDelete -Recurse
}

if ($production) {
    npm install --production
}
else {
    npm install
}
