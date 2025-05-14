
class SceneManager {
    static #scene = null;
    static #loadingTimer = -1;

    static scene() {
        return this.#scene;
    }

    static #init() {
        window.addEventListener("visibilitychange", e => {
            this.#scene?.onVisibilityChange(e);
        });
        window.addEventListener("keydown", e => {
            if (this.#scene?.state !== "loaded") return;
            this.#scene?.onKeyDown(e);
        });
        window.addEventListener("keyup", e => {
            if (this.#scene?.state !== "loaded") return;
            this.#scene?.onKeyUp(e);
        });
        canvas.addEventListener("click", e => {
            if (this.#scene?.state !== "loaded") return;
            this.#scene?.onClick(e);
        });
        canvas.addEventListener("touchstart", e => {
            if (this.#scene?.state !== "loaded") return;
            this.#scene?.onTouchStart(e);
        });
        canvas.addEventListener("touchmove", e => {
            if (this.#scene?.state !== "loaded") return;
            this.#scene?.onTouchMove(e);
        });
        canvas.addEventListener("touchend", e => {
            if (this.#scene?.state !== "loaded") return;
            this.#scene?.onTouchEnd(e);
        });
        canvas.addEventListener("touchcancel", e => {
            if (this.#scene?.state !== "loaded") return;
            this.#scene?.onTouchCancel(e);
        });
        canvas.addEventListener("mousemove", e => {
            if (this.#scene?.state !== "loaded") return;
            this.#scene?.onMouseMove(e);
        });
    }

    static start(scene, needDrawLoading = true) {
        if (scene === null) {
            throw new Error("Sceneが未指定");
        }

        clearInterval(this.#loadingTimer);

        if (this.#scene !== null) {
            this.#scene.onEnd();
        }
        else {
            this.#init();
        }

        this.#scene = scene;

        if (needDrawLoading) {
            this.#loadingTimer = setInterval(() => {
                if (scene.state === "loaded") {
                    clearInterval(this.#loadingTimer);
                    return;
                }
                drawLoading();
            }, 1000 / FPS * 4);
        }

        scene.onStart();
    }
}
