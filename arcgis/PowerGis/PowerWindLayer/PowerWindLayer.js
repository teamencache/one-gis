define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-construct",
  "dojo/on",
  "esri/layers/layer",
  "esri/geometry/webMercatorUtils",
  "./util/PowerWind",
], function (
  declare,
  lang,
  domConst,
  on,
  Layer,
  webMercatorUtils,
  PowerWind
) {

  return declare(Layer, {

    _element: null,
    _listeners: [],
    mapType:'',// esri.Map,mapboxgl
    powerModule:null,
    _gl:null,
    _intervalId:null,


    constructor: function (url, options) {
      this.inherited(arguments);
      console.log("PowerWindLayer");
      this.loaded = true;
      this.powerModule = new PowerWind({
        pxRatio:10
      });
      this.onLoad(this);
      this.resizeHandler = (e) => {
        if (e.type == "wheel") {
          let zoom = this.map.getZoom();
          this.powerModule.particleDensity = this.updateParticleDensity(zoom);
        }
        this.powerModule.resize();
      };
    },

    requestAnimationFramePolyfill(callback) {
      var now = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (now - lastTime));
      var id = setTimeout(function() { callback(now + timeToCall); }, timeToCall);
      lastTime = now + timeToCall;
      return id;
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
      this._gl = this._element.getContext('webgl');
      this.powerModule.onAdd(map, this._gl);
      
      this._intervalId = setInterval(() => {
        this.powerModule.render(this._gl);
      }, 60);
      return this._element;
    },
    _unsetMap: function () {
      this.inherited(arguments);
      var forceOff = true;
      this._toggleListeners(forceOff);
      // this._clearCanvas();
      this.powerModule.onRemove(map, this._gl);
    },
    clear: function () {
      this.inherited(arguments);
      this._clearCanvas();
    },

    _panCanvas: function (e) {
      this.resizeHandler(e);
      console.log("pan");
    },
    _extentChange:function(e){
      console.log('extent');
      this.resizeHandler(e)
    },
    _zoomChange:function(e){
      console.log('zoom');
      this.resizeHandler(e)
    },
    _resizeCanvas: function () {
      console.log("resize");
    },
    _redrawCanvas: function (e) {
      
    },
    _clearCanvas: function () {
      console.log("clear");
    },

    _initListeners: function () {
      // custom handling of when setVisibility(), show(), or hide() are called on the layer
      this.on(
        "visibility-change",
        lang.hitch(this, function (evt) {
          this._toggleListeners();
          if (evt.visible) {
            this._redrawCanvas();
          } else {
            this._clearCanvas();
          }
        })
      );

      // pausable listeners

      // when user finishes zooming or panning the map
      this._listeners.push(
        on.pausable(
          this._map,
          "extent-change",
          lang.hitch(this, "_extentChange")
        )
      );

      // when user begins zooming the map
      this._listeners.push(
        on.pausable(this._map, "zoom", lang.hitch(this, "_zoomChange"))
      );

      // when user is actively panning the map
      this._listeners.push(
        on.pausable(this._map, "pan", lang.hitch(this, "_panCanvas"))
      );

      // when map is resized in the browser
      this._listeners.push(
        on.pausable(this._map, "resize", lang.hitch(this, "_resizeCanvas"))
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
