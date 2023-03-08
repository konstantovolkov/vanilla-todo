// паттерн паб-саб. позволяет вручную генерировать события и определять в листенере-подписчике
// что должно произойти при генерации этого события
export class Publisher {
    constructor() {
        this.listenersToEvents = {};
    }

    /**
     * @param {string} eventName
     * @param {Function} listener
     */
    subscribe(eventName, listener) {

        if (!this.listenersToEvents[eventName])  {
            this.listenersToEvents[eventName] = []
        }

        this.listenersToEvents[eventName].push(listener);
    }

    /**
     * @param {string} eventName
     * @param {Function} callback
     */
    unsubscribe(eventName, callback) {
        if (!this.listenersToEvents[eventName]) return;

        this.listenersToEvents[eventName] = this.listenersToEvents[eventName]
            .filter(eventListener => callback !== eventListener);
    }

    /**
     * @param {string} eventName
     * @param {any} payload
     */
    emit(eventName, payload) {
        const eventListeners = this.listenersToEvents[eventName];
        if (!eventListeners) return;

        eventListeners.forEach(eventListener => eventListener.call(this, payload))
    }
}