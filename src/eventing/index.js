export class EventService {
    constructor(eventStrategy) {
        this.eventStrategy = eventStrategy;
        this.handlers = new Map();

        eventStrategy.setCallback(this.eventCallback.bind(this));
    }

    async publish(e) {
        const eventType = e.constructor.name;
        const payload = e.payload || e;

        await this.eventStrategy.publish(eventType, payload);
    }

    async eventCallback(eventType, payload) {
        for (let handler of this.handlers.get(eventType)) {
            await handler.handle(payload);
        }
    }

    on(EventClass, handler) {
        const eventType = EventClass.name;

        if (!this.handlers.has(eventType)) {
            this.handlers.set(eventType, []);
        }

        this.handlers.get(eventType).push(handler);
    }
}

export class InMemoryEventStrategy {
    setCallback(callback) {
        this.callback = callback;
    }

    async publish(name, payload) {
        process.nextTick(() => this.callback(name, payload));
    }
}

//TODO: later implement a redis based event strategy and switch in app.js based on the config file
