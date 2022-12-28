const constants = Object.freeze({
    menuId: 'menu',
    /**
     * the id of the container - node, which includes the menu and the content.
     */
    containerId: 'container',
    /**
     * the content of the application. This is where the componentRoutes are injected.
     */
    contentId: 'content',
    icons: {
        category: '🆎',
        shop: '🏪',
        item: '🥔'
    },
    /**
     * When a button gets this class, it's
     * style will "show" that an element is currently active.
     */
    activeActionButtonClass: 'active',
    ipcMessages: {
        showContextMenu: 'show-context-menu',
        alert: 'alert',
        confirm: 'confirm'
    },
    /**
     * Use this class on a button, which creates new elements.
     * Through this class the user is able to use "ctrl + n" to
     * create a new element.
     */
    addNewButtonClass: 'addNewButton'
});

export default constants;
