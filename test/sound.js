
const $soundContainer = $("#sound-container");

(async function() {
    const promiseList = [];

    for (const name in soundConfig) {
        promiseList.push((async () => SoundStorage.set(name, await loadSound(name, "../")))());
    }

    await Promise.all(promiseList);

    for (const name in soundConfig) {
        const sound = SoundStorage.get(name);
        const $btn = $("<button>");
        $btn.text(name)
        let isPlaying = false;
        let id = -1;
        sound.on("end", () => {
            isPlaying = false;
            $btn.css("background-color", "");
        });
        sound.on("playerror", () => {
            isPlaying = false;
            $btn.css("background-color", "");
        });
        $btn.on("click", async () => {
            if (isPlaying !== sound.playing(id)) {
                return;
            }
            if (isPlaying) {
                isPlaying = false;
                sound.stop(id);
                $btn.css("background-color", "");
            } else {
                isPlaying = true;
                id = sound.play();
                $btn.css("background-color", "rgba(255, 100, 100, 0.3)");
            }
        });
        $soundContainer.append($btn);
    }
})();
