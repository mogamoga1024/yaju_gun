
class SoundStorage {
    static #dic = new Map();

    static set(name, sound) {
        this.#dic.set(name, sound);
    }

    static get(name) {
        return this.#dic.get(name);
    }

    // static *each() {
    //     for (const [name, sound] of this.#dic) {
    //         yield sound;
    //     }
    // }
}
