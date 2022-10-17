# How to make releases
1. Delete current dist - folder
1. run the deployment.ps1 - script.
1. create a zip - archive from the contents of the dist - folder
1. rename the zip - file to the released Version.
    - Example: Shopping-List-1.0.0
1. test the content of the zip - file by unpacking it. Than start the programm to check if it's running.
1. create and push a tag in git.
    - Example: v1.0.0
1. change the version in the package.json to the next version
1. create a release in github.
    - add the generated zip - file in the release.
    - Link the release with the previously created tag
    - add the title. Example: v1.0.0 - First useable version
    - describe the changes
1. delete the local zip - file