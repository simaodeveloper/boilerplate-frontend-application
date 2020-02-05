const METHODS = {
  ON: 'on',
  ONCE: 'once',
  OFF: 'off',
  DISPATCH: 'dispatch',
};

export const MESSAGES = {
  EVENT_NOT_EXIST: "This event don't exist!",
  ARGUMENTS_NOT_PROVIDED: 'Please, provide the correctly parameters!',
  HANDLER_NOT_DEFINED: "This event don't have any handler!",
  EVENT_NOT_HAVE_HANDLERS: "This event don't have any handler!",
};

export default class Emitter {
  constructor() {
    this.events = {};
  }

  [METHODS.ON](event, fn) {
    if (!event || !fn) {
      throw new Error(MESSAGES.ARGUMENTS_NOT_PROVIDED);
    }

    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(fn);

    return this;
  }

  [METHODS.ONCE](event, fn) {
    const fnOnce = (...args) => {
      fn(...args);
      this[METHODS.OFF](event, fnOnce);
    };

    return this[METHODS.ON](event, fnOnce);
  }

  [METHODS.OFF](event, fn) {
    if (!this.events[event]) {
      throw new Error(MESSAGES.EVENT_NOT_EXIST);
    }

    if (!fn) {
      this.events[event] = [];
      return this;
    }

    if (!this.events[event].includes(fn)) {
      throw new Error(MESSAGES.HANDLER_NOT_DEFINED);
    }

    const eventHandlerIndex = this.events[event].indexOf(fn);
    const eventList = [...this.events[event]];

    eventList.splice(eventHandlerIndex, 1);
    this.events[event] = eventList;

    return this;
  }

  [METHODS.DISPATCH](event, ...args) {
    if (!this.events[event]) {
      throw new Error(MESSAGES.EVENT_NOT_EXIST);
    }

    if (!this.events[event].length) {
      throw new Error(MESSAGES.HANDLER_NOT_DEFINED);
    }

    this.events[event].forEach(fn => fn(...args));
  }
}
