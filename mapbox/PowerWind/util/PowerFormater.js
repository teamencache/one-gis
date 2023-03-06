/**
 * 将博沃后端插值数据转为风场绘制格式
 * @param{Array} data 风场插值json数据
 * @param{mapboxgl} mapboxgl
 */
 export function formatWindJson(data, mapboxgl) {
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
        let heft = encodeWind(value, windData.uMin, windData.uMax);
        imageData.push(heft);
        value = vData[index];
        heft = encodeWind(value, windData.vMin, windData.vMax);
        imageData.push(heft);
        imageData.push(0);
        imageData.push(255);
        index++;
    }
    windData.imageData = imageData;

    /* let sw = new mapboxgl.LngLat(windData.lo1, windData.la2);
    let ne = new mapboxgl.LngLat(windData.lo2, windData.la1);
    windData.bbox = new mapboxgl.LngLatBounds(sw, ne);

    let imageUtil = new ImageUtil();
    imageUtil.setSourceImageData(windData.imageData, windData.bbox, {
        width: windData.width,
        height: windData.height,
    });
    // imageUtil.flipImageData('Y');

    let image = imageUtil.image1;
    windData.image = image; */
    return windData;
}
/**
 * 解析博沃后端插值编码图片
 * @param {Image} image
 */
export function formatWindImage(image) {
    if (image instanceof Image) {
        let imageUtil = new ImageUtil();
        imageUtil.setSourceImage(image);
    }
}
// 风速编码到颜色分量中
export function encodeWind(value, min, max) {
    let rate = ((value - min) / (max - min)) * 255;
    let heft = Math.floor(rate);
    return heft;
}
// 颜色分量中解码风速
export function decodeWind(heft, min, max) {
    let value = (heft / 255) * (max - min) + min;
    return value;
}

// 解码图片头部风场信息
export function decodeWindHead(imageData, orders, splitChar) {
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
}

export function replaceStringWithObjProps(str, obj) {
    // 匹配用 [] 包裹的字符串和方括号内的属性名
    const regex = /\[(\w+)\]/g;

    // 用 obj 的属性替换匹配到的字符串
    return str.replace(regex, (match, p1) => obj[p1] || '');
}
