

(function() {
    let sparks = [];

    window.addSparks = (shootX, shootY) => {
        for (let i = 0; i < 15; i++) {
            sparks.push({
                x: shootX,
                y: shootY,
                startX: shootX,
                startY: shootY,
                radian: Math.random() * Math.PI * 2,
                speed: 5,
                size: Math.random() * 5 + 2,
                opacity: 1,
                decay: 0.05,
                acceleration: Math.random() * 0.2 + 0.05,
            });
        }
    };

    window.drawSparks = context => {
        sparks.forEach(s => {
            s.speed += s.acceleration;
            s.x += Math.cos(s.radian) * s.speed;
            s.y += Math.sin(s.radian) * s.speed;
            s.opacity -= s.decay;

            context.fillStyle = `rgba(173, 216, 230, ${s.opacity})`;
            context.beginPath();
            context.arc(s.x, s.y, s.size, 0, Math.PI * 2);
            context.fill();
        });
        sparks = sparks.filter(s => s.opacity > 0);
    };
})();
