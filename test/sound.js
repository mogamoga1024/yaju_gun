
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
        $btn.on("click", () => {
            playSound(sound);
        });
        $soundContainer.append($btn);
    }
})();
