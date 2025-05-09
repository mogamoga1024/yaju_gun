
class SceneManager {
    static #scene = null;

    static scene() {
        return this.#scene;
    }

    static #debug = 0;

    static #init() {
        window.addEventListener("keydown", e => {
            if (this.#scene?.state !== "loaded") return;
            this.#scene?.onKeyDown(e);
        });
        window.addEventListener("keyup", e => {
            if (this.#scene?.state !== "loaded") return;
            this.#scene?.onKeyUp(e);
        });
        canvas.addEventListener("click", e => {
            // DEBUG: そもそも呼び出されている？
            domDebguText.innerText = ++this.#debug;

            // DEBUG: GameOverSceneでonClickが呼び出されない現象があったためデバグ
            if (this.#scene instanceof GameOverScene) {
                // DEBUG: GameOverSceneで呼び出されないことがあった。何故？
                domDebguText.innerText = ++this.#debug;
            }
            if (this.#scene?.state !== "loaded") return;
            this.#scene?.onClick(e);
        });
        canvas.addEventListener("touchstart", e => {
            if (this.#scene?.state !== "loaded") return;
            this.#scene?.onTouchStart(e);
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
