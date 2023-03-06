/** @format */

let resources = [];
GisServerGlobalConstant.arcgisApiHost =
    GisServerGlobalConstant.arcgisApiHost;
//这里换成let 将会有问题,eslint 会将var 自动转换为let ，所以加了以下这句
// eslint-disable-next-line
var dojoConfig = {
    async: true,
    locale: 'zh-cn', //小写才会生效
    baseUrl: GisServerGlobalConstant.arcgisApiHost + 'dojo',
    packages:[
        {
            name: 'arcgis',
            location: location.origin + '/arcgis'
        }
    ]
};

if (GisServerGlobalConstant.is2D) {
    //是否需要xmltojosn库， 用于EsrilocalLayer、esri本地切片
    let needXmltojson = !GisServerGlobalConstant.arcgis.needXmltojson
        ? false
        : true;

    //是否需要地图导出
    let needSaveMap = !GisServerGlobalConstant.arcgis.needSaveMap
        ? false
        : true;

    //是否需要风场
    let needWind = !GisServerGlobalConstant.arcgis.needWind ? false : true;

    // 是否需要百度库、用于百度坐标系转换，一般底图为百度地图时可能用到
    let needBaidu = !GisServerGlobalConstant.arcgis.needBaidu ? false : true;

    //是否需要全屏
    let needFullscreen = !GisServerGlobalConstant.arcgis.needFullscreen
        ? false
        : true;

    // 是否需要d3
    let needD3 = !GisServerGlobalConstant.arcgis.needD3 ? false : true;

    //是否数据转换，比如需要将pbf数据转成geojson,geojson 转换为arcgis json 等
    let needTerraformer = !GisServerGlobalConstant.arcgis.needTerraformer
        ? false
        : true;

    //是否需要geoTiff
    let needGeotiff = !GisServerGlobalConstant.arcgis.needGeotiff
        ? false
        : true;

    //是否需要ShapeFile
    let needShapefile = !GisServerGlobalConstant.arcgis.needShapefile
        ? false
        : true;

    //是否需要大气克里金差值
    let needKriging = !GisServerGlobalConstant.arcgis.needKriging
        ? false
        : true;

    //是否需要前端风场
    let needFrontWind = !GisServerGlobalConstant.arcgis.needFrontWind
        ? false
        : true;

    //是否需要echat3
    let needEchart3 = !GisServerGlobalConstant.arcgis.needEchart3
        ? false
        : true;

    //是否加载mapv
    let needMav = !GisServerGlobalConstant.arcgis.needMav ? false : true;

    console.log('文件正在加载');
    resources = resources.concat([
        GisServerGlobalConstant.arcgisApiHost + 'esri/css/esri.css',
        GisServerGlobalConstant.arcgisApiHost + 'dijit/themes/claro/claro.css'
    ]);

    if (needXmltojson) {
        resources = resources.concat(['./gis/2D/plugin/xml2json.js']);
    }

    if (needWind) {
        resources = resources.concat(['./gis/2D/plugin/windy.js']);
    }

    if (needBaidu) {
        resources = resources.concat(['./gis/2D/plugin/baidu.js']);
    }

    if (needD3) {
        resources = resources.concat([
            './gis/common/plugin/d3/d3.v4.min.js',
            './gis/common/plugin/d3/d3-color.js',
            './gis/common/plugin/d3/d3-hsv.v0.1.min.js',
            './gis/common/plugin/d3/d3-contour@3.js'
        ]);
    }

    if (needFullscreen) {
        resources = resources.concat([
            './gis/common/plugin/jquery.fullscreen.js'
        ]);
    }

    if (needSaveMap) {
        resources = resources.concat([
            './gis/2D/plugin/saveImage/html2canvas.js',
            './gis/2D/plugin/saveImage/saveSvgAsPng.js'
        ]);
    }

    if (needTerraformer) {
        resources = resources.concat([
            './gis/2D/plugin/geobuf.js',
            './gis/2D/plugin/pbf.js',
            './gis/2D/plugin/terraformer-arcgis-parser.js'
        ]);
    }

    if (needGeotiff) {
        resources = resources.concat(['./gis/2D/plugin/geotiff.js']);
    }

    if (needShapefile) {
        resources = resources.concat(['./gis/2D/plugin/shapefile.js']);
    }

    if (needKriging) {
        resources = resources.concat(['./gis/2D/plugin/kriging.js']);
    }

    if (needFrontWind) {
        resources = resources.concat(['./gis/2D/plugin/wind-front.js']);
    }

    if (needEchart3) {
        resources = resources.concat(['./gis/2D/plugin/echarts.js']);
    }

    if (needMav) {
        resources = resources.concat(['./gis/2D/plugin/mapv.js']);
    }
}

