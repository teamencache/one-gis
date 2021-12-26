var arrPostions = [120.13919415700002, 31.808708000000024, 120.13942716600002, 31.808770825000067, 120.13968986800012, 31.80880853700006, 120.14007963900008, 31.80884270100006, 120.14105179100011, 31.808907361000024, 120.141391311, 31.80890451700003, 120.14197946200011, 31.808838765000075, 120.14242265000007, 31.808817625000074, 120.14279916900011, 31.80881946900007, 120.1436897960001, 31.808847506000063, 120.1446076950001, 31.808839531000046, 120.1448237830001, 31.808851668000045, 120.14501972700009, 31.808876672000054, 120.14509564900004, 31.80889426600004, 120.14518050200002, 31.80892744600004, 120.14522784600001, 31.808957235000037, 120.14528867500007, 31.809012937000034, 120.14537500900008, 31.80914792200008, 120.14552769200009, 31.809456864000026, 120.14558195100005, 31.809527563000074, 120.14565098500009, 31.809584237000024, 120.14584443900003, 31.809697046000053, 120.1460636060001, 31.809809382000026, 120.14631022000003, 31.809915469000032, 120.14655415700008, 31.809988000000033, 120.1473930950001, 31.81071220800004, 120.14813929400009, 31.81124520700007, 120.14917483500005, 31.810986322000076];


function createPrimitives(scene) {
    rectangle = scene.primitives.add(new Cesium.Primitive({
        geometryInstances : new Cesium.GeometryInstance({
            geometry : new Cesium.RectangleGeometry({
                rectangle : Cesium.Rectangle.fromDegrees(-120.0, 20.0, -60.0, 40.0),
                vertexFormat : Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
            })
        }),
        appearance : new Cesium.EllipsoidSurfaceAppearance({
            aboveGround : false
        }),
        show:false
    }));

    worldRectangle = scene.primitives.add(new Cesium.Primitive({
        geometryInstances : new Cesium.GeometryInstance({
            geometry : new Cesium.RectangleGeometry({
                rectangle : Cesium.Rectangle.fromDegrees(-180.0, -90.0, 180.0, 90.0),
                vertexFormat : Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
            })
        }),
        appearance : new Cesium.EllipsoidSurfaceAppearance({
            aboveGround : false
        }),
        show : true
    }));

    polylinePrimitive = scene.primitives.add(new Cesium.Primitive({
        geometryInstances:new Cesium.GeometryInstance({
            geometry:new Cesium.PolylineGeometry({
                positions : Cesium.Cartesian3.fromDegreesArray(arrPostions),
                vertexFormat:Cesium.PolylineColorAppearance.VERTEX_FORMAT,
                //vertexFormat : Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,//对polyline无效
                width : 10.0
            })
        }),
        appearance : new Cesium.PolylineMaterialAppearance(),
        /* appearance : new Cesium.EllipsoidSurfaceAppearance({//对polyline无效
            aboveGround : false
        }), */
        show : true
    }));

    var polylines = scene.primitives.add(new Cesium.PolylineCollection());
    polyline = polylines.add({
        positions : Cesium.PolylinePipeline.generateCartesianArc({
            positions : Cesium.Cartesian3.fromDegreesArray([-110.0, 42.0,
                                                            -85.0, 36.0,
                                                            -100.0, 25.0,
                                                            -77.0, 12.0])
        }),
        width : 5.0,
        show : true
    });
}

function applyPolylineArrowMaterial(primitive, scene) {

    var material = Cesium.Material.fromType('PolylineArrow');
    primitive.material = material;
}

function applyPolylinePrimitiveMaterial(primitive, scene) {

    var material = Cesium.Material.fromType(Cesium.Material.PolylineDashType, {
        color: Cesium.Color.CYAN,  //线条颜色
        gapColor:Cesium.Color.TRANSPARENT, //间隔颜色
        dashLength:20  //短划线长度
    });
    primitive.appearance.material = material;
}

function applyWaterMaterial(primitive, scene) {

    primitive.appearance.material = new Cesium.Material({
        fabric : {
            type : 'Water',
            uniforms : {
                specularMap: 'images/earthspec1k.jpg',
                normalMap: 'images/waterNormals.jpg',//Cesium.buildModuleUrl(''),//定位到cesium引用路径下的目录中
                frequency: 10000.0,
                animationSpeed: 0.1,
                amplitude: 10
            }
        }
    });
}

var rectangle;
var worldRectangle;
var polylinePrimitive;
var polyline;
var scene = viewer.scene;
createPrimitives(scene);
applyWaterMaterial(worldRectangle,scene);

applyPolylineArrowMaterial(polyline, scene);

applyPolylinePrimitiveMaterial(polylinePrimitive, scene);
//applyWaterMaterial(polylinePrimitive, scene);


