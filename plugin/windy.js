/**
 * /*  Global class for simulating the movement of particle through a 1km wind grid
 *
 *     credit: All the credit for this work goes to: https://github.com/cambecc for creating the repo:
 *       https://github.com/cambecc/earth. The majority of this code is directly take nfrom there, since its awesome.
 *
 *     This class takes a canvas element and an array of data (1km GFS from http://www.emc.ncep.noaa.gov/index.php?branch=GFS)
 *     and then uses a mercator (forward/reverse) projection to correctly map wind vectors in "map space".
 *
 *     The "start" method takes the bounds of the map at its current extent and starts the whole gridding,
 *     interpolation and animation process.
 *
 * @format
 */

let Windy = function(params) {
    let NULL_WIND_VECTOR = [NaN, NaN, null]; // singleton for no wind in the form: [u, v, magnitude]
    let TRANSPARENT_BLACK = [255, 0, 0, 0];

    let VELOCITY_SCALE =
        0.005 * (Math.pow(window.devicePixelRatio, 1 / 3) || 1); // scale for wind velocity (completely arbitrary--this value looks nice)
    let INTENSITY_SCALE_STEP = 20; // step size of particle intensity color scale
    let MAX_WIND_INTENSITY = 40; // wind velocity at which particle intensity is maximum (m/s)
    let MAX_PARTICLE_AGE = 60; // max number of frames a particle is drawn before regeneration
    let PARTICLE_LINE_WIDTH = 1; // line width of a drawn particle
    let PARTICLE_MULTIPLIER = 1 / 300; // particle count scalar (completely arbitrary--this values looks nice)
    let PARTICLE_REDUCTION = Math.pow(window.devicePixelRatio, 1 / 3) || 1.6; // multiply particle count for mobiles by this amount
    let FRAME_RATE = 20,
        FRAME_TIME = 1000 / FRAME_RATE; // desired frames per second

    let τ = 2 * Math.PI;
    let H = Math.pow(10, -5.2);

    // interpolation for vectors like wind (u,v,m)
    let bilinearInterpolateVector = function(x, y, g00, g10, g01, g11) {
        let rx = 1 - x;
        let ry = 1 - y;
        let a = rx * ry,
            b = x * ry,
            c = rx * y,
            d = x * y;
        let u = g00[0] * a + g10[0] * b + g01[0] * c + g11[0] * d;
        let v = g00[1] * a + g10[1] * b + g01[1] * c + g11[1] * d;

        return [u, v, Math.sqrt(u * u + v * v)];
    };

    let createWindBuilder = function(uComp, vComp) {
        let uData = uComp.data,
            vData = vComp.data;
        return {
            header: uComp.header,
            //recipe: recipeFor("wind-" + uComp.header.surface1Value),
            data: function(i) {
                return [uData[i], vData[i]];
            },
            interpolate: bilinearInterpolateVector
        };
    };

    let createBuilder = function(data) {
        let uComp = null,
            vComp = null,
            scalar = null;

        data.forEach(function(record) {
            switch (
                record.header.parameterCategory +
                ',' +
                record.header.parameterNumber
            ) {
                case '2,2':
                    uComp = record;
                    break;
                case '2,3':
                    vComp = record;
                    break;
                default:
                    scalar = record;
            }
        });

        uComp = data[0];
        vComp = data[1];

        return createWindBuilder(uComp, vComp);
    };

    let buildGrid = function(data, callback) {
        let builder = createBuilder(data);

        let header = builder.header;
        let λ0 = header.lo1,
            φ0 = header.la1; // the grid's origin (e.g., 0.0E, 90.0N)
        let Δλ = header.dx / 1000,
            Δφ = header.dy / 1000; // distance between grid points (e.g., 2.5 deg lon, 2.5 deg lat)
        let ni = header.nx,
            nj = header.ny; // number of grid points W-E and N-S (e.g., 144 x 73)
        let date = new Date(header.refTime);
        date.setHours(date.getHours() + header.forecastTime);

        // Scan mode 0 assumed. Longitude increases from λ0, and latitude decreases from φ0.
        // http://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_table3-4.shtml
        let grid = [],
            p = 0;
        let isContinuous = Math.floor(ni * Δλ) >= 360;
        for (let j = 0; j < nj; j++) {
            let row = [];
            for (let i = 0; i < ni; i++, p++) {
                row[i] = builder.data(p);
            }
            if (isContinuous) {
                // For wrapped grids, duplicate first column as last column to simplify interpolation logic
                row.push(row[0]);
            }
            grid[j] = row;
        }

        function interpolate(λ, φ) {
            let i = floorMod(λ - λ0, 360) / Δλ; // calculate longitude index in wrapped range [0, 360)
            let j = (φ0 - φ) / Δφ; // calculate latitude index in direction +90 to -90

            let fi = Math.floor(i),
                ci = fi + 1;
            let fj = Math.floor(j),
                cj = fj + 1;

            let row;
            if ((row = grid[fj])) {
                let g00 = row[fi];
                let g10 = row[ci];
                if (isValue(g00) && isValue(g10) && (row = grid[cj])) {
                    let g01 = row[fi];
                    let g11 = row[ci];
                    if (isValue(g01) && isValue(g11)) {
                        // All four points found, so interpolate the value.
                        return builder.interpolate(
                            i - fi,
                            j - fj,
                            g00,
                            g10,
                            g01,
                            g11
                        );
                    }
                }
            }
            return null;
        }
        callback({
            date: date,
            interpolate: interpolate
        });
    };

    /**
     * @returns {Boolean} true if the specified value is not null and not undefined.
     */
    var isValue = function(x) {
        return x !== null && x !== undefined;
    };

    /**
     * @returns {Number} returns remainder of floored division, i.e., floor(a / n). Useful for consistent modulo
     *          of negative numbers. See http://en.wikipedia.org/wiki/Modulo_operation.
     */
    var floorMod = function(a, n) {
        return a - n * Math.floor(a / n);
    };

    /**
     * @returns {Number} the value x clamped to the range [low, high].
     */
    let clamp = function(x, range) {
        return Math.max(range[0], Math.min(x, range[1]));
    };

    /**
     * @returns {Boolean} true if agent is probably a mobile device. Don't really care if this is accurate.
     */
    let isMobile = function() {
        return /android|blackberry|iemobile|ipad|iphone|ipod|opera mini|webos/i.test(
            navigator.userAgent
        );
    };

    /**
     * Calculate distortion of the wind vector caused by the shape of the projection at point (x, y). The wind
     * vector is modified in place and returned by this function.
     */
    let distort = function(projection, λ, φ, x, y, scale, wind, windy) {
        let u = wind[0] * scale;
        let v = wind[1] * scale;
        let d = distortion(projection, λ, φ, x, y, windy);

        // Scale distortion vectors by u and v, then add.
        wind[0] = d[0] * u + d[2] * v;
        wind[1] = d[1] * u + d[3] * v;
        return wind;
    };

    // var distort1 = function(projection, λ, φ, x, y, scale, wind, windy) {
    //     var u = wind[0];
    //     var v = wind[1];
    //     //var d = distortion(projection, λ, φ, x, y, windy);

    //     // Scale distortion vectors by u and v, then add.
    //     wind[0] = u * 0.5;
    //     wind[1] = -v * 0.5;
    //     return wind;
    // };

    var distortion = function(projection, λ, φ, x, y, windy) {
        let τ = 2 * Math.PI;
        let H = Math.pow(10, -5.2);
        let hλ = λ < 0 ? H : -H;
        let hφ = φ < 0 ? H : -H;

        let pλ = project(φ, λ + hλ, windy);
        let pφ = project(φ + hφ, λ, windy);

        // Meridian scale factor (see Snyder, equation 4-3), where R = 1. This handles issue where length of 1º λ
        // changes depending on φ. Without this, there is a pinching effect at the poles.
        let k = Math.cos((φ / 360) * τ);
        return [
            (pλ[0] - x) / hλ / k,
            (pλ[1] - y) / hλ / k,
            (pφ[0] - x) / hφ,
            (pφ[1] - y) / hφ
        ];
    };

    let createField = function(columns, bounds, callback) {
        /**
         * @returns {Array} wind vector [u, v, magnitude] at the point (x, y), or [NaN, NaN, null] if wind
         *          is undefined at that point.
         */
        function field(x, y) {
            let column = columns[Math.round(x)];
            return (column && column[Math.round(y)]) || NULL_WIND_VECTOR;
        }

        // Frees the massive "columns" array for GC. Without this, the array is leaked (in Chrome) each time a new
        // field is interpolated because the field closure's context is leaked, for reasons that defy explanation.
        field.release = function() {
            columns = [];
        };

        field.randomize = function(o) {
            // UNDONE: this method is terrible
            let x, y;
            let safetyNet = 0;
            do {
                x = Math.round(
                    Math.floor(Math.random() * bounds.width) + bounds.x
                );
                y = Math.round(
                    Math.floor(Math.random() * bounds.height) + bounds.y
                );
            } while (field(x, y)[2] === null && safetyNet++ < 30);
            o.x = x;
            o.y = y;
            return o;
        };

        //field.overlay = mask.imageData;
        //return field;
        callback(bounds, field);
    };

    let buildBounds = function(bounds, width, height) {
        let upperLeft = bounds[0];
        let lowerRight = bounds[1];
        let x = Math.round(upperLeft[0]); //Math.max(Math.floor(upperLeft[0], 0), 0);
        let y = Math.max(Math.floor(upperLeft[1], 0), 0);
        let xMax = Math.min(Math.ceil(lowerRight[0], width), width - 1);
        let yMax = Math.min(Math.ceil(lowerRight[1], height), height - 1);
        return {
            x: x,
            y: y,
            xMax: width,
            yMax: yMax,
            width: width,
            height: height
        };
    };

    let deg2rad = function(deg) {
        return (deg / 180) * Math.PI;
    };

    let rad2deg = function(ang) {
        return ang / (Math.PI / 180.0);
    };

    let invert = function(x, y, windy) {
        let mapLonDelta = windy.east - windy.west;
        let worldMapRadius =
            ((windy.width / rad2deg(mapLonDelta)) * 360) / (2 * Math.PI);
        let mapOffsetY =
            (worldMapRadius / 2) *
            Math.log((1 + Math.sin(windy.south)) / (1 - Math.sin(windy.south)));
        let equatorY = windy.height + mapOffsetY;
        let a = (equatorY - y) / worldMapRadius;

        let lat = (180 / Math.PI) * (2 * Math.atan(Math.exp(a)) - Math.PI / 2);
        let lon =
            rad2deg(windy.west) + (x / windy.width) * rad2deg(mapLonDelta);
        return [lon, lat];
    };

    let mercY = function(lat) {
        return Math.log(Math.tan(lat / 2 + Math.PI / 4));
    };

    var project = function(lat, lon, windy) {
        // both in radians, use deg2rad if neccessary
        let ymin = mercY(windy.south);
        let ymax = mercY(windy.north);
        let xFactor = windy.width / (windy.east - windy.west);
        let yFactor = windy.height / (ymax - ymin);

        // xFactor = 1;
        // yFactor = 1;

        let y = mercY(deg2rad(lat));
        let x = (deg2rad(lon) - windy.west) * xFactor;
        y = (ymax - y) * yFactor; // y points south
        return [x, y];
    };

    let interpolateField = function(grid, bounds, extent, callback) {
        let projection = {};
        // var velocityScale = VELOCITY_SCALE;

        // Math.pow(mapArea, 0.3)  地图级别越大，这个值越小，使得轨迹的幅度变化小
        let mapArea =
            (extent.south - extent.north) * (extent.west - extent.east);
        let velocityScale = VELOCITY_SCALE * Math.pow(mapArea, 0.3);

        let columns = [];
        let x = bounds.x;

        function interpolateColumn(x) {
            let column = [];
            for (let y = bounds.y; y <= bounds.yMax; y += 2) {
                let coord = invert(x, y, extent);

                if (coord) {
                    let λ = coord[0],
                        φ = coord[1];
                    if (isFinite(λ)) {
                        //console.log(λ+","+ φ);
                        let wind = grid.interpolate(λ, φ);

                        if (wind) {
                            wind = distort(
                                projection,
                                λ,
                                φ,
                                x,
                                y,
                                velocityScale,
                                wind,
                                extent
                            );
                            column[y + 1] = column[y] = wind;
                        }
                    }
                }
            }
            columns[x + 1] = columns[x] = column;
        }

        (function batchInterpolate() {
            let start = Date.now();
            while (x < bounds.width) {
                interpolateColumn(x);
                x += 2;
                if (Date.now() - start > 1000) {
                    //MAX_TASK_TIME) {
                    setTimeout(batchInterpolate, 25);
                    return;
                }
            }
            createField(columns, bounds, callback);
        })();
    };

    let animate = function(bounds, field, extent) {
        function asColorStyle(r, g, b, a) {
            return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
        }

        function hexToR(h) {
            return parseInt(cutHex(h).substring(0, 2), 16);
        }

        function hexToG(h) {
            return parseInt(cutHex(h).substring(2, 4), 16);
        }

        function hexToB(h) {
            return parseInt(cutHex(h).substring(4, 6), 16);
        }

        function cutHex(h) {
            return h.charAt(0) == '#' ? h.substring(1, 7) : h;
        }

        function windIntensityColorScale(step, maxWind) {
            let alpha = 1;
            // var result = ["rgb(255,0, 0)", "rgb(60,157, 194)", "rgb(128,205,193 )", "rgb(151,218,168 )", "rgb(198,231,181)", "rgb(238,247,217)", "rgb(255,238,159)", "rgb(252,217,125)", "rgb(255,182,100)", "rgb(252,150,75)", "rgb(250,112,52)", "rgb(245,64,32)", "rgb(237,45,28)", "rgb(220,24,32)", "rgb(180,0,35)"];

            // result = [
            //     // blue to red
            //     "rgba(" + hexToR('#178be7') + ", " + hexToG('#178be7') + ", " + hexToB('#178be7') + ", " + alpha + ")",
            //     "rgba(" + hexToR('#8888bd') + ", " + hexToG('#8888bd') + ", " + hexToB('#8888bd') + ", " + alpha + ")",
            //     "rgba(" + hexToR('#b28499') + ", " + hexToG('#b28499') + ", " + hexToB('#b28499') + ", " + alpha + ")",
            //     "rgba(" + hexToR('#cc7e78') + ", " + hexToG('#cc7e78') + ", " + hexToB('#cc7e78') + ", " + alpha + ")",
            //     "rgba(" + hexToR('#de765b') + ", " + hexToG('#de765b') + ", " + hexToB('#de765b') + ", " + alpha + ")",
            //     "rgba(" + hexToR('#ec6c42') + ", " + hexToG('#ec6c42') + ", " + hexToB('#ec6c42') + ", " + alpha + ")",
            //     "rgba(" + hexToR('#f55f2c') + ", " + hexToG('#f55f2c') + ", " + hexToB('#f55f2c') + ", " + alpha + ")",
            //     "rgba(" + hexToR('#fb4f17') + ", " + hexToG('#fb4f17') + ", " + hexToB('#fb4f17') + ", " + alpha + ")",
            //     "rgba(" + hexToR('#fe3705') + ", " + hexToG('#fe3705') + ", " + hexToB('#fe3705') + ", " + alpha + ")",
            //     "rgba(" + hexToR('#ff0000') + ", " + hexToG('#ff0000') + ", " + hexToB('#ff0000') + ", " + alpha + ")"

            //     // "rgba(" + hexToR('#00ffff') + ", " + hexToG('#00ffff') + ", " + hexToB('#00ffff') + ", " + 0.5 + ")",
            //     // "rgba(" + hexToR('#64f0ff') + ", " + hexToG('#64f0ff') + ", " + hexToB('#64f0ff') + ", " + 0.5 + ")",
            //     // "rgba(" + hexToR('#87e1ff') + ", " + hexToG('#87e1ff') + ", " + hexToB('#87e1ff') + ", " + 0.5 + ")",
            //     // "rgba(" + hexToR('#a0d0ff') + ", " + hexToG('#a0d0ff') + ", " + hexToB('#a0d0ff') + ", " + 0.5 + ")",
            //     // "rgba(" + hexToR('#b5c0ff') + ", " + hexToG('#b5c0ff') + ", " + hexToB('#b5c0ff') + ", " + 0.5 + ")",
            //     // "rgba(" + hexToR('#c6adff') + ", " + hexToG('#c6adff') + ", " + hexToB('#c6adff') + ", " + 0.5 + ")",
            //     // "rgba(" + hexToR('#d49bff') + ", " + hexToG('#d49bff') + ", " + hexToB('#d49bff') + ", " + 0.5 + ")",
            //     // "rgba(" + hexToR('#e185ff') + ", " + hexToG('#e185ff') + ", " + hexToB('#e185ff') + ", " + 0.5 + ")",
            //     // "rgba(" + hexToR('#ec6dff') + ", " + hexToG('#ec6dff') + ", " + hexToB('#ec6dff') + ", " + 0.5 + ")",
            //     // "rgba(" + hexToR('#ff1edb') + ", " + hexToG('#ff1edb') + ", " + hexToB('#ff1edb') + ", " + 0.5 + ")"
            // ]

            let result = [];

            for (let j = 225; j >= 100; j = j - step) {
                // result.push(asColorStyle(j, j, j, 1)); 灰
                // result.push(asColorStyle( 55,109,176, 1)); 蓝

                if (!params.color) {
                    params.color = [255, 255, 255, 1];
                }

                result.push(
                    asColorStyle(
                        params.color[0],
                        params.color[1],
                        params.color[2],
                        params.color[3]
                    )
                );
            }

            result.indexFor = function(m) {
                // map wind speed to a style
                return Math.floor(
                    (Math.min(m, maxWind) / maxWind) * (result.length - 1)
                );
            };
            return result;
        }

        let colorStyles = windIntensityColorScale(
            INTENSITY_SCALE_STEP,
            MAX_WIND_INTENSITY
        );
        let buckets = colorStyles.map(function() {
            return [];
        });

        // var particleCount = Math.round(bounds.width * PARTICLE_MULTIPLIER * particleCountInput / 5); // adjust particle count by input

        // var mapArea = (extent.south - extent.north) * (extent.west - extent.east);
        // var particleCount = Math.round(bounds.width * bounds.height * PARTICLE_MULTIPLIER * Math.pow(mapArea, 0.2)* particleCountInput / 5);

        let particleCount = Math.round(
            (bounds.width *
                bounds.height *
                PARTICLE_MULTIPLIER *
                particleCountInput) /
                5
        );

        if (isMobile()) {
            particleCount *= PARTICLE_REDUCTION;
        }

        let fadeFillStyle =
            'rgba(0, 0, 0, ' + Math.sqrt(particleTailInput * 10.0) / 10.0 + ')'; // adjust particle tail length by input
        let MaxParticleAge = (MAX_PARTICLE_AGE * particleLifetimeInput) / 5; // adjust particle lifetime by input

        let particles = [];
        // console.log("粒子数：" + particleCount);
        for (let i = particles.length; i < particleCount; i++) {
            particles.push(
                field.randomize({
                    age: ~~(Math.random() * MAX_PARTICLE_AGE) + 0
                })
            );
        }

        //生成粒子轨迹坐标
        function evolve() {
            buckets.forEach(function(bucket) {
                bucket.length = 0;
            });
            particles.forEach(function(particle) {
                if (particle.age > MaxParticleAge) {
                    field.randomize(particle).age = 0;
                }
                let x = particle.x;
                let y = particle.y;
                let v = field(x, y); // vector at current position
                let m = v[2];
                if (m === null) {
                    particle.age = MaxParticleAge; // particle has escaped the grid, never to return...
                } else {
                    // console.log(v[0]+","+v[1]);
                    let xt = x + (v[0] * particleSpeedInput) / 5; // adjust particle speed by input
                    let yt = y + (v[1] * particleSpeedInput) / 5;
                    if (field(xt, yt)[2] !== null) {
                        // Path from (x,y) to (xt,yt) is visible, so add this particle to the appropriate draw bucket.
                        particle.xt = xt;
                        particle.yt = yt;
                        buckets[colorStyles.indexFor(m)].push(particle);
                    } else {
                        // Particle isn't visible, but it still moves through the field.
                        particle.x = xt;
                        particle.y = yt;
                    }
                }
                particle.age += 1;
            });
        }

        let g = params.canvas.getContext('2d');
        //g.lineWidth = PARTICLE_LINE_WIDTH;
        g.lineWidth = (PARTICLE_LINE_WIDTH * particleSizeInput) / 5; // adjust particle size by input
        g.fillStyle = fadeFillStyle;

        //根据点位绘制粒子
        function draw() {
            // Fade existing particle trails.
            let prev = g.globalCompositeOperation;
            g.globalCompositeOperation = 'destination-in';
            g.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
            g.globalCompositeOperation = prev;

            // Draw new particle trails.
            buckets.forEach(function(bucket, i) {
                if (bucket.length > 0) {
                    g.beginPath();
                    g.strokeStyle = colorStyles[i];
                    bucket.forEach(function(particle) {
                        g.moveTo(particle.x, particle.y);
                        g.lineTo(particle.xt, particle.yt);
                        particle.x = particle.xt;
                        particle.y = particle.yt;
                    });
                    g.stroke();
                }
            });
        }

        (function frame() {
            try {
                if (windy.timer) clearTimeout(windy.timer);
                windy.timer = setTimeout(function() {
                    requestAnimationFrame(frame);
                    evolve();
                    draw();
                }, 1000 / FRAME_RATE);
            } catch (e) {
                console.error(e);
            }
        })();
    };

    let start = function(bounds, width, height, extent) {
        let mapBounds = {
            south: deg2rad(extent[0][1]),
            north: deg2rad(extent[1][1]),
            east: deg2rad(extent[1][0]),
            west: deg2rad(extent[0][0]),
            width: width,
            height: height
        };

        stop();

        // build grid 构造网格数据
        buildGrid(params.data, function(grid) {
            // interpolateField
            interpolateField(
                grid,
                buildBounds(bounds, width, height),
                mapBounds,
                function(bounds, field) {
                    // animate the canvas with random points
                    windy.field = field;

                    //动画
                    animate(bounds, field, mapBounds);
                }
            );
        });
    };

    var stop = function() {
        if (windy.field) windy.field.release();
        if (windy.timer) clearTimeout(windy.timer);
    };

    let clear = function() {
        let canvas = params.canvas;
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    };

    let setData = function setData(obj) {
        if (obj.data) {
            params.data = obj.data;
        }
        if (obj.zoom) {
            params.zoom = obj.zoom;
        }
        if (obj.rate) {
            params.rate = obj.rate;
        }

        if (obj.dataType) {
            params.dataType = obj.dataType;
        }

        if (obj.color) {
            params.color = obj.color;
        }

        switch (obj.dataType) {
            case '预测':
                if (obj.zoom < 7) {
                    particleCountInput = 1.5; //粒子数
                    particleLifetimeInput = 7; //持续时间
                    particleSpeedInput = 12; //播放速度
                    particleTailInput = 8; //粒子长度，
                    particleSizeInput = 12; //粒子大小，
                } else {
                    particleCountInput = 1; //粒子数
                    particleLifetimeInput = 7; //持续时间
                    particleSpeedInput = 12; //播放速度
                    particleTailInput = 8; //粒子长度，
                    particleSizeInput = 10; //粒子大小，
                }
                break;
            case '自定义':
                obj.customWindyParam(obj);
                particleCountInput = obj.particleCountInput; //粒子数
                particleLifetimeInput = obj.particleLifetimeInput; //持续时间
                particleSpeedInput = obj.particleSpeedInput; //播放速度
                particleTailInput = obj.particleTailInput; //粒子长度，
                particleSizeInput = obj.particleSizeInput; //粒子大小，
                break;

            default:
                if (obj.zoom < 7) {
                    particleCountInput = 3; //粒子数
                    particleLifetimeInput = 7; //持续时间
                    particleSpeedInput = 12; //播放速度
                    particleTailInput = 6; //粒子长度，
                    particleSizeInput = 11; //粒子大小，
                } else if (obj.zoom < 11) {
                    particleCountInput = 1.3; //粒子数
                    particleLifetimeInput = 6; //持续时间
                    particleSpeedInput = 11; //播放速度
                    particleTailInput = 5; //粒子长度，
                    particleSizeInput = 6; //粒子大小，
                } else {
                    particleCountInput = 0.8; //粒子数
                    particleLifetimeInput = 7; //持续时间
                    particleSpeedInput = 7; //播放速度
                    particleTailInput = 4; //粒子长度，
                    particleSizeInput = 6; //粒子大小，
                }
                break;
        }

        if (params.rate && parseFloat(params.rate) > 0) {
            particleCountInput = particleCountInput * parseFloat(params.rate);
            particleLifetimeInput =
                particleLifetimeInput * parseFloat(params.rate);
            particleSpeedInput = particleSpeedInput * parseFloat(params.rate);
            particleTailInput = particleTailInput * parseFloat(params.rate);
            particleSizeInput = particleSizeInput * parseFloat(params.rate);
        }
    };

    var windy = {
        params: params,
        start: start,
        stop: stop,
        clear: clear,
        setData: setData
    };

    return windy;
};

// shim layer with setTimeout fallback
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
