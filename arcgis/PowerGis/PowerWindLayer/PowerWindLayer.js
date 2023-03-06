define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/dom-construct",
  "dojo/on",
  "esri/layers/layer",
  "./util/ShaderUtil",
  "./util/PowerFormater",
  "./util/ImageUtil",
], function (
  declare,
  lang,
  domConst,
  on,
  Layer,
  ShaderUtil,
  PowerFormater,
  ImageUtil
) {
  const {
    createShader,
    createProgram,
    createTexture,
    bindTexture,
    createBuffer,
    bindAttribute,
    bindAttribute2,
    bindFramebuffer,
  } = ShaderUtil;
  return declare(Layer, {
    _element: null,
    _listeners: [],
    imageUtil: new ImageUtil(),
    powerWind:null,
    constructor: function (url, options) {
      this.inherited(arguments);
      console.log("PowerWindLayer");
      this.loaded = true;
      this.onLoad(this);
    },

    setData: function (data) {
      let windData = PowerFormater.formatWindData(data);
      this.imageUtil.setSourceImageData(windData.imageData, windData.bbox, {
        width: windData.width,
        height: windData.height,
      });
      // imageUtil.flipImageData('Y');
      let image = this.imageUtil.image;
      windData.image = image;
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
      return this._element;
    },
    _unsetMap: function () {
      this.inherited(arguments);
      var forceOff = true;
      this._toggleListeners(forceOff);
      this._clearCanvas();
    },
    clear: function () {
      this.inherited(arguments);
      this._clearCanvas();
    },
    _panCanvas: function () {
      console.log("pan");
    },
    _resizeCanvas: function () {
      console.log("resize");
    },
    _redrawCanvas: function () {
      let extent = PowerGis.webMercatorToGeographic(this._map.extent);
      this.imageUtil.test(extent);
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
          lang.hitch(this, "_redrawCanvas")
        )
      );

      // when user begins zooming the map
      this._listeners.push(
        on.pausable(this._map, "zoom-start", lang.hitch(this, "_clearCanvas"))
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
