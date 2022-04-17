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
    /**
     * The name of the folder, which contains all "sub html - pages"
     */
    componentsFolderName: 'components',
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
    showContextMenuIpcMessage: 'show-context-menu'
});

export default constants;
