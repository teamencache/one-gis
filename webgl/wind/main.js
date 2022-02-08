/* (function(global){
    
})() */
import WindGL from "./wind.js";
let eleOption = {
  type: "canvas",
  attr: {
    width: 500, //不能加px
    height: 400,
  },
  style: {
    width: "500px",
    height: "400px",
    float: "left",
  },
  appendTo: window.document.body,
};

//创建dom
function createElement(eleOption) {
  let ele = document.createElement(eleOption.type);
  if (eleOption.attr) {
    Object.assign(ele, eleOption.attr);
  }
  if (eleOption.style) {
    Object.assign(ele.style, eleOption.style);
  }
  if (eleOption.appendTo) {
    return eleOption.appendTo.appendChild(ele);
  } else {
    return ele;
  }
}

function updateRetina(canvas) {
  const ratio = meta["retina resolution"] ? pxRatio : 1;
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;
  // wind.resize();
}

function updateWind(name) {
  getJSON(
    "/one-gis/resource/wind/" + windFiles[name] + ".json",
    function (windData) {
      const windImage = new Image();
      windData.image = windImage;
      Object.assign(windData, extent); //添加自定义范围
      windImage.src = "/one-gis/resource/wind/" + windFiles[name] + ".png";
      windImage.onload = function () {
        /* windData.image = cutImageByRect(windImage,{
          x:extent.xmin+180,
          y:90-extent.ymax,
          width:extent.xmax-extent.xmin,
          height:extent.ymax-extent.ymin
        }); */
        wind.setWind(windData);
        test.setWind(windData);
      };
    }
  );
}

function getJSON(url, callback) {
  const xhr = new XMLHttpRequest();
  xhr.responseType = "json";
  xhr.open("get", url, true);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status < 300) {
      callback(xhr.response);
    } else {
      throw new Error(xhr.statusText);
    }
  };
  xhr.send();
}
const meta = {
  "2016-11-20+h": 0,
  "retina resolution": true,
  "github.com/mapbox/webgl-wind": function () {
    window.location = "https://github.com/mapbox/webgl-wind";
  },
};

const windFiles = {
  cut: "2016112000_cut",
  0: "2016112000",
  6: "2016112006",
  12: "2016112012",
  18: "2016112018",
  24: "2016112100",
  30: "2016112106",
  36: "2016112112",
  42: "2016112118",
  48: "2016112200",
};
// 自定义范围
const extent = {
  xmin: 73,
  xmax: 136,
  ymin: 18,
  ymax: 54,
};
//风场canvas
let windCanvas = createElement(eleOption);
let testCanvas = createElement(eleOption);
window.document.body.style["background"] = "black";
/* getJSON('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_110m_coastline.geojson', function (data) {
    const canvas = document.getElementById('coastline');
    canvas.width = canvas.clientWidth * pxRatio;
    canvas.height = canvas.clientHeight * pxRatio;

    const ctx = canvas.getContext('2d');
    ctx.lineWidth = pxRatio;
    ctx.lineJoin = ctx.lineCap = 'round';
    ctx.strokeStyle = 'white';
    ctx.beginPath();

    for (let i = 0; i < data.features.length; i++) {
        const line = data.features[i].geometry.coordinates;
        for (let j = 0; j < line.length; j++) {
            ctx[j ? 'lineTo' : 'moveTo'](
                (line[j][0] + 180) * canvas.width / 360,
                (-line[j][1] + 90) * canvas.height / 180);
        }
    }
    ctx.stroke();
}); */
const pxRatio = Math.max(Math.floor(window.devicePixelRatio) || 1, 2);
/* canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight; */
updateWind('cut');
updateRetina(windCanvas);
updateRetina(testCanvas);

const windgl = windCanvas.getContext("webgl", { antialiasing: false });
const testgl = testCanvas.getContext("webgl", { antialiasing: false });

const wind = new WindGL(windgl);
wind.numParticles = 1024*8;

const test = new WindGL(testgl);
test.numParticles = 1024;

function frame() {
  if (wind.windData) {
    wind.draw();
  }
  if (test.windData) {
    test.draw();
  }
  requestAnimationFrame(frame);
}
frame();
window.frame = frame;
// 矩形区域截取
function cutImageByRect(image, rect) {
  let ele = document.createElement('canvas');
  ele.width = rect.width;
  ele.height = rect.height;
  let context = ele.getContext('2d');
  // drawImage(imageResource, dx, dy)
  // context.drawImage(image,rect.x,rect.y,rect.width, rect.height);
  context.drawImage(image, rect.x, rect.y, rect.width, rect.height, 0, 0, rect.width, rect.height);
  // let cutImageData = context.getImageData(0, 0, rect.width, rect.height);
  // return ele.toDataURL();
  let img = new Image();
  img.src =ele.toDataURL();
  // document.body.append(img);
  return img;
}
