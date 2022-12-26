import Component from "../../../components/Component";
import Observer from "../../types/observer/Observer";
import ObserverSubject from "../../types/observer/ObserverSubject";

export default abstract class MenuObserverComponent extends Component implements ObserverSubject {
    abstract notifyObservers(): void;
    abstract registerObserver(observer: Observer): void;
}
