import MenuComponentFactory from "./MenuComponentFactory";
import ObserverableMenuComponentFactory from "./ObserverableMenuComponentFactory";

type MenuComponentFactories = MenuComponentFactory | ObserverableMenuComponentFactory;
export default MenuComponentFactories;
