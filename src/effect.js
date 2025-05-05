

(function() {
    let sparks = [];

    window.Sparks = {
        reset: () => {
            sparks = [];
        },
        add: (shootX, shootY) => {
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
        },
        draw: context => {
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
        }
    };

    let impactFrameCount = 0;
    const impactMap = new Map();

    window.drawImpactLines = (focalX, focalY) => {
        context.save();
    
        context.lineWidth = 2;
    
        const maxSegmentCount = 4;
        const maxSegmentLineCount = 3;

        for (const color of ["black", "white"]) {
            context.strokeStyle = color;
            for (let i = 0; i < maxSegmentCount; i++) {
                for (let j = 0; j < maxSegmentLineCount; j++) {
                    let radian, offset;
                    if (impactFrameCount % 6 === 0) {
                        radian = Math.random() * Math.PI * 2 / maxSegmentCount + Math.PI * 2 / maxSegmentCount * i;
                        offset = 200 + Math.random() * 50;
                        impactMap.set(`${color}_${i}_${j}`, {radian, offset});
                    }
                    else {
                        ({radian, offset} = impactMap.get(`${color}_${i}_${j}`));
                    }

                    const startX = focalX + Math.cos(radian) * offset;
                    const startY = focalY + Math.sin(radian) * offset;
                    const endX = focalX + Math.cos(radian) * Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
                    const endY = focalY + Math.sin(radian) * Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
                    context.beginPath();
                    context.moveTo(startX, startY);
                    context.lineTo(endX, endY);
                    context.stroke();
                }
            }
        }
        context.restore();

        impactFrameCount++;
    }
})();

