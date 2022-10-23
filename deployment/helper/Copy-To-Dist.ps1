
Param(
    [Parameter(Mandatory = $true)]
    [string]$sourcePath,
    [Parameter(Mandatory = $true)]
    [string]$destinationPath,
    [Parameter(Mandatory = $true)]
    [string[]] $folders,
    [Parameter(Mandatory = $true)]
    [string[]] $files
)

function copyFolders() {
    foreach ($folder in $folders) {
        $source = Join-Path -Path $sourcePath -ChildPath $folder
        $destination = Join-Path -Path $destinationPath -ChildPath $folder
        # ts files should not be copied as they are not relevant for production usage:
        Copy-Item -Path $source -Destination $destination -Recurse -Exclude '*.ts'
    }
}

function copyFiles() {
    foreach ($file in $files) {
        $source = Join-Path -Path $sourcePath -ChildPath $file
        $destination = Join-Path -Path $destinationPath -ChildPath $file
        Copy-Item -Path $source -Destination $destination
    }
}

copyFolders
copyFiles
