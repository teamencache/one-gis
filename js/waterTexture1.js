function PolylineTrailLinkMaterialProperty(color, duration) {
    this._definitionChanged = new Cesium.Event();
    this._color = undefined;
    this._colorSubscription = undefined;
    this.color = color;
    this.duration = duration;
    this._time = (new Date()).getTime();
}
Cesium.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
    isConstant: {
        get: function () {
            return false;
        }
    },
    definitionChanged: {
        get: function () {
            return this._definitionChanged;
        }
    },
    color: Cesium.createPropertyDescriptor('color')
});
PolylineTrailLinkMaterialProperty.prototype.getType = function (time) {
    return 'PolylineTrailLink';
}
PolylineTrailLinkMaterialProperty.prototype.getValue = function (time, result) {
    if (!Cesium.defined(result)) {
        result = {};
    }
    result.color = Cesium.Property.getValueOrClonedDefault(this._color, time, Cesium.Color.WHITE, result.color);
    result.image = Cesium.Material.PolylineTrailLinkImage;
    result.time = (((new Date()).getTime() - this._time) % this.duration) / this.duration;
    return result;
}
PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
    return this === other ||
        (other instanceof PolylineTrailLinkMaterialProperty &&
          Property.equals(this._color, other._color))
}
Cesium.PolylineTrailLinkMaterialProperty = PolylineTrailLinkMaterialProperty;
Cesium.Material.PolylineTrailLinkType = 'PolylineTrailLink';
Cesium.Material.PolylineTrailLinkImage = "./images/color.png";
Cesium.Material.PolylineTrailLinkSource = "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
                                              {\n\
                                                   czm_material material = czm_getDefaultMaterial(materialInput);\n\
                                                   vec2 st = materialInput.st;\n\
                                                   vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
                                                   material.alpha = colorImage.a * color.a;\n\
                                                   material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                                                   return material;\n\
                                               }";
Cesium.Material._materialCache.addMaterial(Cesium.Material.PolylineTrailLinkType, {
    fabric: {
        type: Cesium.Material.PolylineTrailLinkType,
        uniforms: {
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
            image: Cesium.Material.PolylineTrailLinkImage,
            time: 0
        },
        source: Cesium.Material.PolylineTrailLinkSource
    },
    translucent: function (material) {
        return true;
    }
});


function initGeoJSON(){
    var url = './data/CZ_SY_Rivers.json';
    //cesium支持topojson,GEOjson和普通的json格式,方式各不相同
    $.getJSON(url, function(jsonData) {
        for (var i =0 ;i<jsonData.features.length; i++) {
            var ifeature=jsonData.features[i];
            var coords = ifeature.geometry.paths[0];
            var arrPositions=[];
            
            for (var k = 0;k<coords.length; k++) {
                if (coords[k].length==2) {
                    var coord = coords[k];
                    arrPositions.push(coord[0]);
                    arrPositions.push(coord[1]);
                    arrPositions.push(25);
                }/* else{
                    arrPositions = ifeature.geometry.paths[0][k];

                }; */
            }
            if(arrPositions.length ==0){
                continue;
            }
            viewer.entities.add({
                name: 'PolylineTrail' + i,
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(arrPositions),
                    width: 15,
                    material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.ORANGE, 3000)
                }
            });
            /* viewer.entities.add({
                position : Cesium.Cartesian3.fromDegrees(arrPositions),
            }) */
        }           
    });
}

// initGeoJSON();

var arrPositions = [120.13919415700002, 31.808708000000024, 120.13942716600002, 31.808770825000067, 120.13968986800012, 31.80880853700006, 2500,120.14007963900008, 31.80884270100006, 2500,120.14105179100011, 31.808907361000024, 120.141391311, 31.80890451700003, 2500,120.14197946200011, 31.808838765000075, 120.14242265000007, 31.808817625000074, 120.14279916900011, 31.80881946900007, 2500,120.1436897960001, 31.808847506000063, 120.1446076950001, 31.808839531000046, 120.1448237830001, 31.808851668000045, 120.14501972700009, 31.808876672000054, 120.14509564900004, 31.80889426600004, 2500,120.14518050200002, 31.80892744600004, 2500,120.14522784600001, 31.808957235000037, 120.14528867500007, 31.809012937000034, 120.14537500900008, 31.80914792200008, 2500,120.14552769200009, 31.809456864000026, 120.14558195100005, 31.809527563000074, 120.14565098500009, 31.809584237000024, 120.14584443900003, 31.809697046000053, 120.1460636060001, 31.809809382000026, 120.14631022000003, 31.809915469000032, 120.14655415700008, 31.809988000000033, 120.1473930950001, 31.81071220800004, 2500,120.14813929400009, 31.81124520700007, 2500,120.14917483500005, 31.810986322000076];
//arrPositions = [120.13919415700002, 31.808708000000024,25, 120.13942716600002, 31.808770825000067,25, 120.13968986800012, 31.80880853700006, 2500,120.14007963900008, 31.80884270100006, 2500,120.14105179100011, 31.808907361000024,25, 120.141391311, 31.80890451700003, 2500,120.14197946200011, 31.808838765000075,25, 120.14242265000007, 31.808817625000074,25, 120.14279916900011, 31.80881946900007, 2500,120.1436897960001, 31.808847506000063,25, 120.1446076950001, 31.808839531000046,25, 120.1448237830001, 31.808851668000045,25, 120.14501972700009, 31.808876672000054,25, 120.14509564900004, 31.80889426600004, 2500,120.14518050200002, 31.80892744600004, 2500,120.14522784600001, 31.808957235000037,25, 120.14528867500007, 31.809012937000034,25, 120.14537500900008, 31.80914792200008, 2500,120.14552769200009, 31.809456864000026,25, 120.14558195100005, 31.809527563000074,25, 120.14565098500009, 31.809584237000024,25, 120.14584443900003, 31.809697046000053,25, 120.1460636060001, 31.809809382000026,25, 120.14631022000003, 31.809915469000032,25, 120.14655415700008, 31.809988000000033,25, 120.1473930950001, 31.81071220800004, 2500,120.14813929400009, 31.81124520700007, 2500,120.14917483500005, 31.810986322000076,25];

var river = viewer.entities.add({
    name: 'PolylineTrail',
    polyline: {
        //positions: Cesium.Cartesian3.fromDegreesArrayHeights(arrPositions),
        positions: Cesium.Cartesian3.fromDegreesArray(arrPositions),
        width: 15,
        material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.ORANGE, 3000)
    }
});

viewer.flyTo(river);

