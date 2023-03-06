const FRAME_RATE = 30; //重绘帧数
const MAX_PARTICLE_AGE = 100; //粒子最大运动次数
const PARTICLE_MULTIPLIER = 3;
// 定时器
const requestAnimationFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / FRAME_RATE);
        };
// 取消定时器
const cancelAnimationFrame = window.cancelAnimationFrame || 
window.mozCancelAnimationFrame || 
window.webkitCancelAnimationFrame || 
window.msCancelAnimationFrame || 
clearTimeout;

function windyFront(options){
    let canvas = options.canvas;
    let ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    ctx.lineWidth = 0.8;
    ctx.fillStyle = 'rgba(71,160,233,0.8)';
    this.ctx = ctx;
}

windyFront.prototype = {
    constructor:windyFront,
    ctx:null,
    width:undefined,
    height:undefined,
    bounds:undefined,
    vector:undefined,
    particles:[],
    timer:undefined,
    buildBounds: function(extent) {
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
        return bounds;
    },
    createField: function(columns) {
        let bounds = this.bounds;
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
        return vector;
    },
    interpolateGrid: function(stationPoints, callback) {
        let columns = [];
        let bounds = this.bounds;
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

        let start = Date.now();
            while (x < bounds.xmax) {
                interpolateColumn(x);
                x += 2;
                //MAX_TASK_TIME
                if (Date.now() - start > 1000) {
                    break;
                    /* setTimeout(batchInterpolate, 25);
                    return; */
                }
            }
            return this.createField(columns);
    },
    evolve:function () {
        let vector = this.vector;
        let particles = this.particles;
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
    },

    render:function () {
        let ctx = this.ctx;
        let prev = ctx.globalCompositeOperation;
        ctx.globalCompositeOperation = 'destination-in';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.globalCompositeOperation = prev;

        ctx.beginPath();
        // ctx.strokeStyle = 'rgba(23,139,231,.8)';
        this.particles.forEach(function(particle, i) {
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle.xe, particle.ye);
            particle.x = particle.xe;
            particle.y = particle.ye;
        });
        ctx.stroke();
    },
    animate: function() {
        if(!this.vector){
            return
        }
        this.timer = requestAnimationFrame(()=>{
            this.animate();
        });
        this.evolve();
        this.render();      
    },
    start: function(extent, stationPoints) {
        this.stop();
        this.bounds = this.buildBounds(extent);
        this.vector = this.interpolateGrid(stationPoints);
        let particleCount = Math.round(this.bounds.width * PARTICLE_MULTIPLIER);
            let particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(
                    this.vector.randomize({
                        age: Math.floor(Math.random() * MAX_PARTICLE_AGE)
                    })
                );
            }
            this.particles = particles;
            this.timer = requestAnimationFrame(()=>{
                this.animate();
            });
    },

    stop: function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        if (this.vector) {
            this.vector.release();
            this.vector = undefined;
        };
        if (this.timer) {
            cancelAnimationFrame(this.timer);
        }
    },

    change: function(options) {
        this.ctx.lineWidth = options.size;
        this.ctx.strokeStyle = options.color;
    }
}
