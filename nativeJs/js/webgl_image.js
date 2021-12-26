(function main(global) {
    let jsonHeader, jsonData;
    let canvas,img;
    $.getJSON('/one-gis/data/2021030415_AQI.json',function(res,status) {
        if(status !== 'success'){
            console.log('load failed');
        }
        jsonHeader = res[0].header;
        jsonData = res[0].data;
        let eleOption = {
            type:'canvas',
            attr:{
                width:jsonHeader.nx,//不能加px
                height:jsonHeader.ny,
            },
            appendTo:window.document.body
        };
        canvas = createElement(eleOption);
        // fill();
        drawImage();
        img = createElement({
            type:'img',
            attr:{
                src:canvas.toDataURL()
            },
            appendTo:window.document.body
        })
    });

    function drawImage(){
        let colorOption = getColorOption();
        let context = canvas.getContext('2d');
        let imageData = context.createImageData(jsonHeader.nx,jsonHeader.ny);
        for (let x = 0; x < jsonHeader.nx; x++) {
            for (let y = 0; y < jsonHeader.ny; y++) {
                let pixIndex = x*jsonHeader.ny + y;
                let colorIndex = pixIndex * 4;
                let value = jsonData[pixIndex];
                let rgba = colorOption.getColorByValue(value);
                imageData.data[colorIndex] = rgba[0];
                imageData.data[colorIndex + 1] = rgba[1];
                imageData.data[colorIndex + 2] = rgba[2];
                imageData.data[colorIndex + 3] = rgba[3];
            }
        }
        context.putImageData(imageData, 0, 0);
        let legendImage = colorOption.getLegendImage();
        document.body.append(legendImage);

    }

    function getColorOption() {
        return {
            valueRange:[0,300],//取值范围
            segementNum:10,//颜色插值个数
            opacity:[0,255,255],//[小于范围最小值,范围内,大于范围最小值]
            colorStop:[//色带颜色
                [0, 0, 210],
                [122, 255, 125],
                [128, 0, 0]
            ],
            renderType:'clamp',//smooth
            legend:[],
            getOpacity(value){
                let opacity = this.opacity[1];
                if(value<=this.valueRange[0]){
                    opacity = this.opacity[0];
                }
                if(value >=this.valueRange[1]){
                    opacity = this.opacity[2];
                }
                return opacity;
            },
            getColorByValue(value){
                let colorIndex = this.colorStop.length * (value-this.valueRange[0])/(this.valueRange[1] - this.valueRange[0])
                let colorBeginIndex = Math.max(Math.floor(colorIndex),0);
                let colorEndIndex = Math.min(Math.ceil(colorIndex), this.colorStop.length-1);
                let color = this.getSegementColor(this.colorStop[colorBeginIndex], this.colorStop[colorEndIndex], colorIndex-colorBeginIndex);
                let opacity = this.getOpacity(value);
                color.push(opacity);
                return color;
            },
            getSegementColor(beginColor, endColor, rate){
                let rgb = [
                    endColor[0]-beginColor[0],
                    endColor[1]-beginColor[1],
                    endColor[2]-beginColor[2],
                ];

                rate = Math.floor(rate * this.segementNum)/this.segementNum;

                rgb = [
                    Math.floor(rgb[0] * rate +beginColor[0]),
                    Math.floor(rgb[1] * rate +beginColor[1]),
                    Math.floor(rgb[2] * rate +beginColor[2]),
                ]
                return rgb
            },
            getLegendImage(){
                let legendCanvas = createElement({
                    type:'canvas',
                    attr:{
                        height:30,
                        width:40 * this.colorStop.length
                    },
                    // appendTo:window.document.body
                });
                let context = legendCanvas.getContext('2d');
                switch (this.renderType) {
                    case 'smooth':
                        let gradient = context.createLinearGradient(0,0,legendCanvas.width, 0);
                        for (let index = 0; index < this.colorStop.length; index++) {
                            const color = this.colorStop[index];
                            gradient.addColorStop((index+1)*40/legendCanvas.width, 'rgb('+ color.join(',') +')')
                        }
                        context.fillStyle = gradient;
                        context.fillRect(0,0,legendCanvas.width,legendCanvas.height);
                        break;
                
                    case 'clamp':
                        for (let index = 0; index < this.colorStop.length; index++) {
                            const color = this.colorStop[index];
                            context.fillStyle = 'rgb('+ color.join(',') +')';
                            context.fillRect(index*40,0,40,30)
                        } 
                        break;
                }
                let legendImage = new Image();
                legendImage.src = legendCanvas.toDataURL();
                return legendImage;
            }
        }
    }

    function fill(){
        let context = canvas.getContext('2d');
        context.fillStyle='red';
        context.fillRect(0,0, 100,100);

        context.rect(100,0, 100,100);
        context.fillStyle = 'blue';
        context.fill();

        let gradient = context.createLinearGradient(200,0,300,0);
        gradient.addColorStop(0,'green');
        gradient.addColorStop(0.5,'yellow');
        gradient.addColorStop(1, 'lightgreen');
        context.fillStyle = gradient;
        context.fillRect(200,0,100,100);
        
        gradient = context.createRadialGradient(350,50,0,350,50,50);
        gradient.addColorStop(0,'green');
        gradient.addColorStop(0.5,'yellow');
        gradient.addColorStop(0.9, 'red');
        context.fillStyle = gradient;
        context.fillRect(300,0,100,100);

        context.translate(450,50);
        gradient = context.createRadialGradient(0,0,0,0,0,50);
        gradient.addColorStop(0,'green');
        gradient.addColorStop(0.9,'yellow');
        context.fillStyle = gradient;
        context.fillRect(-50,-50,100,100);
        context.restore();
    }

    function createElement(eleOption){
        let ele = document.createElement(eleOption.type);
        if(eleOption.attr){
            Object.assign(ele, eleOption.attr);
        }
        if(eleOption.style){
            Object.assign(ele.style, eleOption.style);
        }
        if(eleOption.appendTo){
            return eleOption.appendTo.appendChild(ele);
        }else{
            return ele;
        }
    }
})(window)