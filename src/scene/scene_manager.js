
class SceneManager {
    static #scene = null;

    static #init() {
        window.addEventListener("keydown", e => {
            this.#scene?.onKeyDown(e);
        });
        window.addEventListener("keyup", e => {
            this.#scene?.onKeyUp(e);
        });
        window.addEventListener("click", e => {
            this.#scene?.onClick(e);
        });
    }

    static start(scene, needDrawLoading = true) {
        if (scene === null) {
            throw new Error("Sceneが未指定");
        }

        if (this.#scene !== null) {
            this.#scene.onEnd();
        }
        else {
            this.#init();
        }

        if (needDrawLoading) {
            drawLoading();
        }

        scene.onStart();
        this.#scene = scene;
    }
}
