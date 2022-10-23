
Param(
    [Parameter(Mandatory = $true)]
    [string]$distFolder,
    [Parameter(Mandatory = $true)]
    [string]$newFileName
)

function renameElectronFile() {
    $electronFileName = 'electron.exe'
    $electronFile = Join-Path $distFolder -ChildPath $electronFileName -Resolve
    Rename-Item -Path $electronFile -NewName $newFileName
}

renameElectronFile