if (GisServerGlobalConstant.is3D) {
    let needD3 = !GisServerGlobalConstant.mapbox.needD3 ? false : true;

    if (needD3) {
        let url = './gis/common/plugin/d3/d3.v4.min.js';

        if (!resources.includes(url)) {
            resources = resources.concat([url]);
        }
    }

    let needWind = !GisServerGlobalConstant.mapbox.needWind ? false : true;
    if (needWind) {
        resources = resources.concat(['./gis/3D/plugin/windLayer0.js']);
    }

    let needArcgisToGeojson = !GisServerGlobalConstant.mapbox
        .needArcgisToGeojson
        ? false
        : true;

    if (needArcgisToGeojson) {
        resources = resources.concat(['./gis/3D/plugin/arcgis-to-geojson.js']);
    }

    //是否需要全屏
    let needFullscreen = !GisServerGlobalConstant.mapbox.needFullscreen
        ? false
        : true;

    if (needFullscreen) {
        resources = resources.concat([
            './gis/common/plugin/jquery.fullscreen.js'
        ]);
    }

    //是否需要大气克里金差值
    let needKriging = !GisServerGlobalConstant.mapbox.needKriging
        ? false
        : true;

    if (needKriging) {
        resources = resources.concat(['./gis/2D/plugin/kriging.js']);
    }

    let needDraw = !GisServerGlobalConstant.mapbox.needDraw ? false : true;

    if (needDraw) {
        resources = resources.concat([
            './gis/3D/plugin/mapboxgl/mapbox-gl-draw.js',
            './gis/3D/plugin/mapboxgl/mapbox-gl-draw.css'
        ]);
    }
}

// 以上为加载
loadResources(
    resources,
    null,
    function (url, loaded) {},
    function () {
        //回调
    }
);

function loadResources(ress, onOneBeginLoad, onOneLoad, onLoad) {
    let loaded = [];

    function _onOneLoad(url) {
        //to avoid trigger onload more then one time
        if (checkHaveLoaded(url)) {
            return;
        }
        loaded.push(url);
        if (onOneLoad) {
            onOneLoad(url, loaded.length);
        }
        if (loaded.length === ress.length) {
            if (onLoad) {
                onLoad();
            }
        }
    }

    for (let i = 0; i < ress.length; i++) {
        loadResource(ress[i], onOneBeginLoad, _onOneLoad);
    }

    function checkHaveLoaded(url) {
        for (let i = 0; i < loaded.length; i++) {
            if (loaded[i] === url) {
                return true;
            }
        }
        return false;
    }
}

function getExtension(url) {
    url = url || '';
    let items = url.split('?')[0].split('.');
    return items[items.length - 1].toLowerCase();
}

function loadResource(url, onBeginLoad, onLoad) {
    if (onBeginLoad) {
        onBeginLoad(url);
    }
    let type = getExtension(url);
    if (type.toLowerCase() === 'css') {
        loadCss(url);
    } else {
        loadJs(url);
    }

    function createElement(config) {
        let e = document.createElement(config.element);
        for (let i in config) {
            if (i !== 'element' && i !== 'appendTo') {
                e[i] = config[i];
            }
        }
        let root = document.getElementsByTagName(config.appendTo)[0];
        return typeof root.appendChild(e) === 'object';
    }

    function loadCss(url) {
        let result = createElement({
            element: 'link',
            rel: 'stylesheet',
            type: 'text/css',
            href: url,
            onload: function () {
                elementLoaded(url);
            },
            appendTo: 'head'
        });

        //for the browser which doesn't fire load event
        //safari update documents.stylesheets when style is loaded.
        let ti = setInterval(function () {
            let styles = document.styleSheets;
            for (let i = 0; i < styles.length; i++) {
                // console.log(styles[i].href);
                if (
                    styles[i].href &&
                    styles[i].href.substr(
                        styles[i].href.indexOf(url),
                        styles[i].href.length
                    ) === url
                ) {
                    clearInterval(ti);
                    elementLoaded(url);
                }
            }
        }, 500);

        return result;
    }

    function loadJs(url) {
        let result = createElement({
            element: 'script',
            type: 'text/javascript',
            onload: function () {
                elementLoaded(url);
            },
            onreadystatechange: function () {
                elementReadyStateChanged(url, this);
            },
            src: url,
            appendTo: 'body'
        });
        return result;
    }

    function elementLoaded(url) {
        if (onLoad) {
            onLoad(url);
        }
    }

    function elementReadyStateChanged(url, thisObj) {
        if (
            thisObj.readyState === 'loaded' ||
            thisObj.readyState === 'complete'
        ) {
            elementLoaded(url);
        }
    }
}
