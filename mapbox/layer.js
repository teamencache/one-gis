/** @format */

let simple = {
  version: 8,
  light: {
    anchor: "viewport",
    color: "rgb(255,255,255)",
    intensity: 1,
  },
  sprite: "mapbox://styles/mapbox/streets-v11",
  // "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  // "sprite":"http://202.104.140.38:9988/mapresource/sprite/sprite",
  glyphs:
    "http://202.104.140.38:9988/mapresource/fonts/{fontstack}/{range}.pbf",
  sources: {
    "mapbox-dem": {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      minzoom: 1,
      maxzoom: 16,
    },
    adminmap: {
      type: "vector",
      scheme: "tms",
      tiles: [
        "http://202.104.140.38:9988/geoserver/gwc/service/tms/1.0.0/chq_nchj:adminmap@EPSG:900913@pbf/{z}/{x}/{y}.pbf",
      ],
    },
    basemap: {
      type: "vector",
      scheme: "tms",
      tiles: [
        "http://202.104.140.38:9988/geoserver/gwc/service/tms/1.0.0/chq_nchj:basemap@EPSG:900913@pbf/{z}/{x}/{y}.pbf",
      ],
    },
    tianditu_img: {
      //天地图卫星影像图tianditu_img
      type: "raster",
      tiles: [
        "http://t0.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=1f08becab78a7afba1156ddb3f539147",
      ],
      tileSize: 256,
    },

    arcgis_img: {
      //ESRIArcGIS卫星影像图arcgis_img
      type: "raster",
      tiles: [
        "http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/tile/1.0.0/World_Imagery/default/default028mm/{z}/{y}/{x}.png",
      ],
      // "tiles":["http://202.104.140.38:81/arcgis/rest/services/HangZhou/HangZhou_CA_SYD/MapServer/WMTS/tile/1.0.0/World_Imagery/default/default028mm/{z}/{y}/{x}.png"],
      tileSize: 256,
      zoomOffset: -1,
      minzoom: 0,
      maxzoom: 17,
    },
  },
  layers: [
    {
      //01.背景
      id: "background",
      type: "background",
      layout: {},
      paint: {
        "background-color": "#C1DDDF",
      },
    },
    {
      //02.天空
      id: "sky",
      type: "sky",
      layout: {},
      paint: {
        "sky-type": "atmosphere", //gradient", "atmosphere". Defaults to "atmosphere"
        "sky-opacity": 0.8, //between 0 and 1 inclusive. Defaults to 1
        "sky-atmosphere-color": "#036fe9", //Defaults to "white"
        "sky-atmosphere-halo-color": "white", //Defaults to "white"
        "sky-atmosphere-sun": [45, 70], //between 00 and 360180 inclusive. Units in degrees
        // // "sky-gradient":,//Defaults to ["interpolate",["linear"],["sky-radial-progress"],0.8,"#87ceeb",1,"white"].
        // "sky-gradient-center":"[0,0]",  //between 00 and 360180. Units in degrees. Defaults to [0,0]
        // "sky-gradient-radius":90    // 0 and 180 inclusive. Defaults 90
      },
    },

    {
      //1.陆地背景
      id: "boua1_sjxzqh",
      type: "fill",
      source: "adminmap",
      "source-layer": "BOUA2_DJSXZQH",
      // "filter": ["!=","NAME","武汉市"],
      layout: {},
      paint: {
        "fill-color": "#BEDD96",
        // "fill-outline-color": "rgb(25,45,65)"
      },
    },

    // {
    //     //15.当前行政区划3D
    //     "id": "boua2_djsxzqh/cur_3d",
    //     "minzoom":6,
    //     "maxzoom":13,
    //     "type": "fill-extrusion",
    //     "source": "adminmap",
    //     // "source": "basemap",
    //     // "source-layer": "buff200",
    //     "source-layer": "BOUA_DQXZQ",
    //     // "filter": ["all",["in","NAME","武汉市"]],
    //     "paint": {
    //         "fill-extrusion-color": "rgba(0,12,25,1)",
    //         "fill-extrusion-height": 1000,
    //         "fill-extrusion-opacity": 1
    //         // "fill-extrusion-vertical-gradient":false
    //     }
    // },

    {
      // 卫星影像图
      id: "raster_img",
      type: "raster",
      // "minzoom": 6,
      //  "maxzoom": 17,
      source: "arcgis_img",
      // "source":"tianditu_img",
      paint: {
        "raster-hue-rotate": 0,
        "raster-opacity": 1,
        // "raster-contrast":0.15,//对比度
        // "raster-saturation":0.15,//饱和度
        // "raster-brightness-min":0.1,//最小亮度
        // "raster-brightness-max":0.3//最小亮度
      },
    },
    // {
    //     // 山体效果图
    //     "id": "dem_hills",
    //     "type": "raster",
    //     "source": "DEM_HS_DB",
    //     "paint": {
    //         "raster-hue-rotate":0,
    //         "raster-opacity":0.65,
    //         "raster-contrast":0.1,//对比度
    //         "raster-saturation":0.1,//饱和度
    //         // "raster-brightness-min":0//最小亮度
    //     }
    // },
    {
      //9.周边行政区划（遮罩）
      id: "boua2_djsxzqh/zhoubian",
      type: "fill",
      minzoom: 0,
      maxzoom: 24,
      source: "adminmap",
      "source-layer": "ZBDQ_BACKGROUND",
      layout: {},
      paint: {
        "fill-color": "rgb(15,38,47)",
        "fill-opacity": 0.65,
        // "fill-outline-color": "rgb(25,45,65)"
      },
    },
    //周边地区******************
    {
      //3.区划界线:省级境界线1
      id: "zbdq_boul_xzjjx/sj_1",
      type: "line",
      source: "adminmap",
      "source-layer": "ZBDQ_BOUL1_XZJJX_SJ",
      minzoom: 2,
      maxzoom: 6.5,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#032739",
        "line-width": 1,
      },
    },
    {
      //4.区划界线:区县级境界线
      id: "zbdq_boul_xzjjx/qx_1",
      type: "line",
      source: "adminmap",
      "source-layer": "ZBDQ_BOUA3_QXJXZQH",
      filter: ["!=", "CITY", "重庆市"],
      minzoom: 10,
      maxzoom: 16,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgb(80,80,80)",
        "line-width": 0.5,
        // "line-dasharray": [2,2]
      },
    },
    {
      //5.区划界线:市级境界线1
      id: "zbdq_boul_xzjjx/ds_1",
      type: "line",
      source: "adminmap",
      "source-layer": "ZBDQ_BOUL2_XZJJX_DSJ",
      minzoom: 6.5,
      maxzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(60,60,60,1)",
        "line-width": 1.2,
        // "line-dasharray": [2,2]
      },
    },
    {
      //63.行政地名：区县级市行政中心1
      id: "zbdq_agnp3_qxjxzzx/1",
      type: "symbol",
      source: "adminmap",
      "source-layer": "ZBDQ_AGNP3_QXJXZZX",
      filter: ["!=", "CITY", "重庆市"],
      minzoom: 9.5,
      // "maxzoom": 12,
      layout: {
        visibility: "visible",
        "text-size": 12,
        // "text-padding": 10,
        "text-rotation-alignment": "viewport",
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Regular"],
        "text-anchor": "center",
        "text-max-width": 8,
        "text-field": "{NAME}",
      },
      paint: {
        "text-color": "rgb(170,170,170)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //65.行政地名：地级市1
      id: "zbdq_agnp2_djsxzzx/1",
      type: "symbol",
      source: "adminmap",
      "source-layer": "ZBDQ_AGNP2_DJSXZZX",
      filter: ["!=", "CITY", "重庆市"],
      minzoom: 6,
      // "maxzoom": 10,
      layout: {
        "text-field": "{SNAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 13,
        "text-anchor": "center",
        "text-max-width": 8,
        "text-rotation-alignment": "viewport",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(200,200,200)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //68.行政地名：省级行政中心1
      id: "zbdq_agnp1_shengjxzzx/1",
      type: "symbol",
      source: "adminmap",
      "source-layer": "ZBDQ_AGNP1_SJXZZX",
      minzoom: 3,
      // "maxzoom": 5,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 13,
        "text-anchor": "center",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(220,220,220)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    //周边地区===========================

    //    //本区域 当前区域***************************
    //     {
    //         //2.区划界线:省级境界线1
    //         "id": "boul_xzjjx/sj_1",
    //         "type": "line",
    //         "source": "adminmap",
    //         "source-layer": "BOUA1_SJXZQH",
    //         "minzoom": 6.5,
    //         "maxzoom": 8.5,
    //         "layout": {
    //             "line-cap": "round",
    //             "line-join": "round"
    //         },
    //         "paint": {
    //             "line-color": "#032739",
    //             "line-width": 2
    //         }
    //     },
    //     {
    //         //3.区划界线:省级境界线2
    //         "id": "boul_xzjjx/sj_2",
    //         "type": "line",
    //         "source": "adminmap",
    //         "source-layer": "BOUA1_SJXZQH",
    //         "minzoom": 2,
    //         "maxzoom": 6.5,
    //         "layout": {
    //             "line-cap": "round",
    //             "line-join": "round"
    //         },
    //         "paint": {
    //             "line-color": "#032739",
    //             "line-width": 1
    //         }
    //     },
    //     {
    //         //4.区划界线:区县级境界线
    //         "id": "boul_xzjjx/qx_1",
    //         "type": "line",
    //         "source": "adminmap",
    //         "source-layer": "BOUA3_QXJXZQH",
    //         // "filter": ["all",["in","GBCODE","650201"]],
    //         "minzoom": 8,
    //         "maxzoom": 15,
    //         "layout": {
    //             "line-cap": "round",
    //             "line-join": "round"
    //         },
    //         "paint": {
    //             "line-color": "#032739",
    //             "line-width": 1,
    //             "line-dasharray": [2,2]
    //         }
    //     },
    //     {
    //         //5.区划界线:市级境界线1
    //         "id": "boul_xzjjx/ds_1",
    //         "type": "line",
    //         "source": "adminmap",
    //         "source-layer": "BOUA2_DJSXZQH",
    //         "minzoom": 6.5,
    //         "maxzoom": 8.5,
    //         "layout": {
    //             "line-cap": "round",
    //             "line-join": "round"
    //         },
    //         "paint": {
    //             "line-color": "rgba(25,45,90,1)",
    //             "line-width": 1,
    //             "line-dasharray": [2,2]
    //         }
    //     },
    //     {
    //         //6.区划界线:市级境界线2
    //         "id": "boul_xzjjx/ds_2",
    //         "type": "line",
    //         "source": "adminmap",
    //         "source-layer": "BOUA2_DJSXZQH",
    //         "minzoom": 8.5,
    //         "maxzoom": 15,
    //         "layout": {
    //             "line-cap": "round",
    //             "line-join": "round"
    //         },
    //         "paint": {
    //             "line-color": "#032739",
    //             "line-width": 1.5
    //         }
    //     },
    //     // {
    //     //     //7.区划界线:海岸线
    //     //     "id": "boul4_hax/0",
    //     //     "type": "line",
    //     //     "maxzoom":10,
    //     //     "source": "adminmap",
    //     //     "source-layer": "BOUL_HAX_L2",
    //     //     "layout": {
    //     //         "line-cap": "round",
    //     //         "line-join": "round"
    //     //     },
    //     //     "paint": {
    //     //         "line-color": "rgba(15,35,105,0.4)",
    //     //         "line-width": 0.5
    //     //     }
    //     // },

    //     {
    //         //16.区划界线:当前行政区划界线
    //         "id": "boua2_djszqh/cur_l_blur",
    //         "type": "line",
    //         "source": "adminmap",
    //         "source-layer": "BOUA_DQXZQ",
    //         "minzoom": 7,
    //         "maxzoom": 16,
    //         "layout": {
    //             "line-cap": "round",
    //             "line-join": "round"
    //         },
    //         "paint": {
    //             "line-color": "rgba(171,179,46,0.6)",
    //             "line-width": 7,
    //             "line-blur": 4
    //         }
    //     },

    // {
    //     //10.基础背景：兴趣区域(功能区)
    //     "id": "P_LANDUSE_AOI",
    //     "type": "fill",
    //     "source": "basemap",
    //     "source-layer": "P_LANDUSE_AOI",
    //     "minzoom": 11,
    //     "layout": {},
    //     "paint": {
    //         "fill-color": [
    //                 'match',
    //                 ['get', 'CLASS'],
    //                 '商业', '#866995',
    //                 '工业区', '#7a664a',
    //                 '工矿', '#7a664a',
    //                 '森林植被', '#336c1f',
    //                 '运动、娱乐', '#54cb8a',
    //                 '#67611d'
    //                 ],
    //         "fill-opacity":0.3
    //     }
    // },

    // //基础水系**********************
    // {
    //     //11.水系：河流1
    //     "id": "hyd_heliu/1",
    //     "type": "fill",
    //     "source": "basemap",
    //     "source-layer": "HYDA_HELIU",
    //     "minzoom": 5,
    //     "maxzoom": 10,
    //     "filter": ["all",["in","DISPCLASS","8","7","6"]],
    //     "layout": {},
    //     "paint": {
    //         "fill-color": "#1a4669"
    //     }
    // },
    // {
    //     //11.水系：河流2
    //     "id": "hyd_heliu/2",
    //     "type": "fill",
    //     "source": "basemap",
    //     "source-layer": "HYDA_HELIU",
    //     "minzoom": 10,
    //     "maxzoom": 15.5,
    //     "filter": ["all",["in","DISPCLASS","8","7","6","5","4"]],
    //     "layout": {},
    //     "paint": {
    //         "fill-color": "#1a4669"
    //     }
    // },
    // {
    //     //12.水系：河流3
    //     "id": "hyd_heliu/3",
    //     "type": "fill",
    //     "source": "basemap",
    //     "source-layer": "HYDA_HELIU",
    //     "minzoom": 15.5,
    //     // "filter": ["all",["in","DISPCLASS","3","2","1"]],
    //     "layout": {},
    //     "paint": {
    //         "fill-color": "#1a4669"
    //     }
    // },
    // {
    //     //13.水系：湖泊水库1
    //     "id": "hyd_huposk/1",
    //     "type": "fill",
    //     "source": "basemap",
    //     "source-layer": "HYDA_HUPOSHUIKU",
    //     "minzoom": 5,
    //     "maxzoom": 12,
    //     "filter": ["all",["in","DISPCLASS","8","7","6","5"]],
    //     "layout": {},
    //     "paint": {
    //         "fill-color": "#1a4669"
    //     }
    // },
    // {
    //     //13.水系：湖泊水库2
    //     "id": "hyd_huposk/2",
    //     "type": "fill",
    //     "source": "basemap",
    //     "source-layer": "HYDA_HUPOSHUIKU",
    //     "minzoom": 12,
    //     "maxzoom": 16,
    //     "filter": ["all",["in","DISPCLASS","8","7","6","5","4","3"]],
    //     "layout": {},
    //     "paint": {
    //         "fill-color": "#1a4669"
    //     }
    // },
    // {
    //     //14.水系：湖泊水库3
    //     "id": "hyd_huposk/3",
    //     "type": "fill",
    //     "source": "basemap",
    //     "source-layer": "HYDA_HUPOSHUIKU",
    //     "minzoom": 16,
    //     // "filter": ["all",["in","DISPCLASS","2","1"]],
    //     "layout": {},
    //     "paint": {
    //         "fill-color": "#1a4669"
    //     }
    // },
    // //基础水系=========================

    //  专题水系**************************************************************************
    {
      //11.水系：河流线1
      id: "hyd_river_l/1",
      type: "line",
      source: "adminmap",
      "source-layer": "HYDL_SHUIXI_L1",
      minzoom: 6,
      maxzoom: 13,
      // "filter": ["all",["in","DISPCLASS","8","7","6","5","4","3"]],
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#51a5fd",
        "line-width": [
          "match",
          ["get", "DISPCLASS"],
          "6",
          3,
          "5",
          2.6,
          "4",
          1.35,
          "3",
          0.7,
          "2",
          0.5,
          "1",
          0.5,
          0.5,
        ],
      },
    },
    {
      //11.水系：河流线2
      id: "hyd_river_l/2",
      type: "line",
      source: "basemap",
      "source-layer": "HYDL_SHUIXI",
      minzoom: 13,
      maxzoom: 16,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#51a5fd",
        "line-width": [
          "match",
          ["get", "DISPCLASS"],
          "5",
          2.5,
          "4",
          2,
          "3",
          1.6,
          "2",
          1.3,
          "1",
          1,
          1,
        ],
      },
    },
    {
      //11.水系：河流1
      id: "hyd_river/1",
      type: "fill",
      source: "basemap",
      "source-layer": "HYDA_HELIU678",
      minzoom: 9,
      maxzoom: 14.5,
      filter: ["all", ["in", "DISPCLASS", "8", "7", "6", "5", "4"]],
      layout: {},
      paint: {
        "fill-color": "#51a5fd",
        "fill-opacity": 1,
      },
    },
    {
      //11.水系：河流2
      id: "hyd_river/2",
      type: "fill",
      source: "basemap",
      "source-layer": "HYDA_HELIU",
      minzoom: 14.5,
      maxzoom: 16,
      // "filter": ["all",["in","DISPCLASS","8","7","6","5","4","3"]],
      layout: {},
      paint: {
        "fill-color": "#51a5fd",
        "fill-opacity": 1,
      },
    },
    {
      //11.水系：湖库1
      id: "hyd_lake/1",
      type: "fill",
      source: "basemap",
      "source-layer": "HYDA_HUPOSHUIKU678",
      minzoom: 9,
      maxzoom: 12.5,
      filter: ["all", ["in", "DISPCLASS", "8", "7", "6", "5"]],
      layout: {},
      paint: {
        "fill-color": "#51a5fd",
        "fill-opacity": 1,
      },
    },
    {
      //11.水系：湖库2
      id: "hyd_lake/2",
      type: "fill",
      source: "basemap",
      "source-layer": "HYDA_HUPOSHUIKU",
      minzoom: 12.5,
      maxzoom: 16,
      filter: ["all", ["in", "DISPCLASS", "8", "7", "6", "5", "4", "3"]],
      layout: {},
      paint: {
        "fill-color": "#51a5fd",
        "fill-opacity": 1,
      },
    },
    {
      //11.水系：干流
      id: "hyd_chq/1",
      type: "fill",
      source: "basemap",
      "source-layer": "HYDA_CHQ",
      // "filter": ["all",["in","DISPCLASS","1","2","5","4","3"]],
      minzoom: 14.5,
      maxzoom: 16,
      layout: {},
      paint: {
        "fill-color": "#44c5fc",
        "fill-opacity": 1,
      },
    },
    {
      //11.水系：干流2
      id: "hyda_chqu/2",
      type: "fill",
      source: "basemap",
      "source-layer": "HYDA_CHQ",
      minzoom: 16,
      // "maxzoom": 14.5,
      layout: {},
      paint: {
        "fill-color": "#44c5fc",
        "fill-opacity": 1,
      },
    },
    {
      //11.水系：线1
      id: "hydl_chq/2",
      type: "line",
      source: "basemap",
      "source-layer": "HYDL_CHQ",
      minzoom: 17,
      // "maxzoom": 14.5,
      layout: {},
      paint: {
        "line-color": "#44c5fc",
        "line-width": 1,
      },
    },
    //地名******************************************

    {
      //16.区划界线:当前行政区划界线
      id: "boua2_djszqh/cur_l2",
      type: "line",
      source: "adminmap",
      "source-layer": "BOUA_DQXZQ",
      minzoom: 7,
      maxzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#75c9e7",
        "line-width": 0.7,
      },
    },

    // {
    //     //17.建筑：平面建筑
    //     "id": "building/2d",
    //     "type": "fill",
    //     "source": "basemap",
    //     "source-layer": "BUILDING",
    //     "minzoom": 14,
    //     "layout": {},
    //     "paint": {
    //         "fill-color": "rgba(10,35,65,0.7)",
    //         "fill-outline-color": "rgb(10,35,65)"
    //     }
    // },
    {
      //18.道路：其他道路（线）
      id: "	ROAD8_qtdl/1",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD8_QTDL",
      minzoom: 13,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 1.5,
      },
    },
    {
      //19.道路：市区杂路（线）
      id: "ROAD7_sqzl/1",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD7_SQZL",
      minzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 2,
      },
    },
    {
      //20.道路：市区道路（线1）
      id: "ROAD6_sqdl/1",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD6_SQDL",
      minzoom: 12,
      maxzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 1.5,
      },
    },
    {
      //21.道路：市区道路（线2）
      id: "ROAD6_sqdl/2",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD6_SQDL",
      minzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 3,
      },
    },

    {
      //23.道路：县道（线1）
      id: "ROAD5_xd/1",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD5_XD",
      minzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgb(20,20,20)",
        "line-width": 3.5,
      },
    },
    {
      //24.道路：县道（线11）
      id: "ROAD5_xd/11",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD5_XD",
      minzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 1.5,
      },
    },
    {
      //25.道路：省道（线21）
      id: "ROAD4_sd/21",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD4_SD",
      minzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgb(20,20,20)",
        "line-width": 3.5,
      },
    },
    {
      //26.道路：省道（线22）
      id: "ROAD4_sd/22",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD4_SD",
      minzoom: 13,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 2,
      },
    },
    {
      //27.道路：国道（线11）
      id: "ROAD3_gd/11",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD3_GD",
      minzoom: 11,
      maxzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 1.8,
      },
    },
    {
      //28.道路：国道（线21）
      id: "ROAD3_gd/21",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD3_GD",
      minzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgb(20,20,20)",
        "line-width": 5.5,
      },
    },
    {
      //29.道路：国道（线22）
      id: "ROAD3_gd/22",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD3_GD",
      minzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#867634",
        "line-width": 4.5,
      },
    },
    {
      //30.道路：高速公路（线11）
      id: "ROAD1_gsgl/11",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD1_GSGL",
      minzoom: 11,
      maxzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 2,
      },
    },
    {
      //31.道路：高速公路（线21）
      id: "ROAD1_gsgl/21",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD1_GSGL",
      minzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgb(20,20,20)",
        "line-width": 6,
      },
    },
    {
      //32.道路：高速公路（线22）
      id: "ROAD1_gsgl/22",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD1_GSGL",
      minzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#957736",
        "line-width": 5,
      },
    },
    {
      //22.道路：地铁及轻轨（线）
      id: "r_dtqg/1",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD_DITIE",
      minzoom: 12,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#fffd80",
        "line-width": 6,
        "line-blur": 4,
      },
    },
    {
      //22.道路：地铁及轻轨（线）
      id: "r_dtqg/12",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD_DITIE",
      minzoom: 12,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": [
          "match",
          ["get", "NAME"],
          "重庆轨道交通8号线",
          "#ADC3C0",
          "重庆轨道交通7号线",
          "#F4B67F",
          "重庆轨道交通6号线",
          "#55AF77",
          "重庆轨道交通4号线",
          "#AED56A",
          "重庆轨道交通3号线",
          "#E2C784",
          "重庆轨道交通2号线",
          "#F0A4C6",
          "重庆轨道交通1号线",
          "#78A8D5",
          "重庆轨道交通环线",
          "#E06FBB",
          "#4ef2e5",
        ],
        "line-width": 2.5,
      },
    },
    {
      //33.道路：铁路（线1）
      id: "r_tl/1",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD_TIELU",
      minzoom: 14,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "rgb(20,20,20)",
        "line-width": 4,
      },
    },
    {
      //34.道路：铁路（线2）
      id: "r_tl/2",
      type: "line",
      source: "basemap",
      "source-layer": "ROAD_TIELU",
      minzoom: 14,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#545454",
        "line-width": 2,
        "line-dasharray": [5, 8],
      },
    },
    {
      //35.道路：其他杂路（标注 rdname 1）
      id: "ROAD8_qtdl/label/rdname 1",
      type: "symbol",
      source: "basemap",
      "source-layer": "ROAD8_QTDL",
      minzoom: 15,
      layout: {
        "symbol-placement": "line",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 11,
        "text-padding": 10,
        "text-field": "{RDNAME}",
        "text-pitch-alignment": "viewport",
        // "text-letter-spacing":25,
      },
      paint: {
        "text-color": "#d3b669",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //36.道路：市区杂路（标注 rdname 1）
      id: "ROAD7_sqzl/label/rdname 1",
      type: "symbol",
      source: "basemap",
      "source-layer": "ROAD7_SQZL",
      minzoom: 14.5,
      layout: {
        "symbol-placement": "line",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 11,
        "text-padding": 10,
        "text-field": "{RDNAME}",
        "text-pitch-alignment": "viewport",
        // "text-letter-spacing":25,
        "text-optional": true,
      },
      paint: {
        "text-color": "#d3b669",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //37.道路：市区道路（标注 rdname 1）
      id: "ROAD6_sqdl/label/rdname 1",
      type: "symbol",
      source: "basemap",
      "source-layer": "ROAD6_SQDL",
      minzoom: 14,
      layout: {
        "symbol-placement": "line",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 11,
        "text-padding": 10,
        "text-field": "{RDNAME}",
        "text-pitch-alignment": "viewport",
        // "text-letter-spacing":25,
      },
      paint: {
        "text-color": "#d3b669",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //38.道路：县道（标注 rdname 1）
      id: "ROAD5_xd/label/rdname 1",
      type: "symbol",
      source: "basemap",
      "source-layer": "ROAD5_XD",
      minzoom: 13.5,
      layout: {
        "symbol-placement": "line",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 11,
        "text-padding": 10,
        "text-field": "{RDNAME}",
        "text-pitch-alignment": "viewport",
        // "text-letter-spacing":25,
      },
      paint: {
        "text-color": "#d3b669",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //39.道路：省道（标注 rdcode 1）
      id: "ROAD4_sd/label/Class rdcode",
      type: "symbol",
      source: "basemap",
      "source-layer": "ROAD4_SD",
      minzoom: 13,
      filter: ["all", [">=", "CODELEN", 2], ["<=", "CODELEN", 4]],
      layout: {
        "symbol-placement": "point",
        // "symbol-spacing": 20,
        "icon-image": "cn-provincial-expy-4",
        "icon-anchor": "center",
        "icon-padding": 80,
        "icon-size": 0.65,
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 9.3,
        // "text-padding": 20,
        "text-anchor": "center",
        "text-field": "{RDCODE}",
      },
      paint: {
        "text-color": "rgb(220,220,220)",
      },
    },
    {
      //40.道路：省道（标注 rdname 1）
      id: "ROAD4_sd/label/rdname 1",
      type: "symbol",
      source: "basemap",
      "source-layer": "ROAD4_SD",
      minzoom: 12.5,
      layout: {
        "symbol-placement": "line",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 11,
        "text-padding": 10,
        "text-field": "{RDNAME}",
        "text-pitch-alignment": "viewport",
        // "text-letter-spacing":25,
      },
      paint: {
        "text-color": "#d3b669",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //41.道路：国道（标注 rdname 1）
      id: "ROAD3_gd/label/rdname 1",
      type: "symbol",
      source: "basemap",
      "source-layer": "ROAD3_GD",
      minzoom: 11.5,
      layout: {
        "symbol-placement": "line",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12.5,
        "text-padding": 10,
        "text-field": "{RDNAME}",
        "text-pitch-alignment": "viewport",
        // "text-letter-spacing":25,
      },
      paint: {
        "text-color": "#d3b669",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //42.道路：国道（标注 rdcode 1）
      id: "ROAD3_gd/label/rdcode",
      type: "symbol",
      source: "basemap",
      "source-layer": "ROAD3_GD",
      minzoom: 12.5,
      filter: ["all", [">=", "CODELEN", 2], ["<=", "CODELEN", 5]],
      layout: {
        "symbol-placement": "point",
        "icon-image": "cn-provincial-expy-4",
        "icon-anchor": "center",
        "icon-padding": 80,
        "icon-size": 0.8,
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 9.8,
        // "text-padding": 20,
        "text-anchor": "center",
        "text-field": "{RDCODE}",
      },
      paint: {
        "text-color": "rgb(220,220,220)",
      },
    },
    {
      //43.道路：高速公路（标注 rdname 1）
      id: "ROAD1_gsgl/label/rdname 1",
      type: "symbol",
      source: "basemap",
      "source-layer": "ROAD1_GSGL",
      minzoom: 11.5,
      layout: {
        "symbol-placement": "line",
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 13,
        "text-padding": 10,
        "text-field": "{RDNAME}",
        // "text-letter-spacing": 10,
      },
      paint: {
        "text-color": "rgb(198,198,198)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //22.道路：地铁及轻轨（线）
      id: "r_dtqg/label/12",
      type: "symbol",
      source: "basemap",
      "source-layer": "ROAD_DITIE",
      minzoom: 13,
      layout: {
        "symbol-placement": "line",
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 13,
        "text-padding": 10,
        "text-field": "{NAME}",
        // "text-letter-spacing": 10,
      },
      paint: {
        "text-color": "rgb(198,198,198)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //44.道路：高速公路（标注 rdcode 1）
      id: "ROAD1_gsgl/label/rdcode 1",
      type: "symbol",
      source: "basemap",
      "source-layer": "ROAD1_GSGL",
      minzoom: 12,
      filter: ["all", [">=", "CODELEN", 2], ["<=", "CODELEN", 5]],
      layout: {
        "symbol-placement": "point",
        // "symbol-spacing": 20,
        "icon-image": "cn-nths-expy-4",
        "icon-anchor": "center",
        "icon-padding": 80,
        "icon-size": 0.8,
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 9.8,
        "text-padding": 20,
        "text-anchor": "center",
        "text-field": "{RDCODE}",
      },
      paint: {
        "text-color": "rgb(220,220,220)",
      },
    },

    {
      //45.建筑：三维建筑（拉伸白模）
      id: "buildings_3d",
      minzoom: 12.5,
      source: "basemap",
      "source-layer": "BUILDING",
      type: "fill-extrusion",
      paint: {
        "fill-extrusion-color": [
          "interpolate",
          ["linear"], //["exponential", 1.8],//
          ["to-number", ["get", "Height"]],
          0,
          "#81a3db",
          110,
          "#3b537b",
        ],
        "fill-extrusion-height": ["to-number", ["get", "Height"]],
        // "fill-extrusion-base":600,
        "fill-extrusion-opacity": 0.7,
      },
    },
    {
      //46.兴趣点：机场
      id: "POI02_jcgkmt_jichang",
      type: "symbol",
      source: "basemap",
      "source-layer": "POI02_JT_JC_GK_MT",
      minzoom: 11,
      filter: ["all", ["in", "KIND", "8100"]],
      layout: {
        "icon-image": "airport-15",
        "icon-anchor": "top",
        "icon-size": 1,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-anchor": "bottom",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(230,230,230)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },

    {
      //47.兴趣点：港口码头
      id: "POI02_jcgkmt_gangkoumatou",
      type: "symbol",
      source: "basemap",
      "source-layer": "POI02_JT_JC_GK_MT",
      minzoom: 14,
      filter: ["all", ["in", "KIND", "8180"]],
      layout: {
        "icon-image": "harbor-11",
        "icon-anchor": "top",
        "icon-size": 1,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12.5,
        "text-anchor": "bottom",
        "text-max-width": 10,
        "text-pitch-alignment": "viewport",
        "icon-allow-overlap": true,
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //48.兴趣点：汽车站
      id: "POI04_qcz_qichezhan",
      type: "symbol",
      source: "basemap",
      "source-layer": "POI04_JT_QCZ",
      minzoom: 14,
      filter: ["all", ["in", "KIND", "8083"]],
      layout: {
        "icon-image": "bus",
        "icon-anchor": "top",
        "icon-size": 0.8,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-anchor": "bottom",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
        "icon-allow-overlap": true,
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //49.兴趣点：火车站
      id: "basemap",
      type: "symbol",
      source: "basemap",
      "source-layer": "POI03_JT_HCZ_DTZ",
      minzoom: 12,
      filter: ["all", ["in", "KIND", "8081", "8088"]],
      layout: {
        "icon-image": "rail",
        "icon-anchor": "top",
        "icon-size": 1,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 13,
        "text-anchor": "bottom",
        "text-max-width": 10,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //50.兴趣点：医院
      id: "POI15_ylfw/yiyuan",
      type: "symbol",
      source: "basemap",
      "source-layer": "POI15_GG_YLFW",
      filter: ["all", ["in", "KIND", "7200"], ["<=", "NALEN", 12]],
      minzoom: 16,
      layout: {
        "icon-image": "hospital-11",
        "icon-anchor": "top",
        "icon-size": 1,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "bottom",
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //51.兴趣点：学校
      id: "POI16_kyjy/xuexiao",
      type: "symbol",
      source: "basemap",
      "source-layer": "POI16_GG_KYJY",
      filter: [
        "all",
        ["in", "KIND", "A700", "A701", "A702", "A703"],
        ["<=", "NALEN", 12],
      ],
      minzoom: 16.5,
      layout: {
        "icon-image": "college-15",
        "icon-anchor": "top",
        "icon-size": 1,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "bottom",
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //52.兴趣点：住宅小区
      id: "POI19_zzxq",
      type: "symbol",
      source: "basemap",
      "source-layer": "POI19_GG_ZZXQ",
      minzoom: 16,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "top",
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //52.兴趣点：公司企业
      id: "POI17_SY_GSQY",
      type: "symbol",
      source: "basemap",
      "source-layer": "POI17_SY_GSQY",
      minzoom: 16.2,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "top",
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //53.兴趣点：商业大厦
      id: "POI11_syds",
      type: "symbol",
      source: "basemap",
      "source-layer": "POI11_SY_SYDS",
      minzoom: 15.5,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "top",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //53.兴趣点：公园广场
      id: "POI18_GG_GYGC",
      type: "symbol",
      source: "basemap",
      "source-layer": "POI18_GG_GYGC",
      minzoom: 14,
      layout: {
        "icon-image": "park-15",
        "icon-anchor": "top",
        "icon-size": 1,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "bottom",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //54.兴趣点：地铁站
      id: "POI03_hczdtz_ditiezhan",
      type: "symbol",
      source: "basemap",
      "source-layer": "POI03_JT_HCZ_DTZ",
      minzoom: 14,
      filter: ["all", ["in", "KIND", "8085"]],
      layout: {
        "icon-image": "rail-metro",
        "icon-anchor": "center",
        "icon-size": 1,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12.5,
        "text-offset": [1, 0],
        "text-anchor": "left",
        "text-max-width": 10,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //55.兴趣点：山
      id: "p_shan_1",
      type: "symbol",
      source: "basemap",
      "source-layer": "POI_SHANMAI",
      minzoom: 15,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "top",
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //56.兴趣点：海域地名1
      id: "aanp_hydm_1",
      type: "symbol",
      source: "adminmap",
      "source-layer": "AANP_HYDM",
      minzoom: 13,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "top",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //57.兴趣点：海域地名8
      id: "aanp_hydm_8",
      type: "symbol",
      source: "adminmap",
      "source-layer": "AANP_HYDM",
      maxzoom: 13,
      filter: ["==", "DISPCLASS", "8"],
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 11,
        "text-padding": 10,
        "text-anchor": "top",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //58.行政地名：村庄
      id: "p_cunzhuang",
      type: "symbol",
      source: "adminmap",
      "source-layer": "AGNP_P_CUNZHUANG",
      minzoom: 13.5,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "center",
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(240,240,240)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1.2,
      },
    },
    // {
    //     //59.基础背景：兴趣区域(功能区)标注
    //     "id": "P_LANDUSE_AOI/label",
    //     "type": "symbol",
    //     "source": "basemap",
    //     "source-layer": "P_LANDUSE_AOI",
    //     "minzoom": 13,
    //     "layout": {
    //         "text-field": "{name}",
    //         "text-font": ["Microsoft YaHei Regular"],
    //         "text-size": 12,
    //         "text-padding": 10,
    //         "text-anchor": "center",
    //         "text-max-width": 8,
    //         "text-pitch-alignment": "viewport",
    //     },
    //     "paint": {
    //         "text-color": "#dfc85e",
    //         "text-halo-color": "rgb(25,25,25)",
    //         "text-halo-width": 1.2
    //     }
    // },
    // 本区域 当前行政区*********************************
    {
      //16.区划界线:乡镇境界线
      id: "boul4_xzjjx/qx_cur2",
      type: "line",
      source: "adminmap",
      "source-layer": "BOUA4_XZJDXZQH",
      minzoom: 11,
      maxzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(220,220,220,0.5)",
        "line-width": 1.7,
        // "line-dasharray": [2,2],
        "line-blur": 0.4,
      },
    },

    {
      //16.区划界线:区县级行政区划线
      id: "boul_xzjjx/qx_cur2",
      type: "line",
      source: "adminmap",
      "source-layer": "BOUL3_XZJJX_QXJ",
      minzoom: 6,
      maxzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(180,180,180,0.5)",
        "line-width": 2,
        // "line-dasharray": [2,2],
        "line-blur": 1,
      },
    },
    {
      //16.区划界线:区县级行政区划线
      id: "boul_xzjjx/qx_cur3",
      type: "line",
      source: "adminmap",
      "source-layer": "BOUL3_XZJJX_QXJ",
      minzoom: 7,
      maxzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(220,220,220,0.7)",
        "line-width": 1,
        // "line-dasharray": [2,2],
        // "line-blur": 4
      },
    },
    {
      //16.区划界线:当前行政区划界线
      id: "boua2_djszqh/cur_l_blur2",
      type: "line",
      source: "adminmap",
      "source-layer": "BOUA_DQXZQ",
      // "minzoom": 5,
      maxzoom: 16,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(234,234,234,0.7)",
        "line-width": 3,
        "line-blur": 1.3,
      },
    },
    {
      //16.区划界线:当前行政区划界线
      id: "boua2_djszqh/cur_l_blur3",
      type: "line",
      source: "adminmap",
      "source-layer": "BOUA_DQXZQ",
      // "minzoom": 5,
      maxzoom: 16,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(254,254,254,1)",
        "line-width": 1,
        // "line-blur": 1
      },
    },
    {
      //62.行政地名：乡镇街道
      id: "AGNP4_XZJDXZZX/1",
      type: "symbol",
      source: "adminmap",
      "source-layer": "AGNP4_XZJDXZZX",
      minzoom: 10,
      maxzoom: 13.5,
      layout: {
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 13,
        "text-padding": 8,
        "text-max-width": 8,
        "text-field": "{NAME}",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(215,215,215)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //62.行政地名：乡镇街道
      id: "AGNP4_XZJDXZZX/2",
      type: "symbol",
      source: "adminmap",
      "source-layer": "AGNP4_XZJDXZZX",
      minzoom: 13.5,
      layout: {
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 14,
        "text-padding": 10,
        "text-max-width": 8,
        "text-field": "{NAME}",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(215,215,215)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //63.行政地名：区县级行政中心1
      id: "agnp3_qxjxzzx/1",
      type: "symbol",
      source: "adminmap",
      "source-layer": "AGNP3_QXJXZZX",
      minzoom: 6,
      maxzoom: 10,
      layout: {
        visibility: "visible",
        "text-size": 12.5,
        // "text-padding": 10,
        "text-rotation-alignment": "viewport",
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Bold"],
        "text-anchor": "center",
        "text-max-width": 8,
        "text-field": "{SNAME}",
      },
      paint: {
        "text-color": "rgb(248,248,248)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },

    {
      //64.行政地名：区级行政中心
      id: "agnp3_qxjxzzx/2",
      type: "symbol",
      source: "adminmap",
      "source-layer": "AGNP3_QXJXZZX",
      minzoom: 10,
      layout: {
        "icon-image": "circle-white-2",
        "icon-anchor": "top",
        "icon-size": 0.3,
        // "icon-allow-overlap": true,
        visibility: "visible",
        "text-size": 12,
        // "text-padding": 30,
        // "text-offset": [0,-1],
        "text-rotation-alignment": "viewport",
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Bold"],
        "text-anchor": "bottom",
        "text-max-width": 8,
        "text-field": "{SNAME}",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(220,220,220)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //65.行政地名：地级市1
      id: "agnp2_djsxzzx/1",
      type: "symbol",
      source: "adminmap",
      "source-layer": "AGNP2_DJSXZZX",
      minzoom: 6,
      maxzoom: 10,
      layout: {
        "text-field": "{SNAME}",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 13,
        "text-anchor": "center",
        "text-max-width": 8,
        "text-rotation-alignment": "viewport",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(245,245,245)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //66.行政地名：地级市2
      id: "agnp2_djsxzzx/2",
      type: "symbol",
      source: "adminmap",
      "source-layer": "AGNP2_DJSXZZX",
      minzoom: 10,
      layout: {
        "icon-image": "circle-white-2",
        "icon-anchor": "top",
        "icon-size": 0.6,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 15,
        "text-anchor": "bottom",
        "text-max-width": 8,
        "text-rotation-alignment": "viewport",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(240,240,240)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //67.行政地名：省级行政中心2
      id: "agnp1_shengjxzzx/2",
      type: "symbol",
      source: "adminmap",
      "source-layer": "AGNP1_SJXZZX",
      minzoom: 5,
      maxzoom: 6,
      layout: {
        "text-field": "{CITY}",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 12,
        "text-anchor": "center",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(220,220,220)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //68.行政地名：省级行政中心1
      id: "agnp1_shengjxzzx/1",
      type: "symbol",
      source: "adminmap",
      "source-layer": "AGNP1_SJXZZX",
      minzoom: 3,
      maxzoom: 5,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 12,
        "text-anchor": "center",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(220,220,220)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //69.行政地名：北京市
      id: "agnp1_shengjxzzx/beijing",
      type: "symbol",
      source: "adminmap",
      "source-layer": "AGNP1_SJXZZX",
      filter: ["==", "NAME", "北京市"],
      minzoom: 1,
      maxzoom: 6,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 12,
        "text-anchor": "center",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(220,220,220)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },

    //水系专题标注
    {
      //61.专题标注：河流标注1
      id: "HYDL/label1",
      type: "symbol",
      source: "adminmap",
      "source-layer": "HYDL_SHUIXI_L1",
      minzoom: 9,
      maxzoom: 16,
      filter: ["all", ["in", "DISPCLASS", "8", "7", "6", "5", "4"]],
      layout: {
        "symbol-placement": "line",
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 13,
        "text-padding": 20,
        "text-anchor": "center",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "#73DFFF",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },

    {
      //61.专题标注：河流标注2
      id: "HYDL/label2",
      type: "symbol",
      source: "basemap",
      "source-layer": "HYDL_SHUIXI",
      minzoom: 16,
      // "filter": ["all",["in","DISPCLASS","8","7","6","5","4","3"]],
      layout: {
        "symbol-placement": "line",
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 15,
        "text-padding": 20,
        "text-anchor": "center",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "#73DFFF",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //61.专题标注：湖泊水库标注1
      id: "hyd_huposk/label1",
      type: "symbol",
      source: "basemap",
      "source-layer": "HYDA_HUPOSHUIKU678",
      minzoom: 12,
      maxzoom: 16,
      filter: ["all", ["in", "DISPCLASS", "8", "7", "6", "5", "4"]],
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 14,
        "text-padding": 20,
        "text-anchor": "center",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "#73DFFF",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //61.专题标注：湖泊水库标注2
      id: "hyd_huposk/label2",
      type: "symbol",
      source: "basemap",
      "source-layer": "HYDA_HUPOSHUIKU",
      minzoom: 15,
      maxzoom: 16,
      filter: ["all", ["in", "DISPCLASS", "2", "3"]],
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 14,
        "text-padding": 20,
        "text-anchor": "center",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "#73DFFF",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //61.专题标注：湖泊水库标注3
      id: "hyd_huposk/label3",
      type: "symbol",
      source: "basemap",
      "source-layer": "HYDA_HUPOSHUIKU",
      minzoom: 16,
      // "maxzoom": 16,
      // "filter": ["all",["in","DISPCLASS","4","3"]],
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 14,
        "text-padding": 20,
        "text-anchor": "center",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "#73DFFF",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
  ],
};
let yjscjdLayer = {
  version: 8,
  light: {
    anchor: "viewport",
    color: "rgb(255,255,255)",
    intensity: 1,
  },
  sprite: "mapbox://styles/mapbox/streets-v11",
  // "glyphs": "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  // "sprite":"http://202.104.140.38:9988/mapresource/sprite/sprite",
  glyphs:
    "http://202.104.140.38:9988/mapresource/fonts/{fontstack}/{range}.pbf",
  sources: {
    "mapbox-dem": {
      type: "raster-dem",
      url: "mapbox://mapbox.mapbox-terrain-dem-v1",
      tileSize: 512,
      minzoom: 6,
      maxzoom: 16,
    },
    basemap_ls_jinyun: {
      type: "vector",
      scheme: "tms",
      tiles: [
        "http://202.104.140.38:9988/geoserver/gwc/service/tms/1.0.0/ls_jinyun:basemap_ls_jinyun@EPSG:900913@pbf/{z}/{x}/{y}.pbf",
      ],
    },
    adminmap_ls_jinyun: {
      type: "vector",
      scheme: "tms",
      tiles: [
        "http://202.104.140.38:9988/geoserver/gwc/service/tms/1.0.0/ls_jinyun:adminmap_ls_jinyun@EPSG:900913@pbf/{z}/{x}/{y}.pbf",
      ],
    },
    arcgis_img: {
      type: "raster",
      tiles: [
        "http://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/WMTS/tile/1.0.0/World_Imagery/default/default028mm/{z}/{y}/{x}.png",
      ],
      // "tiles":["http://202.104.140.38:81/arcgis/rest/services/HangZhou/HangZhou_CA_SYD/MapServer/WMTS/tile/1.0.0/World_Imagery/default/default028mm/{z}/{y}/{x}.png"],
      tileSize: 256,
      zoomOffset: -1,
      minzoom: 0,
      maxzoom: 17,
    },
  },
  layers: [
    {
      //01.背景
      id: "background",
      type: "background",
      layout: {},
      paint: {
        "background-color": "#053750",
      },
    },
    {
      //02.天空
      id: "sky",
      type: "sky",
      layout: {},
      paint: {
        "sky-type": "atmosphere", //gradient", "atmosphere". Defaults to "atmosphere"
        "sky-opacity": 0.8, //between 0 and 1 inclusive. Defaults to 1
        "sky-atmosphere-color": "#036fe9", //Defaults to "white"
        "sky-atmosphere-halo-color": "white", //Defaults to "white"
        "sky-atmosphere-sun": [45, 70], //between 00 and 360180 inclusive. Units in degrees
        // // "sky-gradient":,//Defaults to ["interpolate",["linear"],["sky-radial-progress"],0.8,"#87ceeb",1,"white"].
        // "sky-gradient-center":"[0,0]",  //between 00 and 360180. Units in degrees. Defaults to [0,0]
        // "sky-gradient-radius":90    // 0 and 180 inclusive. Defaults 90
      },
    },

    {
      //1.陆地背景
      id: "boua1_sjxzqh",
      type: "fill",
      source: "adminmap_ls_jinyun",
      "source-layer": "BOUA2_DJSXZQH",
      // "filter": ["!=","NAME","武汉市"],
      layout: {},
      paint: {
        "fill-color": "rgba(5,55,80,1)",
        // "fill-outline-color": "rgb(25,45,65)"
      },
    },

    // {
    //     //15.当前行政区划3D
    //     "id": "boua2_djsxzqh/cur_3d",
    //     "minzoom":6,
    //     "maxzoom":13,
    //     "type": "fill-extrusion",
    //     "source": "adminmap_ls_jinyun",
    //     // "source": "basemap_ls_jinyun",
    //     // "source-layer": "HB_WH_buff200",
    //     "source-layer": "AGN_DQXZQ",
    //     // "filter": ["all",["in","NAME","武汉市"]],
    //     "paint": {
    //         "fill-extrusion-color": "rgba(0,12,25,1)",
    //         "fill-extrusion-height": 1000,
    //         "fill-extrusion-opacity": 1
    //         // "fill-extrusion-vertical-gradient":false
    //     }
    // },

    {
      // 影像
      id: "raster_img",
      type: "raster",
      // "minzoom": 6,
      //  "maxzoom": 17,
      source: "arcgis_img",
      paint: {
        "raster-hue-rotate": 0,
        "raster-opacity": 1,
        "raster-contrast": 0.15, //对比度
        "raster-saturation": 0.15, //饱和度
        // "raster-brightness-min":0.1,//最小亮度
        // "raster-brightness-max":0.3//最小亮度
      },
    },
    // {
    //     // 山体效果图
    //     "id": "dem_hills",
    //     "type": "raster",
    //     "source": "DEM_HS_DB",
    //     "paint": {
    //         "raster-hue-rotate":0,
    //         "raster-opacity":0.65,
    //         "raster-contrast":0.1,//对比度
    //         "raster-saturation":0.1,//饱和度
    //         // "raster-brightness-min":0//最小亮度

    //     }
    // },
    {
      //9.周边行政区划（遮罩）
      id: "boua2_djsxzqh/zhoubian",
      type: "fill",
      minzoom: 0,
      maxzoom: 24,
      source: "adminmap_ls_jinyun",
      "source-layer": "ZBDQ_BACKGROUND",
      layout: {},
      paint: {
        "fill-color": "rgba(44,71,95,0.35)",
        // "fill-outline-color": "rgb(25,45,65)"
      },
    },

    {
      //2.区划界线:省级境界线1
      id: "boul_xzjjx/sj_1",
      type: "line",
      source: "adminmap_ls_jinyun",
      "source-layer": "BOUA1_SJXZQH",
      minzoom: 6.5,
      maxzoom: 8.5,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#032739",
        "line-width": 2,
      },
    },
    {
      //3.区划界线:省级境界线2
      id: "boul_xzjjx/sj_2",
      type: "line",
      source: "adminmap_ls_jinyun",
      "source-layer": "BOUA1_SJXZQH",
      minzoom: 2,
      maxzoom: 6.5,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#032739",
        "line-width": 1,
      },
    },
    {
      //4.区划界线:区县级境界线
      id: "boul_xzjjx/qx_1",
      type: "line",
      source: "adminmap_ls_jinyun",
      "source-layer": "BOUA3_QXJXZQH",
      // "filter": ["all",["in","GBCODE","650201"]],
      minzoom: 8.5,
      maxzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#032739",
        "line-width": 1,
        "line-dasharray": [2, 2],
      },
    },
    {
      //5.区划界线:市级境界线1
      id: "boul_xzjjx/ds_1",
      type: "line",
      source: "adminmap_ls_jinyun",
      "source-layer": "BOUA2_DJSXZQH",
      minzoom: 6.5,
      maxzoom: 8.5,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(25,45,90,1)",
        "line-width": 1,
        "line-dasharray": [2, 2],
      },
    },
    {
      //6.区划界线:市级境界线2
      id: "boul_xzjjx/ds_2",
      type: "line",
      source: "adminmap_ls_jinyun",
      "source-layer": "BOUA2_DJSXZQH",
      minzoom: 8.5,
      maxzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#032739",
        "line-width": 1.5,
      },
    },
    // {
    //     //7.区划界线:海岸线
    //     "id": "boul4_hax/0",
    //     "type": "line",
    //     "maxzoom":10,
    //     "source": "adminmap_ls_jinyun",
    //     "source-layer": "BOUL_HAX_L2",
    //     "layout": {
    //         "line-cap": "round",
    //         "line-join": "round"
    //     },
    //     "paint": {
    //         "line-color": "rgba(15,35,105,0.4)",
    //         "line-width": 0.5
    //     }
    // },

    {
      //16.区划界线:当前行政区划界线
      id: "boua2_djszqh/cur_l_blur",
      type: "line",
      source: "adminmap_ls_jinyun",
      "source-layer": "AGN_DQXZQ",
      minzoom: 7,
      maxzoom: 16,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(250,250,250,0.6)",
        "line-width": 7,
        "line-blur": 4,
      },
    },

    // {
    //     //10.基础背景：兴趣区域(功能区)
    //     "id": "p_landuse_aoi",
    //     "type": "fill",
    //     "source": "basemap_ls_jinyun",
    //     "source-layer": "P_Landuse_aoi",
    //     "minzoom": 11,
    //     "layout": {},
    //     "paint": {
    //         "fill-color": [
    //                 'match',
    //                 ['get', 'CLASS'],
    //                 '商业', '#866995',
    //                 '工业区', '#7a664a',
    //                 '工矿', '#7a664a',
    //                 '森林植被', '#336c1f',
    //                 '运动、娱乐', '#54cb8a',
    //                 '#67611d'
    //                 ],
    //         "fill-opacity":0.3
    //     }
    // },

    // //基础水系
    // {
    //     //11.水系：河流1
    //     "id": "hyd_heliu/1",
    //     "type": "fill",
    //     "source": "basemap_ls_jinyun",
    //     "source-layer": "HYDA_HELIU",
    //     "minzoom": 5,
    //     "maxzoom": 10,
    //     "filter": ["all",["in","DISPCLASS","8","7","6"]],
    //     "layout": {},
    //     "paint": {
    //         "fill-color": "#1a4669"
    //     }
    // },
    // {
    //     //11.水系：河流2
    //     "id": "hyd_heliu/2",
    //     "type": "fill",
    //     "source": "basemap_ls_jinyun",
    //     "source-layer": "HYDA_HELIU",
    //     "minzoom": 10,
    //     "maxzoom": 15.5,
    //     "filter": ["all",["in","DISPCLASS","8","7","6","5","4"]],
    //     "layout": {},
    //     "paint": {
    //         "fill-color": "#1a4669"
    //     }
    // },
    // {
    //     //12.水系：河流3
    //     "id": "hyd_heliu/3",
    //     "type": "fill",
    //     "source": "basemap_ls_jinyun",
    //     "source-layer": "HYDA_HELIU",
    //     "minzoom": 15.5,
    //     // "filter": ["all",["in","DISPCLASS","3","2","1"]],
    //     "layout": {},
    //     "paint": {
    //         "fill-color": "#1a4669"
    //     }
    // },
    // {
    //     //13.水系：湖泊水库1
    //     "id": "hyd_huposk/1",
    //     "type": "fill",
    //     "source": "basemap_ls_jinyun",
    //     "source-layer": "HYDA_HUPOSHUIKU",
    //     "minzoom": 5,
    //     "maxzoom": 12,
    //     "filter": ["all",["in","DISPCLASS","8","7","6","5"]],
    //     "layout": {},
    //     "paint": {
    //         "fill-color": "#1a4669"
    //     }
    // },
    // {
    //     //13.水系：湖泊水库2
    //     "id": "hyd_huposk/2",
    //     "type": "fill",
    //     "source": "basemap_ls_jinyun",
    //     "source-layer": "HYDA_HUPOSHUIKU",
    //     "minzoom": 12,
    //     "maxzoom": 16,
    //     "filter": ["all",["in","DISPCLASS","8","7","6","5","4","3"]],
    //     "layout": {},
    //     "paint": {
    //         "fill-color": "#1a4669"
    //     }
    // },
    // {
    //     //14.水系：湖泊水库3
    //     "id": "hyd_huposk/3",
    //     "type": "fill",
    //     "source": "basemap_ls_jinyun",
    //     "source-layer": "HYDA_HUPOSHUIKU",
    //     "minzoom": 16,
    //     // "filter": ["all",["in","DISPCLASS","2","1"]],
    //     "layout": {},
    //     "paint": {
    //         "fill-color": "#1a4669"
    //     }
    // },
    //    //  专题水系
    //    {
    //         //11.水系：河流线1
    //         "id": "hb_wh_hyd_river_l/1",
    //         "type": "line",
    //         "source": "basemap_ls_jinyun",
    //         "source-layer": "HYDL_SHUIXI",
    //         "minzoom": 5,
    //         "maxzoom": 11,
    //         "filter": ["all",["in","DISPCLASS","8","7","6","5","4","3"]],
    //         "layout": {
    //             "line-cap": "round",
    //             "line-join": "round"
    //         },
    //         "paint": {
    //             "line-color": "#1bb1e4",
    //             "line-width": ['match',['get', 'DISPCLASS'],'5', 3,'4', 2.2,'3', 1,'2', 0.5,'1', 0.5,0.5]
    //         }
    //     },
    //     {
    //         //11.水系：河流线2
    //         "id": "hb_wh_hyd_river_l/2",
    //         "type": "line",
    //         "source": "basemap_ls_jinyun",
    //         "source-layer": "HYDL_SHUIXI",
    //         "minzoom": 11,
    //         "layout": {
    //             "line-cap": "round",
    //             "line-join": "round"
    //         },
    //         "paint": {
    //             "line-color": "#1bb1e4",
    //             "line-width": ['match',['get', 'DISPCLASS'],'5', 2.5,'4', 2,'3', 1.6,'2', 1.3,'1', 1,1]
    //         }
    //     },
    //     {
    //         //11.水系：河流1
    //         "id": "hb_wh_hyd_river/1",
    //         "type": "fill",
    //         "source": "basemap_ls_jinyun",
    //         "source-layer": "HYDA_HELIU",
    //         // "minzoom": 5,
    //         // "maxzoom": 13,
    //         "filter": ["all",["in","DISPCLASS","8","7","6","5","4","3"]],
    //         "layout": {},
    //         "paint": {
    //             "fill-color": "#1bb1e4"
    //         }
    //     },
    //     {
    //         //11.水系：河流2
    //         "id": "hb_wh_hyd_river/2",
    //         "type": "fill",
    //         "source": "basemap_ls_jinyun",
    //         "source-layer": "HYDA_HELIU",
    //         "minzoom": 13,
    //         // "maxzoom": 13,
    //         // "filter": ["all",["in","DISPCLASS","8","7","6","5","4","3"]],
    //         "layout": {},
    //         "paint": {
    //             "fill-color": "#1bb1e4"
    //         }
    //     },
    //     {
    //         //11.水系：湖库1
    //         "id": "hb_wh_hyd_lake/1",
    //         "type": "fill",
    //         "source": "basemap_ls_jinyun",
    //         "source-layer": "HYDA_HUPOSHUIKU",
    //         "minzoom": 5,
    //         "maxzoom": 13,
    //         "filter": ["all",["in","DISPCLASS","8","7","6","5","4","3"]],
    //         "layout": {},
    //         "paint": {
    //             "fill-color": "#1bb1e4"
    //         }
    //     },
    //     {
    //         //11.水系：湖库2
    //         "id": "hb_wh_hyd_lake/2",
    //         "type": "fill",
    //         "source": "basemap_ls_jinyun",
    //         "source-layer": "HYDA_HUPOSHUIKU",
    //         "minzoom": 13,
    //         // "maxzoom": 13,
    //         // "filter": ["all",["in","DISPCLASS","8","7","6","5","4","3"]],
    //         "layout": {},
    //         "paint": {
    //             "fill-color": "#1bb1e4"
    //         }
    //     },

    //地名******************************************

    {
      //16.区划界线:当前行政区划界线
      id: "boua2_djszqh/cur_l2",
      type: "line",
      source: "adminmap_ls_jinyun",
      "source-layer": "AGN_DQXZQ",
      minzoom: 7,
      maxzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgb(250,250,250)",
        "line-width": 0.7,
      },
    },

    {
      //17.建筑：平面建筑
      id: "building/2d",
      type: "fill",
      source: "basemap_ls_jinyun",
      "source-layer": "building",
      minzoom: 14,
      layout: {},
      paint: {
        "fill-color": "rgba(10,35,65,0.7)",
        "fill-outline-color": "rgb(10,35,65)",
      },
    },
    {
      //18.道路：其他道路（线）
      id: "	r8_qtdl/1",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R8_QTDL",
      minzoom: 13,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 1.5,
      },
    },
    {
      //19.道路：市区杂路（线）
      id: "r7_sqzl/1",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R7_SQZL",
      minzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 2,
      },
    },
    {
      //20.道路：市区道路（线1）
      id: "r6_sqdl/1",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R6_SQDL",
      minzoom: 12,
      maxzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 1.5,
      },
    },
    {
      //21.道路：市区道路（线2）
      id: "r6_sqdl/2",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R6_SQDL",
      minzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 3,
      },
    },

    {
      //23.道路：县道（线1）
      id: "r5_xd/1",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R5_XD",
      minzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgb(20,20,20)",
        "line-width": 3.5,
      },
    },
    {
      //24.道路：县道（线11）
      id: "r5_xd/11",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R5_XD",
      minzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 1.5,
      },
    },
    {
      //25.道路：省道（线21）
      id: "r4_sd/21",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R4_SD",
      minzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgb(20,20,20)",
        "line-width": 3.5,
      },
    },
    {
      //26.道路：省道（线22）
      id: "r4_sd/22",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R4_SD",
      minzoom: 13,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 2,
      },
    },
    {
      //27.道路：国道（线11）
      id: "r3_gd/11",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R3_GD",
      minzoom: 11,
      maxzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 1.8,
      },
    },
    {
      //28.道路：国道（线21）
      id: "r3_gd/21",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R3_GD",
      minzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgb(20,20,20)",
        "line-width": 5.5,
      },
    },
    {
      //29.道路：国道（线22）
      id: "r3_gd/22",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R3_GD",
      minzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#867634",
        "line-width": 4.5,
      },
    },
    {
      //30.道路：高速公路（线11）
      id: "r1_gsgl/11",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R1_GSGL",
      minzoom: 11,
      maxzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#847640",
        "line-width": 2,
      },
    },
    {
      //31.道路：高速公路（线21）
      id: "r1_gsgl/21",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R1_GSGL",
      minzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgb(20,20,20)",
        "line-width": 6,
      },
    },
    {
      //32.道路：高速公路（线22）
      id: "r1_gsgl/22",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R1_GSGL",
      minzoom: 14,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#957736",
        "line-width": 5,
      },
    },
    {
      //22.道路：地铁及轻轨（线）
      id: "r_dtqg/1",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R_DITIE",
      minzoom: 12,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#fffd80",
        "line-width": 6,
        "line-blur": 4,
      },
    },
    {
      //22.道路：地铁及轻轨（线）
      id: "r_dtqg/12",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R_DITIE",
      minzoom: 12,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": [
          "match",
          ["get", "NAME"],
          "武汉地铁8号线",
          "#ADC3C0",
          "武汉地铁7号线",
          "#F4B67F",
          "武汉地铁6号线",
          "#55AF77",
          "武汉地铁4号线",
          "#AED56A",
          "武汉地铁3号线",
          "#E2C784",
          "武汉地铁2号线",
          "#F0A4C6",
          "武汉地铁1号线",
          "#78A8D5",
          "武汉地铁阳逻线",
          "#E06FBB",
          "#4ef2e5",
        ],
        "line-width": 2.5,
      },
    },
    {
      //33.道路：铁路（线1）
      id: "r_tl/1",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R_TIELU",
      minzoom: 14,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "rgb(20,20,20)",
        "line-width": 4,
      },
    },
    {
      //34.道路：铁路（线2）
      id: "r_tl/2",
      type: "line",
      source: "basemap_ls_jinyun",
      "source-layer": "R_TIELU",
      minzoom: 14,
      layout: {
        "line-join": "round",
      },
      paint: {
        "line-color": "#545454",
        "line-width": 2,
        "line-dasharray": [5, 8],
      },
    },
    {
      //35.道路：其他杂路（标注 rdname 1）
      id: "r8_qtdl/label/rdname 1",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "R8_QTDL",
      minzoom: 15,
      layout: {
        "symbol-placement": "line",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 11,
        "text-padding": 10,
        "text-field": "{RDNAME}",
        "text-pitch-alignment": "viewport",
        // "text-letter-spacing":25,
      },
      paint: {
        "text-color": "#d3b669",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //36.道路：市区杂路（标注 rdname 1）
      id: "r7_sqzl/label/rdname 1",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "R7_SQZL",
      minzoom: 14.5,
      layout: {
        "symbol-placement": "line",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 11,
        "text-padding": 10,
        "text-field": "{RDNAME}",
        "text-pitch-alignment": "viewport",
        // "text-letter-spacing":25,
        "text-optional": true,
      },
      paint: {
        "text-color": "#d3b669",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //37.道路：市区道路（标注 rdname 1）
      id: "r6_sqdl/label/rdname 1",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "R6_SQDL",
      minzoom: 14,
      layout: {
        "symbol-placement": "line",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 11,
        "text-padding": 10,
        "text-field": "{RDNAME}",
        "text-pitch-alignment": "viewport",
        // "text-letter-spacing":25,
      },
      paint: {
        "text-color": "#d3b669",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //38.道路：县道（标注 rdname 1）
      id: "r5_xd/label/rdname 1",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "R5_XD",
      minzoom: 13.5,
      layout: {
        "symbol-placement": "line",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 11,
        "text-padding": 10,
        "text-field": "{RDNAME}",
        "text-pitch-alignment": "viewport",
        // "text-letter-spacing":25,
      },
      paint: {
        "text-color": "#d3b669",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //39.道路：省道（标注 rdcode 1）
      id: "r4_sd/label/Class rdcode",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "R4_SD",
      minzoom: 13,
      filter: ["all", [">=", "CODELEN", 2], ["<=", "CODELEN", 4]],
      layout: {
        "symbol-placement": "point",
        // "symbol-spacing": 20,
        "icon-image": "cn-provincial-expy-4",
        "icon-anchor": "center",
        "icon-padding": 80,
        "icon-size": 0.65,
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 9.3,
        // "text-padding": 20,
        "text-anchor": "center",
        "text-field": "{RDCODE}",
      },
      paint: {
        "text-color": "rgb(220,220,220)",
      },
    },
    {
      //40.道路：省道（标注 rdname 1）
      id: "r4_sd/label/rdname 1",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "R4_SD",
      minzoom: 12.5,
      layout: {
        "symbol-placement": "line",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 11,
        "text-padding": 10,
        "text-field": "{RDNAME}",
        "text-pitch-alignment": "viewport",
        // "text-letter-spacing":25,
      },
      paint: {
        "text-color": "#d3b669",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //41.道路：国道（标注 rdname 1）
      id: "r3_gd/label/rdname 1",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "R3_GD",
      minzoom: 11.5,
      layout: {
        "symbol-placement": "line",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12.5,
        "text-padding": 10,
        "text-field": "{RDNAME}",
        "text-pitch-alignment": "viewport",
        // "text-letter-spacing":25,
      },
      paint: {
        "text-color": "#d3b669",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //42.道路：国道（标注 rdcode 1）
      id: "r3_gd/label/rdcode",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "R3_GD",
      minzoom: 12.5,
      filter: ["all", [">=", "CODELEN", 2], ["<=", "CODELEN", 5]],
      layout: {
        "symbol-placement": "point",
        "icon-image": "cn-provincial-expy-4",
        "icon-anchor": "center",
        "icon-padding": 80,
        "icon-size": 0.8,
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 9.8,
        // "text-padding": 20,
        "text-anchor": "center",
        "text-field": "{RDCODE}",
      },
      paint: {
        "text-color": "rgb(220,220,220)",
      },
    },
    {
      //43.道路：高速公路（标注 rdname 1）
      id: "r1_gsgl/label/rdname 1",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "R1_GSGL",
      minzoom: 11.5,
      layout: {
        "symbol-placement": "line",
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 13,
        "text-padding": 10,
        "text-field": "{RDNAME}",
        // "text-letter-spacing": 10,
      },
      paint: {
        "text-color": "rgb(198,198,198)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //22.道路：地铁及轻轨（线）
      id: "r_dtqg/label/12",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "R_DITIE",
      minzoom: 13,
      layout: {
        "symbol-placement": "line",
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 13,
        "text-padding": 10,
        "text-field": "{NAME}",
        // "text-letter-spacing": 10,
      },
      paint: {
        "text-color": "rgb(198,198,198)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //44.道路：高速公路（标注 rdcode 1）
      id: "r1_gsgl/label/rdcode 1",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "R1_GSGL",
      minzoom: 12,
      filter: ["all", [">=", "CODELEN", 2], ["<=", "CODELEN", 5]],
      layout: {
        "symbol-placement": "point",
        // "symbol-spacing": 20,
        "icon-image": "cn-nths-expy-4",
        "icon-anchor": "center",
        "icon-padding": 80,
        "icon-size": 0.8,
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 9.8,
        "text-padding": 20,
        "text-anchor": "center",
        "text-field": "{RDCODE}",
      },
      paint: {
        "text-color": "rgb(220,220,220)",
      },
    },

    {
      //45.建筑：三维建筑（拉伸白模）
      id: "buildings_3d",
      minzoom: 12.5,
      source: "basemap_ls_jinyun",
      "source-layer": "building",
      type: "fill-extrusion",
      paint: {
        "fill-extrusion-color": [
          "interpolate",
          ["linear"], //["exponential", 1.8],//
          ["to-number", ["get", "Height"]],
          0,
          "#81a3db",
          110,
          "#3b537b",
        ],
        "fill-extrusion-height": ["to-number", ["get", "Height"]],
        // "fill-extrusion-base":600,
        "fill-extrusion-opacity": 0.7,
      },
    },
    {
      //46.兴趣点：机场
      id: "p02_jcgkmt_jichang",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "P02_JT_JC_GK_MT",
      minzoom: 11,
      filter: ["all", ["in", "KIND", "8100"]],
      layout: {
        "icon-image": "airport-15",
        "icon-anchor": "top",
        "icon-size": 1,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-anchor": "bottom",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(230,230,230)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },

    {
      //47.兴趣点：港口码头
      id: "p02_jcgkmt_gangkoumatou",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "P02_JT_JC_GK_MT",
      minzoom: 14,
      filter: ["all", ["in", "KIND", "8180"]],
      layout: {
        "icon-image": "harbor-11",
        "icon-anchor": "top",
        "icon-size": 1,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12.5,
        "text-anchor": "bottom",
        "text-max-width": 10,
        "text-pitch-alignment": "viewport",
        "icon-allow-overlap": true,
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //48.兴趣点：汽车站
      id: "p04_qcz_qichezhan",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "P04_JT_QCZ",
      minzoom: 14,
      filter: ["all", ["in", "KIND", "8083"]],
      layout: {
        "icon-image": "bus",
        "icon-anchor": "top",
        "icon-size": 0.8,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-anchor": "bottom",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
        "icon-allow-overlap": true,
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //49.兴趣点：火车站
      id: "basemap_ls_jinyun",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "P03_JT_HCZ_DTZ",
      minzoom: 12,
      filter: ["all", ["in", "KIND", "8081", "8088"]],
      layout: {
        "icon-image": "rail",
        "icon-anchor": "top",
        "icon-size": 1,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 13,
        "text-anchor": "bottom",
        "text-max-width": 10,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //50.兴趣点：医院
      id: "p15_ylfw/yiyuan",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "P15_GG_YLFW",
      filter: ["all", ["in", "KIND", "7200"], ["<=", "NALEN", 12]],
      minzoom: 16,
      layout: {
        "icon-image": "hospital-11",
        "icon-anchor": "top",
        "icon-size": 1,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "bottom",
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //51.兴趣点：学校
      id: "p16_kyjy/xuexiao",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "P16_GG_KYJY",
      filter: [
        "all",
        ["in", "KIND", "A700", "A701", "A702", "A703"],
        ["<=", "NALEN", 12],
      ],
      minzoom: 16.5,
      layout: {
        "icon-image": "college-15",
        "icon-anchor": "top",
        "icon-size": 1,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "bottom",
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //52.兴趣点：住宅小区
      id: "p19_zzxq",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "P19_GG_ZZXQ",
      minzoom: 16,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "top",
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //52.兴趣点：公司企业
      id: "P17_SY_GSQY",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "P17_SY_GSQY",
      minzoom: 16.2,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "top",
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //53.兴趣点：商业大厦
      id: "p11_syds",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "P11_SY_SYDS",
      minzoom: 15.5,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "top",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //53.兴趣点：公园广场
      id: "P18_GG_GYGC",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "P18_GG_GYGC",
      minzoom: 14,
      layout: {
        "icon-image": "park-15",
        "icon-anchor": "top",
        "icon-size": 1,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "bottom",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //54.兴趣点：地铁站
      id: "p03_hczdtz_ditiezhan",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "P03_JT_HCZ_DTZ",
      minzoom: 14,
      filter: ["all", ["in", "KIND", "8085"]],
      layout: {
        "icon-image": "rail-metro",
        "icon-anchor": "center",
        "icon-size": 1,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12.5,
        "text-offset": [1, 0],
        "text-anchor": "left",
        "text-max-width": 10,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //55.兴趣点：山
      id: "p_shan_1",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "P_SHANMAI",
      minzoom: 15,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "top",
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //56.兴趣点：海域地名1
      id: "aanp_hydm_1",
      type: "symbol",
      source: "adminmap_ls_jinyun",
      "source-layer": "AANP_HYDM",
      minzoom: 13,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "top",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //57.兴趣点：海域地名8
      id: "aanp_hydm_8",
      type: "symbol",
      source: "adminmap_ls_jinyun",
      "source-layer": "AANP_HYDM",
      maxzoom: 13,
      filter: ["==", "DISPCLASS", "8"],
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 11,
        "text-padding": 10,
        "text-anchor": "top",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(220,235,220)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //58.行政地名：村庄
      id: "p_cunzhuang",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "AGNP_P_CUNZHUANG",
      minzoom: 13.5,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 12,
        "text-padding": 10,
        "text-anchor": "center",
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "rgb(240,240,240)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1.2,
      },
    },
    // {
    //     //59.基础背景：兴趣区域(功能区)标注
    //     "id": "p_landuse_aoi/label",
    //     "type": "symbol",
    //     "source": "basemap_ls_jinyun",
    //     "source-layer": "P_Landuse_aoi",
    //     "minzoom": 13,
    //     "layout": {
    //         "text-field": "{name}",
    //         "text-font": ["Microsoft YaHei Regular"],
    //         "text-size": 12,
    //         "text-padding": 10,
    //         "text-anchor": "center",
    //         "text-max-width": 8,
    //         "text-pitch-alignment": "viewport",
    //     },
    //     "paint": {
    //         "text-color": "#dfc85e",
    //         "text-halo-color": "rgb(25,25,25)",
    //         "text-halo-width": 1.2
    //     }
    // },

    {
      //62.行政地名：乡镇街道
      id: "AGNP4_XZJDXZZX/1",
      type: "symbol",
      source: "adminmap_ls_jinyun",
      "source-layer": "AGNP4_XZJDXZZX",
      minzoom: 9,
      maxzoom: 13.5,
      layout: {
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 13,
        "text-padding": 8,
        "text-max-width": 8,
        "text-field": "{NAME}",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(245,245,245)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //62.行政地名：乡镇街道
      id: "AGNP4_XZJDXZZX/2",
      type: "symbol",
      source: "adminmap_ls_jinyun",
      "source-layer": "AGNP4_XZJDXZZX",
      minzoom: 13.5,
      layout: {
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 14,
        "text-padding": 10,
        "text-max-width": 8,
        "text-field": "{NAME}",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(215,215,215)",
        "text-halo-color": "rgb(15,15,15)",
        "text-halo-width": 1,
      },
    },
    {
      //63.行政地名：县级市行政中心1
      id: "agnp3_qxjxzzx/1",
      type: "symbol",
      source: "adminmap_ls_jinyun",
      "source-layer": "AGNP3_QXJXZZX",
      minzoom: 8,
      maxzoom: 12,
      layout: {
        visibility: "visible",
        "text-size": 13,
        // "text-padding": 10,
        "text-rotation-alignment": "viewport",
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Regular"],
        "text-anchor": "center",
        "text-max-width": 8,
        "text-field": "{SNAME}",
      },
      paint: {
        "text-color": "rgb(230,230,230)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //63.行政地名：县级市行政中心1
      id: "agnp3_qxjxzzx/cur2",
      type: "symbol",
      source: "adminmap_ls_jinyun",
      "source-layer": "AGNP3_QXJXZZX",
      minzoom: 14,
      layout: {
        visibility: "visible",
        "text-size": 14,
        // "text-padding": 10,
        "text-rotation-alignment": "viewport",
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Bold"],
        "text-anchor": "center",
        "text-max-width": 8,
        "text-field": "{name}",
      },
      paint: {
        "text-color": "rgb(240,240,240)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //64.行政地名：区级行政中心
      id: "agnp3_qxjxzzx/2",
      type: "symbol",
      source: "adminmap_ls_jinyun",
      "source-layer": "AGNP3_QXJXZZX",
      minzoom: 11,
      layout: {
        "icon-image": "circle-white-2",
        "icon-anchor": "top",
        "icon-size": 0.3,
        // "icon-allow-overlap": true,
        visibility: "visible",
        "text-size": 12,
        // "text-padding": 30,
        // "text-offset": [0,-1],
        "text-rotation-alignment": "viewport",
        "text-pitch-alignment": "viewport",
        "text-font": ["Microsoft YaHei Bold"],
        "text-anchor": "bottom",
        "text-max-width": 8,
        "text-field": "{SNAME}",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(220,220,220)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //65.行政地名：地级市1
      id: "agnp2_djsxzzx/1",
      type: "symbol",
      source: "adminmap_ls_jinyun",
      "source-layer": "AGNP2_DJSXZZX",
      minzoom: 6,
      maxzoom: 10,
      layout: {
        "text-field": "{SNAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 13,
        "text-anchor": "center",
        "text-max-width": 8,
        "text-rotation-alignment": "viewport",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(230,230,230)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //66.行政地名：地级市2
      id: "agnp2_djsxzzx/2",
      type: "symbol",
      source: "adminmap_ls_jinyun",
      "source-layer": "AGNP2_DJSXZZX",
      minzoom: 10,
      layout: {
        "icon-image": "circle-white-2",
        "icon-anchor": "top",
        "icon-size": 0.6,
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 15,
        "text-anchor": "bottom",
        "text-max-width": 8,
        "text-rotation-alignment": "viewport",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(230,230,230)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //67.行政地名：省级行政中心2
      id: "agnp1_shengjxzzx/2",
      type: "symbol",
      source: "adminmap_ls_jinyun",
      "source-layer": "AGNP1_SJXZZX",
      minzoom: 5,
      maxzoom: 6,
      layout: {
        "text-field": "{CITY}",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 12,
        "text-anchor": "center",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(220,220,220)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //68.行政地名：省级行政中心1
      id: "agnp1_shengjxzzx/1",
      type: "symbol",
      source: "adminmap_ls_jinyun",
      "source-layer": "AGNP1_SJXZZX",
      minzoom: 3,
      maxzoom: 5,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 12,
        "text-anchor": "center",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(220,220,220)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //69.行政地名：北京市
      id: "agnp1_shengjxzzx/beijing",
      type: "symbol",
      source: "adminmap_ls_jinyun",
      "source-layer": "AGNP1_SJXZZX",
      filter: ["==", "NAME", "北京市"],
      minzoom: 1,
      maxzoom: 6,
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Bold"],
        "text-size": 12,
        "text-anchor": "center",
        "text-pitch-alignment": "viewport",
        "text-optional": true,
      },
      paint: {
        "text-color": "rgb(220,220,220)",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //16.区划界线:乡镇境界线
      id: "boul4_xzjjx/qx_cur2",
      type: "line",
      source: "adminmap_ls_jinyun",
      "source-layer": "BOUA4_XZJDXZQH",
      minzoom: 8.5,
      maxzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(220,220,220,0.5)",
        "line-width": 1.7,
        // "line-dasharray": [2,2],
        "line-blur": 0.4,
      },
    },
    {
      //16.区划界线:当前行政区划界线
      id: "boua2_djszqh/cur_l_blur2",
      type: "line",
      source: "adminmap_ls_jinyun",
      "source-layer": "AGN_DQXZQ",
      minzoom: 7,
      maxzoom: 16,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(250,250,250,1)",
        "line-width": 2,
        // "line-blur": 16
      },
    },
    {
      //16.区划界线:当前行政区下级区划界线
      id: "boul_xzjjx/qx_cur2",
      type: "line",
      source: "adminmap_ls_jinyun",
      "source-layer": "BOUL_XZJJX_QXJ",
      minzoom: 7,
      maxzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(245,245,245,1)",
        "line-width": 4,
        // "line-dasharray": [2,2],
        "line-blur": 4,
      },
    },
    {
      //16.区划界线:当前行政区下级区划界线
      id: "boul_xzjjx/qx_cur3",
      type: "line",
      source: "adminmap_ls_jinyun",
      "source-layer": "BOUL_XZJJX_QXJ",
      minzoom: 7,
      maxzoom: 15,
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "rgba(245,245,245,1)",
        "line-width": 1.8,
        // "line-dasharray": [2,2],
        // "line-blur": 4
      },
    },

    //专题标注
    {
      //61.专题标注：河流标注1
      id: "HB_WH_HYDL/label1",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "HYDL_SHUIXI",
      minzoom: 5,
      maxzoom: 16,
      filter: ["all", ["in", "DISPCLASS", "8", "7", "6", "5", "4", "3"]],
      layout: {
        "symbol-placement": "line",
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 14,
        "text-padding": 20,
        "text-anchor": "center",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "#73DFFF",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },

    {
      //61.专题标注：河流标注2
      id: "HB_WH_HYDL/label2",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "HYDL_SHUIXI",
      minzoom: 16,
      // "filter": ["all",["in","DISPCLASS","8","7","6","5","4","3"]],
      layout: {
        "symbol-placement": "line",
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 15,
        "text-padding": 20,
        "text-anchor": "center",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "#73DFFF",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //61.专题标注：湖泊水库标注1
      id: "hb_wh_hyd_huposk/label1",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "HYDA_HUPOSHUIKU",
      minzoom: 12,
      maxzoom: 16,
      filter: ["all", ["in", "DISPCLASS", "8", "7", "6", "5", "4"]],
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 14,
        "text-padding": 20,
        "text-anchor": "center",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "#73DFFF",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //61.专题标注：湖泊水库标注2
      id: "hb_wh_hyd_huposk/label2",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "HYDA_HUPOSHUIKU",
      minzoom: 14,
      maxzoom: 16,
      filter: ["all", ["in", "DISPCLASS", "2", "3"]],
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 14,
        "text-padding": 20,
        "text-anchor": "center",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "#73DFFF",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
    {
      //61.专题标注：湖泊水库标注3
      id: "hb_wh_hyd_huposk/label3",
      type: "symbol",
      source: "basemap_ls_jinyun",
      "source-layer": "HYDA_HUPOSHUIKU",
      minzoom: 16,
      // "maxzoom": 16,
      // "filter": ["all",["in","DISPCLASS","4","3"]],
      layout: {
        "text-field": "{NAME}",
        "text-font": ["Microsoft YaHei Regular"],
        "text-size": 14,
        "text-padding": 20,
        "text-anchor": "center",
        "text-max-width": 8,
        "text-pitch-alignment": "viewport",
      },
      paint: {
        "text-color": "#73DFFF",
        "text-halo-color": "rgb(25,25,25)",
        "text-halo-width": 1,
      },
    },
  ],
};
