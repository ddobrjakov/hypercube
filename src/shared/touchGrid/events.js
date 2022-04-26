export class Events {
    constructor() { 
        this._subscribers = {};
    }

    subscribe(event, callback) {
        if (!this._subscribers[event]) { this._subscribers[event] = []; }
        this._subscribers[event].push(callback);
    }

    publish(event, data) {
        if (!this._subscribers[event]) { return; }
        this._subscribers[event].forEach(callback => callback(data));
    }
}
