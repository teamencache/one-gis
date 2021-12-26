
function initGeoJSON(){
    var url = './data/CZ_SY_Rivers.json';
    var height = 25;
    //cesium支持topojson,GEOjson和普通的json格式,方式各不相同
    $.getJSON(url, function(jsonData) {
        for (var i =0 ;i<jsonData.features.length; i++) {
            var ifeature=jsonData.features[i];
            var coords = ifeature.geometry.paths[0];
            var arrPositions=[];
            if(i>0){
                break;
            }
            for (var k = 0;k<coords.length; k++) {
                var coord = coords[k];
                arrPositions.push(coord[0]);
                arrPositions.push(coord[1]);
                arrPositions.push(height);
            }
            if(arrPositions.length ==0){
                continue;
            }
            river = viewer.entities.add({
                name: 'PolylineTrail' + i,
                polyline: {
                    positions: Cesium.Cartesian3.fromDegreesArrayHeights(arrPositions),
                    width: 15,
                    material: new Cesium.PolylineTrailLinkMaterialProperty(Cesium.Color.ORANGE, 3000)
                }
            });
        };
        
        
        viewer.flyTo(river,{
            duration:5
        });
    });
}

var river;
initGeoJSON();

