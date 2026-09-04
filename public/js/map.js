console.log(mapToken);
mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    center: [72.8478, 19.0178], // starting position [lng, lat]. Note that lat must be set between -90 and 90
    zoom: 11 // starting zoom
        
});
