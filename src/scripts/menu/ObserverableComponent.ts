import Component from "../../components/Component";
import Observer from "../types/observer/Observer";
import ObserverSubject from "../types/observer/ObserverSubject";

export default abstract class ObserverableComponent extends Component implements ObserverSubject {
    private observers: Observer[];

    public notifyObservers() {
        this.observers.forEach(
            observer => observer.observerSubjectUpdated()
        )
    };

    public registerObserver(observer: Observer) {
        this.observers.push(observer);
    };
}
