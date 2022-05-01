- delete database - file and start the programm.
    - the programm should start after initializing the database - file.
    - The programm should be useable

- open the programm. Focus into the grocery list. click "ctrl + r".
    - nothing should happen. The programm should not reload.

- Check all the menu - items on top.
    - There should not exist an option, which lets the user reload the window.

- Open a page which should not need a vertical scrollbar.
    - There should appear a disabled vertical scrollbar. The reason for this is that the page should not jump when using an additional action - button in the editable list

- use deployment.ps1
    - only non dev - node_modules should be included in the production distribution
    - electron - file should be renamed
    - after the deployment the node_modules should contain all dependencies so that the developer may continue with his work.
