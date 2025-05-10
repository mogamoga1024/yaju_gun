
class Scene {
    state = "loading"; // loading or loaded
    prevScene = null;
    onStart() {}
    onEnd() {}
    onKeyDown(e) {}
    onKeyUp(e) {}
    onClick(e) {}
    onMouseMove(e) {}
    onTouchStart(e) {}
    onTouchMove(e) {}
    onTouchEnd(e) {}
    onTouchCancel(e) {}

    canvasXY(offsetX, offsetY, rect) {
        return {
            x: offsetX * canvas.width / rect.width,
            y: offsetY * canvas.height / rect.height
        };
    }
}
