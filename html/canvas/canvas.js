function myCanvas(option) {
    this.option = option;
    this.init();
}

myCanvas.prototype = {
    constructor: myCanvas,
    init: function () {
        if (this.element) {
            return this.element;
        }
        let element = document.createElement('canvas');
        element.height = this.option.border.width;
        element.width = this.option.border.height;
        element.className = this.option.className;
        document.body.appendChild(element);
        this.element = element;
        this.ctx = element.getContext(this.option.context);
        //生成图片
        let image = document.createElement('img');
        image.id = this.option.imageId;
        image.style.width = "200px";
        image.style.height = "200px";
        document.body.appendChild(image);
        this.image = image;
        return this.element
    },
    test: function () {
        let ctx = this.element.getContext('2d', {
            apha: true
        });
        // Set line width
        ctx.lineWidth = 10;

        // Wall
        ctx.strokeRect(75, 140, 150, 110);

        // Door
        ctx.fillRect(130, 190, 40, 60);

        // Roof
        ctx.beginPath();
        ctx.moveTo(50, 140);
        ctx.lineTo(150, 60);
        ctx.lineTo(250, 140);
        ctx.closePath();
        ctx.stroke();
    },
    rect: function () {
        let ctx = this.element.getContext('2d');
        ctx.clearRect(85, 120, 90, 250);
        // ctx.fillRect(85, 120, 90, 250);
        // ctx.strokeRect(85, 120, 90, 250);
    },
    // 逐像素渲染
    //this.ctx = CanvasRenderingContext2D
    radialGradientByPix: function () {
        let width = 200;
        let height = 200;
        let imageData = this.ctx.createImageData(width, height);
        for (let h = 0; h < height; h++) {
            for (let w = 0; w < width; w++) {
                let index = h * width + w;
                let distance = Math.sqrt((h - height / 2) * (h - height / 2) + (w - width / 2) * (w - width / 2));
                let dat = Math.abs(Math.sin(distance / height));
                let chanel = dat * 255;
                imageData.data[4 * index] = 255;
                imageData.data[4 * index + 1] = 0;
                imageData.data[4 * index + 2] = 0;
                imageData.data[4 * index + 3] = chanel;
            }

        }
        this.ctx.putImageData(imageData, 0, 0, 50, 50, width, height);
    },
    // 渐变渲染
    radialGradient: function () {
        let border = this.option.border;
        let radialGradient = this.ctx.createRadialGradient(border.width / 2, border.height / 2, border.width / 2, border.width / 2, border.height / 2, 0);
        radialGradient.addColorStop(0, 'rgba(255, 0, 0, 0)');
        radialGradient.addColorStop(0.1, 'rgba(0, 0, 255, 0)');
        radialGradient.addColorStop(0.3, 'rgba(0, 0, 255, 1)');
        radialGradient.addColorStop(0.6, 'rgba( 0, 255, 0, 1)');
        radialGradient.addColorStop(0.8, 'rgba( 255, 0, 0, 1)');
        radialGradient.addColorStop(1, 'rgba(255, 0, 0, 1)');
        this.ctx.fillStyle = radialGradient;
        this.ctx.fillRect(0, 0, border.width, border.height);
    },
    // 生成图片
    updateImage: function () {
        this.image.src = this.element.toDataURL();
    },
    // 解析图片
    analyseImage: function () {

    }

};

let myElement = new myCanvas({
    ele: 'canvas',
    className: 'myCanvas',
    border: { width: 500, height: 500 },
    context: '2d',
    imageId: 'canvasResult'
});
// myElement.test();