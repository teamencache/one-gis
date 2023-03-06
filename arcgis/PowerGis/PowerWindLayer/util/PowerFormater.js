/** @format */
/**
 * 将博沃后端插值数据转为风场绘制格式
 * @param{Array} data
 * @param{mapboxgl} mapboxgl
 */
define(["dojo/_base/declare", "./ImageUtil"], function (declare, ImageUtil) {
  return {
    formatWindData(data, mapboxgl) {
      let windData = { ...data[0].header };
      windData.width = windData.nx;
      windData.height = windData.ny;
      windData.uMin = 0;
      windData.uMax = 0;
      windData.vMin = 0;
      windData.vMax = 0;
      windData.uData = data[0].data;
      windData.vData = data[1].data;
      let length = windData.uData.length;
      let index = 0;
      while (index < length) {
        let uValue = windData.uData[index];
        let vValue = windData.vData[index];
        windData.uMax = windData.uMax < uValue ? uValue : windData.uMax;
        windData.uMin = windData.uMin > uValue ? uValue : windData.uMin;
        windData.vMax = windData.vMax < vValue ? vValue : windData.vMax;
        windData.vMin = windData.vMin > vValue ? vValue : windData.vMin;
        if (windData.uMax == uValue) {
          windData.uMaxIndex = index;
        }
        if (windData.vMax == vValue) {
          windData.vMaxIndex = index;
        }
        index++;
      }
      let imageData = [];
      index = 0;
      while (index < length) {
        let value = windData.uData[index];
        let heft = this.encodeWind(value, windData.uMin, windData.uMax);
        imageData.push(heft);
        value = windData.vData[index];
        heft = this.encodeWind(value, windData.vMin, windData.vMax);
        imageData.push(heft);
        imageData.push(0);
        imageData.push(255);
        index++;
      }
      windData.imageData = imageData;
      windData.bbox = this.getBbox(windData, mapboxgl);
      return windData;
    },
    // 初始范围
    getBbox(windData, mapboxgl){
      if(mapboxgl){
        return new mapboxgl.LngLatBounds(
                  new mapboxgl.LngLat(windData.lo1, windData.la2), 
                  new mapboxgl.LngLat(windData.lo2, windData.la1)
                );
      }else{
        return {
          xmin:windData.lo1,
          ymin:windData.la2,
          xmax:windData.lo2,
          ymax:windData.la1
        }
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
  };
});
