
export default interface ObserverSubject {
    notifyObservers: () => void;
    registerObserver: (observer: Observer) => void
}
