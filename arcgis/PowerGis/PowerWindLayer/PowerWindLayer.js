define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-construct",
  "dojo/on",
  "esri/layers/layer",
  "esri/geometry/webMercatorUtils",
  "./util/PowerWind",
], function (declare, lang, domConst, on, Layer, webMercatorUtils, PowerWind) {
  return declare(Layer, {
    _element: null,
    _listeners: [],
    mapType: "", // esri.Map,mapboxgl
    powerModule: null,
    _gl: null,
    _intervalId: null,
    lastTime: null,

    constructor: function (url, options) {
      this.inherited(arguments);
      console.log("PowerWindLayer");
      this.loaded = true;
      this.powerModule = new PowerWind({
        pxRatio: 2,
        speedFactor: 0.9,
        particleDensity: 0.1,
      });
      this.onLoad(this);
      // pan-end zoom-end resize extent-change
      this.moveEndHandler = (e) => {
        this.setVisibility(true);
        this.powerModule.resize();
      };
      // panning zooming
      this.movingHandler = (evt) => {
        this.powerModule.initMatrix(evt.extent);
        // this.setVisibility(false);
      };
      // zoom-end
      this.zoomEndHandler = () => {
        let zoom = this.map.getZoom();
        this.powerModule.updateParticleDensity(zoom);
      };
      // visible-change
      this.visibleChangeHandler = (evt) => {
        // this._toggleListeners();
        if (evt.visible) {
          this._redrawCanvas();
        } else {
          this._clearCanvas();
        }
      };
    },

    // 设置风场数据
    setData: function (data) {
      this.powerModule.setDataByJson(data);
    },

    _setMap: function (map, container) {
      this.inherited(arguments);
      this._element = domConst.create(
        "canvas",
        {
          className: this.className,
          width: this._map.width + "px",
          height: this._map.height + "px",
          style: "position: absolute; left: 0px; top: 0px;",
        },
        container
      );
      this._initListeners();
      this._gl = this._element.getContext("webgl");
      this.powerModule.onAdd(map, this._gl);
      this.animationFrame();
      return this._element;
    },
    _unsetMap: function () {
      this.inherited(arguments);
      var forceOff = true;
      this._toggleListeners(forceOff);
      this._clearCanvas();
      this.powerModule.onRemove(map, this._gl);
    },
    _clearCanvas: function () {
      let gl = this._gl;
      // gl.clearColor(0,0,0,0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    },
    _redrawCanvas: function () {},
    clear: function () {
      this.inherited(arguments);
      // this._clearCanvas();
    },
    animationFrame: function () {
      requestAnimationFrame(() => {
        /* let moving = this._map.__panning || this._map.__zooming;
        if (!moving) {
          this.powerModule.render(this._gl);
        } */
        this.powerModule.render(this._gl);
        this.animationFrame();
      });
    },

    requestAnimationFramePolyfill(callback) {
      var now = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (now - lastTime));
      var id = setTimeout(function () {
        callback(now + timeToCall);
      }, timeToCall);
      lastTime = now + timeToCall;
      return id;
    },

    _initListeners: function () {
      // custom handling of when setVisibility(), show(), or hide() are called on the layer
      this.on("visibility-change", this.visibleChangeHandler);

      // pausable listeners

      // when user finishes zooming or panning the map
      this._listeners.push(
        on.pausable(this._map, "extent-change", this.moveEndHandler)
      );

      // when user begins zooming the map
      this._listeners.push(on.pausable(this._map, "zoom", this.movingHandler));
      this._listeners.push(
        on.pausable(this._map, "zoom-end", this.moveEndHandler)
      );

      // when user is actively panning the map
      this._listeners.push(on.pausable(this._map, "pan", this.movingHandler));

      // when map is resized in the browser
      this._listeners.push(
        on.pausable(this._map, "resize", this.moveEndHandler)
      );

      // when user interacts with a graphic by click or mouse-over,
      // provide additional event properties
      /* this._listeners.push(on.pausable(this, 'click,mouse-over', lang.hitch(this, function(evt) {
          var odInfo = this._getSharedOriginOrDestinationGraphics(evt.graphic);
          evt.isOriginGraphic = odInfo.isOriginGraphic;
          evt.sharedOriginGraphics = odInfo.sharedOriginGraphics;
          evt.sharedDestinationGraphics = odInfo.sharedDestinationGraphics;
        }))); */

      // pause or resume the pausable listeners depending on initial layer visibility
      this._toggleListeners();
    },

    _toggleListeners: function (forceOff) {
      forceOff = forceOff || !this.visible;
      var pausableMethodName = forceOff ? "pause" : "resume";
      this._listeners.forEach(function (listener) {
        listener[pausableMethodName]();
      });
    },
  });
});
