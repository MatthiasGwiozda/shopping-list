
Param(
    [switch]$production,
    [string]$nodeModulesPathToDelete
)

if ($nodeModulesPathToDelete -ne $null) {
    Remove-Item -Path $nodeModulesPathToDelete -Recurse
}

if ($production) {
    npm install --production
}
else {
    npm install
}
