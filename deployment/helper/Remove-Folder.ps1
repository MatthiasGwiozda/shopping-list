Param(
    [string]$folder
)

function folderExists() {
    return Test-Path -Path $folder
}

function removeFolderIfExists() {
    if (folderExists) {
        Remove-Item -Path $distFolder -Recurse
    }
}

removeFolderIfExists