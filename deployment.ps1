
# first install all dependencies

<#
npm install
# remove lib - folder
Remove-Item -Path .\lib -Recurse
# compile typescript - files without source - maps
npm run build:production

# now remove node_modules...
Remove-Item -Path ".\node_modules" -Recurse
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

$downloadLink = GetElectronDownloadLink
$electronZipFilename = './electron.zip'
$distFolder = './dist'
# this are all files, which must be deployed in the app - folder of electron
$appFiles = @(
    'lib',
    'node_modules',
    'package.json',
    'sql',
    'index.html',
    'assets',
    'styles',
    'components'
)

<#
Get the necessary electron - files
Turn off the progress - bar as it slows down the download extremely.
https://stackoverflow.com/a/43477248/6458608
#>
$ProgressPreference = 'SilentlyContinue'
Invoke-WebRequest -Uri $downloadLink -OutFile $electronZipFilename
Expand-Archive -Path $electronZipFilename -DestinationPath $distFolder
Remove-Item -Path $electronZipFilename
# place the app in the electron - folder

# now create the ready to use zip - archive
