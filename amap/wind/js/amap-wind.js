(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.AMapWind = {}));
})(this, (function (exports) { 'use strict';

  const hasOwnProperty = Object.prototype.hasOwnProperty;
  const symToStringTag = typeof Symbol !== "undefined" ? Symbol.toStringTag : void 0;
  function baseGetTag(value) {
    if (value === null) {
      return value === void 0 ? "[object Undefined]" : "[object Null]";
    }
    if (!(symToStringTag && symToStringTag in Object(value))) {
      return toString.call(value);
    }
    const isOwn = hasOwnProperty.call(value, symToStringTag);
    const tag = value[symToStringTag];
    let unmasked = false;
    try {
      value[symToStringTag] = void 0;
      unmasked = true;
    } catch (e) {
    }
    const result = Object.prototype.toString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    const tag = baseGetTag(value);
    return tag === "[object Function]" || tag === "[object AsyncFunction]" || tag === "[object GeneratorFunction]" || tag === "[object Proxy]";
  }
  function isObject(value) {
    const type = typeof value;
    return value !== null && (type === "object" || type === "function");
  }
  function isString(value) {
    if (value == null) {
      return false;
    }
    return typeof value === "string" || value.constructor !== null && value.constructor === String;
  }
  function isNumber(value) {
    return Object.prototype.toString.call(value) === "[object Number]" && !isNaN(value);
  }
  function isArray(arr) {
    return Array.isArray(arr);
  }
  function assign(target, ...sources) {
    return Object.assign(target, ...sources);
  }
  function warnLog(msg, n) {
    console.warn(`${n || "wind-layer"}: ${msg}`);
  }
  const warnings = {};
  function warnOnce(namespaces, msg) {
    if (!warnings[msg]) {
      warnLog(msg, namespaces);
      warnings[msg] = true;
    }
  }
  function floorMod(a, n) {
    return a - n * Math.floor(a / n);
  }
  function isValide(val) {
    return val !== void 0 && val !== null && !isNaN(val);
  }
  function formatData(data, options = {}) {
    let uComp = void 0;
    let vComp = void 0;
    // data.forEach(function(record) {
    //   switch (record.header.parameterCategory + "," + record.header.parameterNumber) {
    //     case "1,2":
    //     case "2,2":
          uComp = data[0];
        //   break;
        // case "1,3":
        // case "2,3":
          vComp =  data[1];
      //     break;
      // }
    // });
    if (!vComp || !uComp) {
      return void 0;
    }
    const header = uComp.header;
    const vectorField = new Field({
      xmin: header.lo1,
      ymin: header.la2,
      xmax: header.lo2,
      ymax: header.la1,
      deltaX: header.dx,
      deltaY: header.dy,
      cols: header.nx,
      rows: header.ny,
      us: uComp.data,
      vs: vComp.data,
      ...options
    });
    return vectorField;
  }
  function createCanvas(width, height, retina, Canvas) {
    if (typeof document !== "undefined") {
      const canvas = document.createElement("canvas");
      canvas.width = width * retina;
      canvas.height = height * retina;
      return canvas;
    } else {
      return new Canvas(width * retina, height * retina);
    }
  }
  function removeDomNode(node) {
    if (!node) {
      return null;
    }
    if (node.parentNode) {
      node.parentNode.removeChild(node);
    }
    return node;
  }
  class Vector {
    constructor(u, v) {
      this.u = u;
      this.v = v;
      this.m = this.magnitude();
    }
    magnitude() {
      return Math.sqrt(this.u ** 2 + this.v ** 2);
    }
    directionTo() {
      const verticalAngle = Math.atan2(this.u, this.v);
      let inDegrees = verticalAngle * (180 / Math.PI);
      if (inDegrees < 0) {
        inDegrees += 360;
      }
      return inDegrees;
    }
    directionFrom() {
      const a = this.directionTo();
      return (a + 180) % 360;
    }
  }
  class Field {
    constructor(params) {
      this.grid = [];
      this.xmin = params.xmin;
      this.xmax = params.xmax;
      this.ymin = params.ymin;
      this.ymax = params.ymax;
      this.cols = params.cols;
      this.rows = params.rows;
      this.us = params.us;
      this.vs = params.vs;
      this.deltaX = (this.xmax-this.xmin)/this.cols;//params.deltaX;
      this.deltaY = (this.ymax-this.ymin)/this.rows;//params.deltaY;
      this.flipY = Boolean(params.flipY);
      this.ymin = Math.min(params.ymax, params.ymin);
      this.ymax = Math.max(params.ymax, params.ymin);
      if (!(this.deltaY < 0 && this.ymin < this.ymax)) {
        if (params.flipY === void 0) {
          this.flipY = true;
        }
        console.warn("[wind-core]: The data is flipY");
      }
      this.isFields = true;
      const cols = Math.ceil((this.xmax - this.xmin) / this.deltaX);
      const rows = Math.ceil((this.ymax - this.ymin) / this.deltaY);
      if (cols !== this.cols || rows !== this.rows) {
        console.warn("[wind-core]: The data grid not equal");
      }
      this.isContinuous = Math.floor(this.cols * params.deltaX) >= 360;
      this.translateX = "translateX" in params ? params.translateX : this.xmax > 180;
      if ("wrappedX" in params) {
        warnOnce("[wind-core]: ", "`wrappedX` namespace will deprecated please use `translateX` instead\uFF01");
      }
      this.wrapX = Boolean(params.wrapX);
      this.grid = this.buildGrid();
      this.range = this.calculateRange();
    }
    buildGrid() {
      let grid = [];
      let p = 0;
      const { rows, cols, us, vs } = this;
      for (let j = 0; j < rows; j++) {
        const row = [];
        for (let i = 0; i < cols; i++, p++) {
          let u = us[p];
          let v = vs[p];
          let valid = this.isValid(u) && this.isValid(v);
          row[i] = valid ? new Vector(u, v) : null;
        }
        if (this.isContinuous) {
          row.push(row[0]);
        }
        grid[j] = row;
      }
      return grid;
    }
    release() {
      this.grid = [];
    }
    extent() {
      return [
        this.xmin,
        this.ymin,
        this.xmax,
        this.ymax
      ];
    }
    bilinearInterpolateVector(x, y, g00, g10, g01, g11) {
      const rx = 1 - x;
      const ry = 1 - y;
      const a = rx * ry;
      const b = x * ry;
      const c = rx * y;
      const d = x * y;
      const u = g00.u * a + g10.u * b + g01.u * c + g11.u * d;
      const v = g00.v * a + g10.v * b + g01.v * c + g11.v * d;
      return new Vector(u, v);
    }
    calculateRange() {
      if (!this.grid || !this.grid[0])
        return;
      const rows = this.grid.length;
      const cols = this.grid[0].length;
      let min;
      let max;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const vec = this.grid[j][i];
          if (vec !== null) {
            const val = vec.m || vec.magnitude();
            if (min === void 0) {
              min = val;
            } else if (max === void 0) {
              max = val;
              min = Math.min(min, max);
              max = Math.max(min, max);
            } else {
              min = Math.min(val, min);
              max = Math.max(val, max);
            }
          }
        }
      }
      return [min, max];
    }
    isValid(x) {
      return x !== null && x !== void 0;
    }
    getWrappedLongitudes() {
      let xmin = this.xmin;
      let xmax = this.xmax;
      if (this.translateX) {
        if (this.isContinuous) {
          xmin = -180;
          xmax = 180;
        } else {
          xmax = this.xmax - 360;
          xmin = this.xmin - 360;
        }
      }
      return [xmin, xmax];
    }
    contains(lon, lat) {
      const [xmin, xmax] = this.getWrappedLongitudes();
      let longitudeIn = lon >= xmin && lon <= xmax;
      let latitudeIn;
      if (this.deltaY >= 0) {
        latitudeIn = lat >= this.ymin && lat <= this.ymax;
      } else {
        latitudeIn = lat >= this.ymax && lat <= this.ymin;
      }
      return longitudeIn && latitudeIn;
    }
    getDecimalIndexes(lon, lat) {
      const i = floorMod(lon - this.xmin, 360) / this.deltaX;
      if (this.flipY) {
        const j = (this.ymax - lat) / this.deltaY;
        return [i, j];
      } else {
        const j = (this.ymin + lat) / this.deltaY;
        return [i, j];
      }
    }
    valueAt(lon, lat) {
      let flag = false;
      if (this.wrapX) {
        flag = true;
      } else if (this.contains(lon, lat)) {
        flag = true;
      }
      if (!flag)
        return null;
      const indexes = this.getDecimalIndexes(lon, lat);
      let ii = Math.floor(indexes[0]);
      let jj = Math.floor(indexes[1]);
      const ci = this.clampColumnIndex(ii);
      const cj = this.clampRowIndex(jj);
      return this.valueAtIndexes(ci, cj);
    }
    interpolatedValueAt(lon, lat) {
      let flag = false;
      if (this.wrapX) {
        flag = true;
      } else if (this.contains(lon, lat)) {
        flag = true;
      }
      if (!flag)
        return null;
      let [i, j] = this.getDecimalIndexes(lon, lat);
      return this.interpolatePoint(i, j);
    }
    hasValueAt(lon, lat) {
      let value = this.valueAt(lon, lat);
      return value !== null;
    }
    interpolatePoint(i, j) {
      const indexes = this.getFourSurroundingIndexes(i, j);
      const [fi, ci, fj, cj] = indexes;
      let values = this.getFourSurroundingValues(fi, ci, fj, cj);
      if (values) {
        const [g00, g10, g01, g11] = values;
        return this.bilinearInterpolateVector(i - fi, j - fj, g00, g10, g01, g11);
      }
      return null;
    }
    clampColumnIndex(ii) {
      let i = ii;
      if (ii < 0) {
        i = 0;
      }
      let maxCol = this.cols - 1;
      if (ii > maxCol) {
        i = maxCol;
      }
      return i;
    }
    clampRowIndex(jj) {
      let j = jj;
      if (jj < 0) {
        j = 0;
      }
      let maxRow = this.rows - 1;
      if (jj > maxRow) {
        j = maxRow;
      }
      return j;
    }
    getFourSurroundingIndexes(i, j) {
      let fi = Math.floor(i);
      let ci = fi + 1;
      if (this.isContinuous && ci >= this.cols) {
        ci = 0;
      }
      ci = this.clampColumnIndex(ci);
      let fj = this.clampRowIndex(Math.floor(j));
      let cj = this.clampRowIndex(fj + 1);
      return [fi, ci, fj, cj];
    }
    getFourSurroundingValues(fi, ci, fj, cj) {
      let row;
      if (row = this.grid[fj]) {
        const g00 = row[fi];
        const g10 = row[ci];
        if (this.isValid(g00) && this.isValid(g10) && (row = this.grid[cj])) {
          const g01 = row[fi];
          const g11 = row[ci];
          if (this.isValid(g01) && this.isValid(g11)) {
            return [g00, g10, g01, g11];
          }
        }
      }
      return null;
    }
    valueAtIndexes(i, j) {
      return this.grid[j][i];
    }
    lonLatAtIndexes(i, j) {
      let lon = this.longitudeAtX(i);
      let lat = this.latitudeAtY(j);
      return [lon, lat];
    }
    longitudeAtX(i) {
      let halfXPixel = this.deltaX / 2;
      let lon = this.xmin + halfXPixel + i * this.deltaX;
      if (this.translateX) {
        lon = lon > 180 ? lon - 360 : lon;
      }
      return lon;
    }
    latitudeAtY(j) {
      let halfYPixel = this.deltaY / 2;
      return this.ymax - halfYPixel - j * this.deltaY;
    }
    randomize(o = {}, width, height, unproject) {
      let i = Math.random() * (width || this.cols) | 0;
      let j = Math.random() * (height || this.rows) | 0;
      const coords = unproject([i, j]);
      if (coords !== null) {
        o.x = coords[0];
        o.y = coords[1];
      } else {
        o.x = this.longitudeAtX(i);
        o.y = this.latitudeAtY(j);
      }
      return o;
    }
    checkFields() {
      return this.isFields;
    }
  }
  const defaultOptions = {
    globalAlpha: 0.9,
    lineWidth: 1,
    colorScale: "#fff",
    velocityScale: 1 / 25,
    maxAge: 90,
    paths: 800,
    frameRate: 20,
    useCoordsDraw: true,
    gpet: true
  };
  function indexFor(m, min, max, colorScale) {
    return Math.max(
      0,
      Math.min(
        colorScale.length - 1,
        Math.round((m - min) / (max - min) * (colorScale.length - 1))
      )
    );
  }
  class WindCore {
    constructor(ctx, options, field) {
      this.particles = [];
      this.generated = false;
      this.ctx = ctx;
      if (!this.ctx) {
        throw new Error("ctx error");
      }
      this.animate = this.animate.bind(this);
      this.setOptions(options);
      if (field) {
        this.updateData(field);
      }
    }
    setOptions(options) {
      this.options = { ...defaultOptions, ...options };
      const { width, height } = this.ctx.canvas;
      if ("particleAge" in options && !("maxAge" in options) && isNumber(this.options.particleAge)) {
        this.options.maxAge = this.options.particleAge;
      }
      if ("particleMultiplier" in options && !("paths" in options) && isNumber(this.options.particleMultiplier)) {
        this.options.paths = Math.round(
          width * height * this.options.particleMultiplier
        );
      }
      this.prerender();
    }
    getOptions() {
      return this.options;
    }
    updateData(field) {
      this.field = field;
      if (!this.generated) {
        return;
      }
      this.particles = this.prepareParticlePaths();
    }
    project(...args) {
      throw new Error("project must be overriden");
    }
    unproject(...args) {
      throw new Error("unproject must be overriden");
    }
    intersectsCoordinate(coordinates) {
      throw new Error("must be overriden");
    }
    clearCanvas() {
      this.stop();
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.forceStop = false;
    }
    start() {
      this.starting = true;
      this.forceStop = false;
      this.then = Date.now();
      this.animate();
    }
    stop() {
      cancelAnimationFrame(this.animationLoop);
      this.starting = false;
      this.forceStop = true;
    }
    animate() {
      if (this.animationLoop) {
        cancelAnimationFrame(this.animationLoop);
      }
      this.animationLoop = requestAnimationFrame(this.animate);
      const now = Date.now();
      const delta = now - this.then;
      if (delta > this.options.frameRate) {
        this.then = now - delta % this.options.frameRate;
        this.render();
      }
    }
    prerender() {
      this.generated = false;
      if (!this.field) {
        return;
      }
      this.particles = this.prepareParticlePaths();
      this.generated = true;
      if (!this.starting && !this.forceStop) {
        this.starting = true;
        this.then = Date.now();
        this.animate();
      }
    }
    render() {
      this.moveParticles();
      this.drawParticles();
      this.postrender();
    }
    postrender() {
    }
    moveParticles() {
      const { width, height } = this.ctx.canvas;
      const particles = this.particles;
      const maxAge = this.options.maxAge;
      const velocityScale = isFunction(this.options.velocityScale) ? this.options.velocityScale() : this.options.velocityScale;
      let i = 0;
      const len = particles.length;
      for (; i < len; i++) {
        const particle = particles[i];
        if (particle.age > maxAge) {
          particle.age = 0;
          this.field.randomize(particle, width, height, this.unproject);
        }
        const x = particle.x;
        const y = particle.y;
        const vector = this.field.interpolatedValueAt(x, y);
        if (vector === null) {
          particle.age = maxAge;
        } else {
          const xt = x + vector.u * velocityScale;
          const yt = y + vector.v * velocityScale;
          if (this.field.hasValueAt(xt, yt)) {
            particle.xt = xt;
            particle.yt = yt;
            particle.m = vector.m;
          } else {
            particle.x = xt;
            particle.y = yt;
            particle.age = maxAge;
          }
        }
        particle.age++;
      }
    }
    fadeIn() {
      const prev = this.ctx.globalCompositeOperation;
      this.ctx.globalCompositeOperation = "destination-in";
      this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.ctx.globalCompositeOperation = prev;
    }
    drawParticles() {
      const particles = this.particles;
      this.fadeIn();
      this.ctx.globalAlpha = this.options.globalAlpha;
      this.ctx.fillStyle = `rgba(0, 0, 0, ${this.options.globalAlpha})`;
      this.ctx.lineWidth = isNumber(this.options.lineWidth) ? this.options.lineWidth : 1;
      this.ctx.strokeStyle = isString(this.options.colorScale) ? this.options.colorScale : "#fff";
      let i = 0;
      const len = particles.length;
      if (this.field && len > 0) {
        let min;
        let max;
        if (isValide(this.options.minVelocity) && isValide(this.options.maxVelocity)) {
          min = this.options.minVelocity;
          max = this.options.maxVelocity;
        } else {
          [min, max] = this.field.range;
        }
        for (; i < len; i++) {
          this[this.options.useCoordsDraw ? "drawCoordsParticle" : "drawPixelParticle"](particles[i], min, max);
        }
      }
    }
    drawPixelParticle(particle, min, max) {
      const pointPrev = [particle.x, particle.y];
      const pointNext = [particle.xt, particle.yt];
      if (pointNext && pointPrev && isValide(pointNext[0]) && isValide(pointNext[1]) && isValide(pointPrev[0]) && isValide(pointPrev[1]) && particle.age <= this.options.maxAge) {
        this.ctx.beginPath();
        this.ctx.moveTo(pointPrev[0], pointPrev[1]);
        this.ctx.lineTo(pointNext[0], pointNext[1]);
        if (isFunction(this.options.colorScale)) {
          this.ctx.strokeStyle = this.options.colorScale(particle.m);
        } else if (Array.isArray(this.options.colorScale)) {
          const colorIdx = indexFor(
            particle.m,
            min,
            max,
            this.options.colorScale
          );
          this.ctx.strokeStyle = this.options.colorScale[colorIdx];
        }
        if (isFunction(this.options.lineWidth)) {
          this.ctx.lineWidth = this.options.lineWidth(particle.m);
        }
        particle.x = particle.xt;
        particle.y = particle.yt;
        this.ctx.stroke();
      }
    }
    drawCoordsParticle(particle, min, max) {
      const source = [particle.x, particle.y];
      const target = [particle.xt, particle.yt];
      if (target && source && isValide(target[0]) && isValide(target[1]) && isValide(source[0]) && isValide(source[1]) && this.intersectsCoordinate(target) && particle.age <= this.options.maxAge) {
        const pointPrev = this.project(source);
        const pointNext = this.project(target);
        if (pointPrev && pointNext) {
          this.ctx.beginPath();
          this.ctx.moveTo(pointPrev[0], pointPrev[1]);
          this.ctx.lineTo(pointNext[0], pointNext[1]);
          particle.x = particle.xt;
          particle.y = particle.yt;
          if (isFunction(this.options.colorScale)) {
            this.ctx.strokeStyle = this.options.colorScale(particle.m);
          } else if (Array.isArray(this.options.colorScale)) {
            const colorIdx = indexFor(
              particle.m,
              min,
              max,
              this.options.colorScale
            );
            this.ctx.strokeStyle = this.options.colorScale[colorIdx];
          }
          if (isFunction(this.options.lineWidth)) {
            this.ctx.lineWidth = this.options.lineWidth(particle.m);
          }
          this.ctx.stroke();
        }
      }
    }
    prepareParticlePaths() {
      const { width, height } = this.ctx.canvas;
      const particleCount = typeof this.options.paths === "function" ? this.options.paths(this) : this.options.paths;
      const particles = [];
      if (!this.field) {
        return [];
      }
      let i = 0;
      for (; i < particleCount; i++) {
        particles.push(
          this.field.randomize(
            {
              age: this.randomize()
            },
            width,
            height,
            this.unproject
          )
        );
      }
      return particles;
    }
    randomize() {
      return Math.floor(Math.random() * this.options.maxAge);
    }
  }
  WindCore.Field = Field;

  const G = typeof window === "undefined" ? global : window;
  const AMap = G == null ? void 0 : G.AMap;
  if (!AMap) {
    throw new Error("Before using this plugin, you must first introduce the amap JS API <https://lbs.amap.com/api/javascript-api/summary>");
  }
  const _options = {
    context: "2d",
    animation: false,
    opacity: 1,
    zIndex: 12,
    zooms: [0, 22],
    windOptions: {},
    fieldOptions: {}
  };
  class AMapWind {
    constructor(data, options = {}) {
      this.options = assign({}, _options, options);
      this.canvas = null;
      this.wind = null;
      this.init = this.init.bind(this);
      this.handleResize = this.handleResize.bind(this);
      this.canvasFunction = this.canvasFunction.bind(this);
      this.pickWindOptions();
      if (data) {
        this.setData(data, this.options.fieldOptions);
      }
    }
    appendTo(map) {
      if (map) {
        this.init(map);
      } else {
        throw new Error("not map object");
      }
    }
    init(map) {
      if (map) {
        this.map = map;
        this.context = this.options.context || "2d";
        this.getCanvasLayer();
        this.map.on("resize", this.handleResize, this);
      } else {
        throw new Error("not map object");
      }
    }
    handleResize() {
      if (this.canvas) {
        this.canvasFunction();
      }
    }
    render(canvas) {
      if (!this.getData())
        return this;
      const opt = this.getWindOptions();
      if (canvas && !this.wind) {
        const data = this.getData();
        const ctx = this.getContext();
        if (ctx) {
          this.wind = new WindCore(ctx, opt, data);
          this.wind.project = this.project.bind(this);
          this.wind.unproject = this.unproject.bind(this);
          this.wind.intersectsCoordinate = this.intersectsCoordinate.bind(this);
          this.wind.postrender = () => {
          };
        }
      }
      if (this.wind) {
        this.wind.prerender();
        this.wind.render();
      }
      return this;
    }
    getCanvasLayer() {
      if (!this.canvas) {
        const canvas = this.canvasFunction();
        const ops = {
          canvas
        };
        if (this.options.zooms) {
          ops.zooms = this.options.zooms;
        }
        if ("zIndex" in this.options && typeof this.options.zIndex === "number") {
          ops.zIndex = this.options.zIndex;
          canvas.style.zIndex = ops.zIndex;
        }
        if ("opacity" in this.options && typeof this.options.opacity === "number") {
          ops.opacity = this.options.opacity;
        }
        const container = this.map.getContainer();
        if (!container) {
          console.error("map container not exit");
          return;
        }
        const layerContainer = container.querySelector(".amap-layers");
        if (layerContainer) {
          layerContainer.appendChild(canvas);
        }
        this.map.on("mapmove", this.canvasFunction, this);
        this.map.on("zoomchange", this.canvasFunction, this);
      }
    }
    canvasFunction() {
      const retina = AMap.Browser.retina ? 2 : 1;
      const [width, height] = [this.map.getSize().width, this.map.getSize().height];
      if (!this.canvas) {
        this.canvas = createCanvas(width, height, retina, null);
        this.canvas.style.position = "absolute";
        this.canvas.style.top = "0px";
        this.canvas.style.left = "0px";
        this.canvas.style.right = "0px";
        this.canvas.style.bottom = "0px";
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
      } else {
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.canvas.width = width * retina;
        this.canvas.height = height * retina;
      }
      if (this.canvas) {
        this.render(this.canvas);
      }
      return this.canvas;
    }
    _getBounds() {
      const type = this.map.getViewMode_();
      let [southWest, northEast] = [void 0, void 0];
      const bounds = this.map.getBounds();
      if (type.toLowerCase() === "2d") {
        northEast = bounds.getNorthEast();
        southWest = bounds.getSouthWest();
      } else {
        const arrays = bounds.bounds.map((item) => {
          return [item.getLng(), item.getLat()];
        });
        southWest = new AMap.LngLat(arrays[3][0], arrays[3][1]);
        northEast = new AMap.LngLat(arrays[1][0], arrays[1][1]);
      }
      return new AMap.Bounds(southWest, northEast);
    }
    removeLayer() {
      if (!this.map)
        return;
      if (this.wind) {
        this.wind.stop();
      }
      this.map.off("resize", this.handleResize, this);
      this.map.off("mapmove", this.canvasFunction, this);
      this.map.off("zoomchange", this.canvasFunction, this);
      if (this.canvas) {
        removeDomNode(this.canvas);
      }
      delete this.map;
      delete this.canvas;
    }
    remove() {
      this.removeLayer();
    }
    project(coordinate) {
      const retina = AMap.Browser.retina ? 2 : 1;
      const pixel = this.map.lngLatToContainer(new AMap.LngLat(coordinate[0], coordinate[1], true));
      return [
        pixel.x * retina,
        pixel.y * retina
      ];
    }
    unproject(pixel) {
      const coordinate = this.map.containerToLngLat(new AMap.Pixel(pixel[0], pixel[1]));
      if (coordinate) {
        return [
          coordinate.lng,
          coordinate.lat
        ];
      }
      return null;
    }
    intersectsCoordinate(coordinate) {
      const mapExtent = this._getBounds();
      return mapExtent.contains(new AMap.LngLat(coordinate[0], coordinate[1]));
    }
    getContext() {
      if (this.canvas === null)
        return;
      return this.canvas.getContext(this.context);
    }
    pickWindOptions() {
      Object.keys(defaultOptions).forEach((key) => {
        if (key in this.options) {
          if (this.options.windOptions === void 0) {
            this.options.windOptions = {};
          }
          this.options.windOptions[key] = this.options[key];
        }
      });
    }
    getData() {
      return this.field;
    }
    setData(data, options = {}) {
      var _a;
      if (data && data.checkFields && data.checkFields()) {
        this.field = data;
      } else if (isArray(data)) {
        this.field = formatData(data, options);
      } else {
        console.error("Illegal data");
      }
      if (this.map && this.canvas && this.field) {
        (_a = this == null ? void 0 : this.wind) == null ? void 0 : _a.updateData(this.field);
        this.render(this.canvas);
      }
      return this;
    }
    updateParams(options = {}) {
      warnLog("will move to setWindOptions");
      this.setWindOptions(options);
      return this;
    }
    getParams() {
      warnLog("will move to getWindOptions");
      return this.getWindOptions();
    }
    setWindOptions(options) {
      const beforeOptions = this.options.windOptions || {};
      this.options = assign(this.options, {
        windOptions: assign(beforeOptions, options || {})
      });
      if (this.wind) {
        this.wind.setOptions(this.options.windOptions);
        this.wind.prerender();
      }
    }
    getWindOptions() {
      return this.options.windOptions || {};
    }
  }
  const WindLayer = AMapWind;

  exports.Field = Field;
  exports.WindLayer = WindLayer;
  exports.default = AMapWind;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=amap-wind.js.map
