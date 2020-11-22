init();
function init(){
    let height = map.clientHeight;
    let width = map.clientWidth;
    geoData(rings=>{
        let projection = d3.geoProjection();
        projection.fitExtent(
            [
              [0, 0],
              [width, height]
            ],
            nodes
          );
          let path = d3.geoPath(projection);
          //绘图
          let polygonNode = svg
            .selectAll("path")
            .data(nodes.features)
            .enter()
            .append("path")
            .attr("d", path);
    })
}


function geoData(callback) {
    let url = "../data/water_SNST.json";
    url = '../data/AllProvinces.json';
  $.getJSON(url, function(res) {
    let rings = res.features[0].geometry.rings;
    callback(rings)
  });
}
function LonLat2Mercator(X, Y) {
  let coord = [];
  let x = (X * 20037508.34) / 180;
  let y = Math.Log(Math.Tan(((90 + Y) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  coord[0] = x;
  coord[1] = y;
  return coord;
}
function Mercator2LonLat(X, Y) {
  let coord = new double[2]();
  let x = (X / 20037508.34) * 180;
  let y = (Y / 20037508.34) * 180;
  y =
    (180 / Math.PI) *
    (2 * Math.Atan(Math.Exp((y * Math.PI) / 180)) - Math.PI / 2);
  coord[0] = x;
  coord[1] = y;
  return coord;
}

function drawGeo() {
    let projection = d3.geoProjection();
}

function drawMercator_bak(nodes) {
  //墨卡托坐标系
  let projection = d3.geoMercator();
  //坐标映射
  projection.fitExtent(
    [
      [0, 0],
      [containerWidth, containerHeight]
    ],
    nodes
  );
  let path = d3.geoPath(projection);
  //绘图
  let polygonNode = svg
    .selectAll("path")
    .data(nodes.features)
    .enter()
    .append("path")
    .attr("d", path);
}
function demo(){


   var width = 1300; 
   var height = 1000;  
   var padding = 20;
   var g = d3.select('svg')
           .attr('width',width) 
           .attr('height',height) 
           .append('g'); 
   var root; 
   var projection,path;
   function color(i) {  return '#0e2338';    } 

   d3.json('china.json',function (data) { 
       root = data; 
       //设置投影 
       projection = d3.geoMercator()
       projection.fitExtent([[padding,padding],[width-padding*2,height-padding*2]],root);
       //projection.fitSize([width,height],root);
       //生成地理路径
       path = d3.geoPath(projection);
       update();
   }); 

   function update() { 
       g.selectAll("path") 
               .data(root.features)
               .enter() 
               .append("path")
               .attr("stroke","#234060") 
               .attr("stroke-width",1)
               .attr("fill", function(d,i){ 
                   return color(i);  
               })
              .attr("d", path )   //使用地理路径生成器
              .on("mouseover",function(d,i){
                    d3.select(this) 
                           .attr("fill","green");  
              }) 
              .on("mouseout",function(d,i){ 
                   d3.select(this)
                            .attr("fill",color(i));  
              }); 
       g.selectAll("text") 
               .data(root.features)
               .enter()
               .append("text")
               .attr("text-anchor","middle") 
               .attr("dy",".3em") 
               .attr("fill", "#eee") 
               .style("font-size", "10px") 
               .text(function (d) { 
                   return d.properties.name; 
               })
               .attr("transform", function (d) { 
                   return "translate("+projection(d.properties.cp).join(',')+")"; 
               }); 
   }
}
