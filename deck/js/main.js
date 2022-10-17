mapboxgl.accessToken =
  "pk.eyJ1IjoidGVhbWVuY2FjaGUiLCJhIjoiY2txZzcxa2NrMHB4eTJ1bnphem9lazZrYiJ9.bQ9wCbRR64Iaxgk4-l2JCw";
let map = new mapboxgl.Map({
  container: "container",
  zoom: 3,
  center: { lat: 36.794095869900445, lng: 102.77435484147946 },
  style: "mapbox://styles/mapbox/light-v10",
  antialias: true, // create the gl context with MSAA antialiasing, so custom layers are antialiased
});


let myScatterplotLayer = new deck.MapboxLayer({
  id: 'my-scatterplot',
  type: deck.ScatterplotLayer,
  data: [
      {position: [102.7, 36.79], size: 100000}
  ],
  getPosition: d => d.position,
  getRadius: d => d.size,
  getColor: [255, 0, 0]
});

class MyMapboxLayer extends deck.MapboxLayer{
  constructor(props){
    super(props)
  }
}
let layer = new MyMapboxLayer({
  id:'dys'
});


// wait for map to be ready
map.on('load', () => {
  // add to mapbox
  map.addLayer(myScatterplotLayer);

  // update the layer
  myScatterplotLayer.setProps({
    getColor: [255, 0, 0]
  });
})
