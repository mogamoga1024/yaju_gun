
class ImageStorage {
    static #dic = new Map();

    static set(name, image) {
        this.#dic.set(name, image);
    }

    static get(name) {
        return this.#dic.get(name);
    }
}

class SoundStorage {
    static #dic = new Map();

    static set(name, image) {
        this.#dic.set(name, image);
    }

    static get(name) {
        return this.#dic.get(name);
    }
}

