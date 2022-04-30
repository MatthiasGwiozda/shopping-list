
# first install all dependencies

<#
npm install
# remove lib - folder
rm -Path .\lib -Recurse
# compile typescript - files without source - maps
npm run build:production

# now remove node_modules...
rm -Path ".\node_modules" -Recurse
# and install the node_modules, which are necessary for production usage
npm install --production
#>

# returns the download link for the electron version, which is currently installed locally by npm
function GetElectronDownloadLink() {
    $versionString = npm list electron -depth=0 | Out-String
    $versionString -match '(electron@)(?<version>[\d\.]+)' > $null
    $electronVersion = $Matches.version
    return "https://github.com/electron/electron/releases/download/v" + $electronVersion + "/electron-v" + $electronVersion + "-win32-x64.zip"
}

$downloadLink = GetElectronDownloadLink;

$response = Invoke-WebRequest -Uri $downloadLink -OutFile ./electron.zip


# now create the ready to use zip - archive
