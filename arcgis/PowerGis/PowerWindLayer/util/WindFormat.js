/** @format */
/**
 * 将博沃后端插值数据转为风场绘制格式
 * @param{Array} data
 * @param{mapboxgl} mapboxgl
 */
define(["dojo/_base/declare", "./ImageUtil"], function (declare, ImageUtil) {
  return declare(null, {
    map:null,
    mapType:'',
    MercatorCoordinate:null,
    constructor(option){
      Object.assign(this, option);
    },
    formatWindJson(data, mapboxgl) {
      let header = data[0].header;
      let { lo1, lo2, la1, la2, nx, ny } = { ...header };
      let windData = {
          width: parseFloat(nx),
          height: parseFloat(ny),
          uMin: 0,
          uMax: 0,
          vMin: 0,
          vMax: 0,
          xmin: parseFloat(lo1),
          xmax: parseFloat(lo2),
          ymin: parseFloat(la1),
          ymax: parseFloat(la2),
      };
  
      let uData = data[0].data;
      let vData = data[1].data;
      let length = uData.length;
      let index = 0;
      while (index < length) {
          let uValue = uData[index];
          let vValue = vData[index];
          windData.uMax = windData.uMax < uValue ? uValue : windData.uMax;
          windData.uMin = windData.uMin > uValue ? uValue : windData.uMin;
          windData.vMax = windData.vMax < vValue ? vValue : windData.vMax;
          windData.vMin = windData.vMin > vValue ? vValue : windData.vMin;
          index++;
      }
      let imageData = [];
      index = 0;
      while (index < length) {
          let value = uData[index];
          let heft = this.encodeWind(value, windData.uMin, windData.uMax);
          imageData.push(heft);
          value = vData[index];
          heft = this.encodeWind(value, windData.vMin, windData.vMax);
          imageData.push(heft);
          imageData.push(0);
          imageData.push(255);
          index++;
      }
      windData.imageData = imageData;
      return windData;
  },
  /**
   * 解析博沃后端插值编码图片
   * @param {Image} image
   */
  formatWindImage(image) {
      if (image instanceof Image) {
          let imageUtil = new ImageUtil();
          imageUtil.setSourceImage(image);
      }
  },
  // 风速编码到颜色分量中
  encodeWind(value, min, max) {
      let rate = ((value - min) / (max - min)) * 255;
      let heft = Math.floor(rate);
      return heft;
  },
  // 颜色分量中解码风速
  decodeWind(heft, min, max) {
      let value = (heft / 255) * (max - min) + min;
      return value;
  },
  
  // 解码图片头部风场信息
  decodeWindHead(imageData, orders, splitChar) {
      splitChar = splitChar || ',';
      orders = orders || ['uMax', 'uMin', 'vMax', 'vMin', 'xmax', 'ymax', 'xmin', 'ymin'];
  
      let result = {};
      let decodeData = imageData.data.filter(function (helf) {
          return helf != 255;
      });
      let decodeStr = String.fromCharCode(...decodeData);
  
      decodeData = decodeStr.split(splitChar);
      orders.forEach(function (key, index) {
          result[key] = parseFloat(decodeData[index]);
      });
      return result;
  },
  /**
   * Bounds => extent
   * @param {Bounds} bounds 
   * @returns 
   */
  bounds2Bbox(bounds){
    return {
      xmin:bounds._sw.lng,
      ymin:bounds._sw.lat,
      xmax:bounds._ne.lng,
      ymax:bounds._ne.lat,
    }
  },
  // 获取地图类型，用于风场内部判断
  setMap(map){
    let mapType;
    if(map.declaredClass == 'esri.Map'){
      mapType = 'EsriMap';
    }else if(typeof map.triggerRepaint == 'function'){
      mapType = 'MapboxglMap';
    }
    this.map = map;
    this.mapType = mapType;
  },
  // 获取地图当前bbox
  getBbox(){
    let bbox;
    let temp;
    switch(this.mapType){
      case 'EsriMap':
        bbox = this.map.extent;
        break;
      case 'MapboxglMap':
        temp = this.map.getBounds();
        bbox = this.bounds2Bbox(temp);
        break;
    }
    return bbox;
  },
  // 点位坐标转为屏幕坐标
  toScreen(mapPoint){
      let screen;
      switch (this.mapType) {
        case 'EsriMap':
          screen = this.map.toScreen(mapPoint)
          break;
        case 'MapboxglMap':
          screen = this.map.project(mapPoint)
          break;
      }
      return screen;
  },
  // 屏幕坐标转顶点坐标
  toVertice(mapPoint){
    let vertice;
    let screen;
    let {width,height} = this.map;
      switch (this.mapType) {
        case 'EsriMap':
          screen = this.toScreen(mapPoint, this.mapType, this.map);
          vertice = [screen.x - width/2, height/2-screen.y, 0];
          vertice[0] = vertice[0]/(width/2);
          vertice[1] = vertice[1]/(height/2);
          break;
        case 'MapboxglMap':
          vertice = this.MercatorCoordinate.fromLngLat(mapPoint);
          break;
      }
      return {
        x:vertice[0],
        y:vertice[1],
        z:0,
      };
  },

  replaceStringWithObjProps(str, obj) {
      // 匹配用 [] 包裹的字符串和方括号内的属性名
      const regex = /\[(\w+)\]/g;
  
      // 用 obj 的属性替换匹配到的字符串
      return str.replace(regex, (match, p1) => obj[p1] || '');
  }
  });
});
