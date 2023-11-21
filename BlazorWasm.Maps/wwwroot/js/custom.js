window.loadMap = function (data, dotNetHelper) {
    console.log(data);
    console.log(dotNetHelper);
    mapboxgl.accessToken = 'pk.eyJ1Ijoic2Fubmx5bm5odHVuLWRldiIsImEiOiJjbG9ia2FoeGkwY25iMmpvNGJ4MDUyY3ZlIn0.FpDwK1yUPLSg_FPnLe_uzQ';
    const geojson = JSON.parse(data);

    const map = new mapboxgl.Map({
        container: 'map',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
        style: 'mapbox://styles/mapbox/streets-v11',
        // style: 'mapbox://styles/mapbox/dark-v11',
        center: [94.905, 21.160],
        zoom: 13
    });

    let geojsonLatLongList = [];

    var count = 0;
    // Add markers to the map.
    for (const marker of geojson) {
        if (marker.Longitude == 0 || marker.Latitude == 0) continue;

        // Create a DOM element for each marker.
        const el = document.createElement('div');
        const width = 40;
        const height = 40;
        el.className = 'marker';
        el.style.backgroundImage = `url(images/pagoda.png)`;
        el.style.width = `${width}px`;
        el.style.height = `${height}px`;
        el.style.backgroundSize = '100%';
        el.innerHTML = `
        <span style="position: absolute; margin-top: -28px; width: 200px;">
            <span class="badge text-bg-primary">
                ${++count}
            </span>
            ${marker.PagodaMmName}
        </span>`;

        //const makerId = marker.Id;
        //console.log({ count, makerId });

        el.addEventListener('click', () => {
            console.log(marker.PagodaMmName);
            dotNetHelper.invokeMethodAsync('Detail', marker.Id);
        });

        let coordinates = [];
        coordinates.push(marker.Longitude);
        coordinates.push(marker.Latitude);
        // Add markers to the map.
        new mapboxgl.Marker(el)
            .setLngLat(coordinates)
            .addTo(map);

        let geojsonLatLong1 = [];
        geojsonLatLong1.push(marker.Longitude);
        geojsonLatLong1.push(marker.Latitude);

        geojsonLatLongList.push(geojsonLatLong1);
    }

    console.log("lat long list");
    console.log(geojsonLatLongList);

    map.on('load', function () {
        //let geojsonLatLong1 = [];
        //geojsonLatLong1.push(geojson[0].Longitude);
        //geojsonLatLong1.push(geojson[0].Latitude);

        //let geojsonLatLong2 = [];
        //geojsonLatLong2.push(geojson[1].Longitude);
        //geojsonLatLong2.push(geojson[1].Latitude);

        const geojson2 = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'type': 'Feature',
                    'geometry': {
                        'type': 'LineString',
                        'coordinates': geojsonLatLongList
                        //'coordinates': [
                        //    geojsonLatLongList
                        //    //geojsonLatLong1,
                        //    //geojsonLatLong2,
                        //    // Add more coordinates as needed
                        //]
                    }
                },
                // Add more features as needed
            ]
        };

        map.addSource('LineString', {
            'type': 'geojson',
            'data': geojson2
        });

        map.addLayer({
            'id': 'LineString',
            'type': 'line',
            'source': 'LineString',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#BF93E4',
                'line-width': 5
            }
        });
    });
}