/**
 * 灰度图处理工具
 */
define(["dojo/_base/declare"], function (declare) {
  return declare(null, {
    constructor() {
      this.canvas = document.createElement("canvas");
      this.context2D = this.canvas.getContext("2d", {
        willReadFrequently:true
      });
      this.image = null; //初始图片
      this.bbox = null; //初始图片经纬度范围
      this.resolution = null; //初始图片像素对应经纬度大小
      this.rangeBbox = null; //当前范围
    },
    // 设置原始图片与对应范围
    setSourceImage: function (image, bbox) {
      this.image = image;
      this.bbox = bbox;
      this.canvas.width = image.width;
      this.canvas.height = image.height;
      this.initResolution(bbox);
    },

    // 通过imageData设置原始图片与对应范围
    setSourceImageData: function (data, bbox, size) {
      this.bbox = bbox;
      let width = size.width;
      let height = size.height;
      this.canvas.width = width;
      this.canvas.height = height;
      let imageData = this.context2D.createImageData(width, height);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let pixIndex1 = y * width + x;
          let pixIndex2 = pixIndex1;
          let index1 = pixIndex1 * 4;
          let index2 = pixIndex2 * 4;
          imageData.data[index2] = data[index1];
          imageData.data[index2 + 1] = data[index1 + 1];
          imageData.data[index2 + 2] = data[index1 + 2];
          imageData.data[index2 + 3] = data[index1 + 3];
        }
      }
      this.toImage(imageData).then(image=>{
        this.image = image;
        this.initResolution(bbox);
      });
    },
    // 图片分辨率
    initResolution(bbox) {
      this.resolution = {
        x: (bbox.xmax - bbox.xmin) / this.image.width,
        y: (bbox.ymax - bbox.ymin) / this.image.height,
      };
    },

    //轴向翻转
    /**
     *
     * @param {String} axis X,Y,XY
     */
    flipImageData(axis) {
      let width = this.image.width;
      let height = this.image.height;
      let oldData = this.context2D.getImageData(0, 0, width, height);
      let newData = this.context2D.createImageData(width, height);
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          let pixIndex1 = y * width + x;
          let pixIndex2 = this.flipIndex(axis, width, height, x, y);
          let index1 = pixIndex1 * 4;
          let index2 = pixIndex2 * 4;
          newData.data[index2] = oldData.data[index1];
          newData.data[index2 + 1] = oldData.data[index1 + 1];
          newData.data[index2 + 2] = oldData.data[index1 + 2];
          newData.data[index2 + 3] = oldData.data[index1 + 3];
        }
      }
      this.toImage(newData).then(image=>{
        this.image = image;
      });
    },
    // 计算翻转后的像素索引
    flipIndex(axis, width, height, x, y) {
      let newIndex;
      switch (axis) {
        case "X":
          newIndex = y * width + (width - 1 - x);
          break;
        case "Y":
          newIndex = (height - 1 - y) * width + x;
          break;
        case "XY":
          newIndex = (height - 1 - y) * width + (width - 1 - x);
          break;
        default:
          newIndex = y * width + x;
          break;
      }
      return newIndex;
    },

    /**
     * 重置地图风场范围
     * @param {地图四角坐标} bbox2
     */
    resize(bbox2) {
      let bbox = this.getCurrentBbox(this.bbox, bbox2);
      if (!bbox) {
        return;
      }
      let pixRange = this.getPixRange(bbox);
      this.rangeBbox = this.fixBbox(pixRange);
      this.canvas.width = pixRange.width;
      this.canvas.height = pixRange.height;
      this.cutImage(this.image, pixRange);
    },

    /**
     * 求两个四角坐标的交集
     * @param {图片四角坐标} bbox1
     * @param {地图四角坐标} bbox2
     */
    getCurrentBbox: function (bbox1, bbox2) {
      let bbox = {
        xmin: Math.max(bbox1.xmin, bbox2.xmin),
        ymin: Math.max(bbox1.ymin, bbox2.ymin),
        xmax: Math.min(bbox1.xmax, bbox2.xmax),
        ymax: Math.min(bbox1.ymax, bbox2.ymax),
      };

      if (bbox.xmin < bbox.xmax && bbox.ymin < bbox.ymax) {
        return bbox;
      }
    },
    /**
     * 图片裁剪范围
     * @param {Bounds} bbox 四角坐标相交范围
     * @return {} x,y,x2,y2是像素坐标序号，从0开始
     */
    getPixRange(bbox) {
      let pixRange = {
        x: Math.ceil((bbox.xmin - this.bbox.xmin) / this.resolution.x),
        y: Math.floor(-(bbox.ymax - this.bbox.ymax) / this.resolution.y),
        x2: Math.floor((bbox.xmax - this.bbox.xmin) / this.resolution.x),
        y2: Math.ceil(-(bbox.ymin - this.bbox.ymax) / this.resolution.y),
        width: 0,
        height: 0,
      };
      pixRange.width = pixRange.x2 - pixRange.x;
      pixRange.height = pixRange.y2 - pixRange.y;
      return pixRange;
    },
    /**
     * 根据图片像素范围修正bbox
     * @param {裁剪像素范围} pixRange
     */
    fixBbox: function (pixRange) {
      let bbox = {
        xmin: this.bbox.xmin + pixRange.x * this.resolution.x,
        ymin: this.bbox.ymax - pixRange.y2 * this.resolution.y,
        xmax: this.bbox.xmin + pixRange.x2 * this.resolution.x,
        ymax: this.bbox.ymax - pixRange.y * this.resolution.y,
      };
      return bbox;
    },

    /**
     * 根据像素范围坐标裁剪图片
     * @param {Image} image 被裁剪图片
     * @param {Object} pixRange 裁剪像素范围
     */
    cutImage: function (image, pixRange) {
      //https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/drawImage
      /* eslint-disable */
      // context.drawImage(image, pixRange.width, pixRange.height);
      // this.context2D.drawImage(image, pixRange.x, pixRange.y, pixRange.width, pixRange.height);
      this.context2D.drawImage(
        image,
        pixRange.x,
        pixRange.y,
        pixRange.width,
        pixRange.height,
        0,
        0,
        pixRange.width,
        pixRange.height
      );
      // let cutImageData = this.context2D.getImageData(0, 0, pixRange.width, pixRange.height);
      /* eslint-enable */
    },
    // 生成图片
    toImage(imageData) {
      this.context2D.putImageData(imageData, 0, 0);
      return new Promise(resolve=>{
        let image = new Image();
        image.onload = function(){
          resolve(image);
        }
        image.width = this.canvas.width;
        image.height = this.canvas.height;
        image.src = this.canvas.toDataURL();
      })
    },
    getImageData() {
      return this.context2D.getImageData(
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
    },
    //通过地理坐标获取像素值
    getColorByLngLat(lngLat) {
      let [pixelX, pixelY] = this.getCoordsByLngLat(lngLat);
      return this.getColorByXY(pixelX, pixelY);
    },

    // 通过地理坐标获取图片坐标
    getCoordsByLngLat(lngLat) {
      let pixelX = (lngLat.lng - this.bbox1._sw.lng) / this.resolution.x;
      let pixelY = (this.bbox1._ne.lat - lngLat.lat) / this.resolution.y;
      return [Math.floor(pixelX), Math.floor(pixelY)];
    },

    //通过图片坐标获取像素值
    getColorByXY(x, y) {
      return this.context2D.getImageData(x, y, 1, 1).data;
    },

    //生成色带
    /**
     *
     * @param {Object} colors {0.0: '#3288bd',1.0: '#d53e4f'}
     * @returns Uint8Array imageData
     */
    getColorRampData(colors) {
      // 使用同一个canvas会相互影像，暂时没找到完全清理上次绘制内容的方式
      let canvas = document.createElement("canvas");
      let context2D = this.canvas.getContext("2d");
      canvas.width = 256;
      canvas.height = 1;
      let gradient = context2D.createLinearGradient(0, 0, 256, 1);
      for (let stop in colors) {
        gradient.addColorStop(stop, colors[stop]);
      }
      context2D.fillStyle = gradient;
      context2D.fillRect(0, 0, 256, 1);
      let imageData = context2D.getImageData(0, 0, 256, 1);
      let data = new Uint8Array(imageData.data);
      return data;
    },

    test(bbox) {
      this.resize(bbox);
      this.showCutImage("img-now");
      /* map.on("wheel", () => {
        this.resize(map.getBounds());
        this.showCutImage("img-now");
      });
      map.on("dragstart", () => {
        this.resize(map.getBounds());
        this.showCutImage("img-now");
      });
      map.on("move", () => {
        this.resize(map.getBounds());
        this.showCutImage("img-now");
      }); */
    },
    showCutImage(id) {
      let img = new Image();
      img.src = this.canvas.toDataURL();
      window[id].innerHTML = "";
      window[id].append(img);
    },
  });
});
