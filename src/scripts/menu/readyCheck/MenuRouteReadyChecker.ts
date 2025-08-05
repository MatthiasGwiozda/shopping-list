import ComponentReadyCheck from "../types/readyCheck/ComponentReadyCheck";
import MenuItem from "../types/MenuItem";

export default class MenuRouteReadyChecker {

    private readonly menuNotReadyClass = 'notReady';

    public async applyReadyChecks(menuItems: MenuItem[]): Promise<void> {
        for (const menuItem of menuItems) {
            await this.applyReadyCheckForMenuItem(menuItem);
        }
    }

    private async applyReadyCheckForMenuItem(menuItem: MenuItem) {
        const { menuRoute, htmlElement } = menuItem;
        if (menuRoute.behavior.readyCheck != null) {
            const { checks, message } = menuRoute.behavior.readyCheck;
            if (await this.isComponentReady(checks)) {
                this.removeMenuNotReadyClassAndTitle(htmlElement);
            } else {
                this.addMenuNotReadyClassAndSetTitle(htmlElement, message);
            }
        }
    }

    private async isComponentReady(checks: ComponentReadyCheck[]): Promise<boolean> {
        const promises = checks.map(readyCheck => readyCheck());
        const results = await Promise.all(promises);
        return results.every(isReady => isReady);
    }

    private removeMenuNotReadyClassAndTitle(htmlElement: HTMLAnchorElement) {
        htmlElement.classList.remove(this.menuNotReadyClass);
        htmlElement.removeAttribute('title');
    }

    private addMenuNotReadyClassAndSetTitle(htmlElement: HTMLAnchorElement, message: string) {
        htmlElement.classList.add(this.menuNotReadyClass);
        htmlElement.title = message;
    }
}
