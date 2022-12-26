import Component from "./Component";
import Observer from "../scripts/types/observer/Observer";
import ObserverSubject from "../scripts/types/observer/ObserverSubject";

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
