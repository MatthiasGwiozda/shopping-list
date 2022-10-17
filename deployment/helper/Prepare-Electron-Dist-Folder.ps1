Param(
    [Parameter(Mandatory = $True)]
    [string]$distFolder
)

function GetElectronDownloadLink() {
    $versionString = npm list electron -depth=0 | Out-String
    $versionString -match '(electron@)(?<version>[\d\.]+)' > $null
    $electronVersion = $Matches.version
    return "https://github.com/electron/electron/releases/download/v" + $electronVersion + "/electron-v" + $electronVersion + "-win32-x64.zip"
}

$downloadLink = GetElectronDownloadLink
$electronZipFilename = './electron.zip'

function downloadElectron() {
    <#
    Turn off the progress - bar as it slows down the download extremely.
    https://stackoverflow.com/a/43477248/6458608
    #>
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $downloadLink -OutFile $electronZipFilename
}

function unzipElectronInDistFolder() {
    Expand-Archive -Path $electronZipFilename -DestinationPath $distFolder
}

function removeElectronZip() {
    Remove-Item -Path $electronZipFilename
}

downloadElectron
unzipElectronInDistFolder
removeElectronZip
