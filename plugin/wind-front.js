/** @format */

let windyFront = function(options) {
    let MAX_PARTICLE_AGE = 100; //粒子最大运动次数
    let FRAME_RATE = 30; //重绘帧数
    let PARTICLE_MULTIPLIER = 3;

    let canvas = options.canvas;
    // let map = options.map;
    // let windData = options.data;
    let width = canvas.width;
    let height = canvas.height;
    let ctx = canvas.getContext('2d');
    ctx.lineWidth = 0.8;
    ctx.fillStyle = 'rgba(71,160,233,0.8)';

    // ctx.fillStyle = 'rgba(255,0,233,0.8)';
    // ctx.strokeStyle = 'rgba(38,173,133,0.8)';

    let buildBounds = function(extent, callback) {
        let upperLeft = extent[0];
        let lowerRight = extent[1];
        let bounds = {
            x: upperLeft[0],
            y: upperLeft[1],
            xmax: lowerRight[0],
            ymax: lowerRight[1],
            width: lowerRight[0] - upperLeft[0],
            height: lowerRight[1] - upperLeft[1]
        };
        callback(bounds);
    };

    let createField = function(columns, bounds, callback) {
        function vector(x, y) {
            let column = columns[Math.floor(x)];
            return column && column[Math.floor(y)];
        }

        vector.release = function() {
            columns = [];
        };

        vector.randomize = function(o) {
            let x = Math.floor(
                Math.floor(Math.random() * bounds.width) + bounds.x
            );
            let y = Math.floor(
                Math.floor(Math.random() * bounds.height) + bounds.y
            );
            o.x = x;
            o.y = y;
            return o;
        };
        callback(bounds, vector);
    };

    let interpolateGrid = function(bounds, stationPoints, callback) {
        let columns = [];
        let x = bounds.x;

        function interpolateColumn(x) {
            let column = [];
            for (let y = bounds.y; y < bounds.ymax; y += 2) {
                let wind = interpolate(x, y);
                column[y + 1] = column[y] = wind;
            }
            columns[x + 1] = columns[x] = column;
        }

        function interpolate(x, y) {
            let angle0 = 0,
                angle1 = 0,
                speed0 = 0,
                speed1 = 0,
                wind = {};
            stationPoints.forEach(function(s) {
                angle0 +=
                    (s.angle * 1.0) /
                    ((y - s.y) * (y - s.y) + (x - s.x) * (x - s.x));
                angle1 += 1.0 / ((y - s.y) * (y - s.y) + (x - s.x) * (x - s.x));

                speed0 +=
                    (s.speed * 1.0) /
                    ((y - s.y) * (y - s.y) + (x - s.x) * (x - s.x));
                speed1 += 1.0 / ((y - s.y) * (y - s.y) + (x - s.x) * (x - s.x));

                if (angle1 != 0) {
                    wind.angle = angle0 / angle1;
                }
                if (speed1 != 0) {
                    wind.speed = speed0 / speed1;
                }
            });
            return wind;
        }

        (function batchInterpolate() {
            let start = Date.now();
            while (x < bounds.xmax) {
                interpolateColumn(x);
                x += 2;
                if (Date.now() - start > 1000) {
                    //MAX_TASK_TIME
                    setTimeout(batchInterpolate, 25);
                    return;
                }
            }
            createField(columns, bounds, callback);
        })();
    };

    let animate = function(bounds, vector) {
        let particleCount = Math.round(bounds.width * PARTICLE_MULTIPLIER);
        let particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(
                vector.randomize({
                    age: Math.floor(Math.random() * MAX_PARTICLE_AGE)
                })
            );
        }

        function evolve() {
            particles.forEach(function(particle, i) {
                if (particle.age > MAX_PARTICLE_AGE) {
                    particle = vector.randomize({
                        age: 0
                    });
                    particles.splice(i, 1, particle);
                }
                let x = particle.x;
                let y = particle.y;
                let v = vector(x, y);
                if (v) {
                    let xe =
                        x -
                        v.speed * Math.sin((Math.PI / 180) * (180 - v.angle));
                    let ye =
                        y -
                        v.speed * Math.cos((Math.PI / 180) * (180 - v.angle));
                    let nextPoint = vector(xe, ye);
                    if (nextPoint) {
                        particle.xe = xe;
                        particle.ye = ye;
                    } else {
                        let newParticle = vector.randomize({
                            age: Math.floor(Math.random() * MAX_PARTICLE_AGE)
                        });
                        particles.splice(i, 1, newParticle);
                    }
                } else {
                    particle.age = MAX_PARTICLE_AGE;
                }
                particle.age += 1;
            });
        }

        function render() {
            let prev = ctx.globalCompositeOperation;
            ctx.globalCompositeOperation = 'destination-in';
            ctx.fillRect(0, 0, width, height);
            ctx.globalCompositeOperation = prev;

            ctx.beginPath();
            // ctx.strokeStyle = 'rgba(23,139,231,.8)';
            particles.forEach(function(particle, i) {
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(particle.xe, particle.ye);
                particle.x = particle.xe;
                particle.y = particle.ye;
            });
            ctx.stroke();
        }
        function frame() {
            that.timer = requestAnimationFrame(function() {
                requestAnimationFrame(frame);
                evolve();
                render();
            });
        }
        frame();
        

        /* (function frame() {
            try {
                windyFront.timer = setTimeout(function() {
                    requestAnimationFrame(frame);
                    evolve();
                    render();
                }, 1000 / FRAME_RATE);
            } catch (e) {
                console.error(e);
            }
        })(); */
                    
    };

    let start = function(extent, stationPoints) {
        stop();
        buildBounds(extent, function(bounds) {
            interpolateGrid(bounds, stationPoints, function(bounds, vector) {
                windy.vector = vector;
                animate(bounds, vector);
            });
        });
    };

    let stop = function() {
        ctx.clearRect(0, 0, width, height);
        if (windy.vector) windy.vector.release();
        if (windy.timer) clearTimeout(windy.timer);
    };

    let change = function(options) {
        ctx.lineWidth = options.size;
        ctx.strokeStyle = options.color;
    };

    let windy = {
        options: options,
        start: start,
        stop: stop,
        change: change
    };

    return windy;
};

window.requestAnimationFrame = (function() {
    return (
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 20);
        }
    );
})();
