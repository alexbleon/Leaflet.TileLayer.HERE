/* var map = L.map('...', { attributionControl: false }); */
L.control.attribution().addAttribution('©<span id="cHolderFixed"></span><span id="cHolder"></span>').addTo(map);

var insertCHolderFixed = document.getElementById('cHolderFixed');
var insertCHolder = document.getElementById('cHolder');

var reqCHolder = function(){
	var xmlhttp = new XMLHttpRequest();

	/* Copyright query url, based on the map used: 'aerial' for hybrid map */
	var url = "https://1.aerial.maps.cit.api.here.com/maptile/2.1/copyright/newest" +
		"?app_id={YOUR_APP_ID}" +
		"&app_code={YOUR_APP_CODE}";

	xmlhttp.onreadystatechange = function(){
		if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
			var jsonResult = JSON.parse(xmlhttp.responseText);
			matchBbox(jsonResult);
		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();

	var matchBbox = function(jsonResult){
		var rawCHolder = [], rawCHolderFixed = [], cHolder = [], cHolderFixed = [];

		/* jsonResult.hybrid */
		for(var f = 0; f < jsonResult.hybrid.length; f += 1){
			var cLabel = jsonResult.hybrid[f].label;
			var bbox = jsonResult.hybrid[f].boxes;
			var zoomMinLevel = jsonResult.hybrid[f].minLevel;

			if (!bbox && cLabel){
				rawCHolderFixed.push(' ' + cLabel);

				/* Remove duplicates */
				cHolderFixed = rawCHolderFixed.reduce(function(a, b){ if (a.indexOf(b) < 0){ a.push(b); } return a; }, []);

				/* If first, else add comma before: = "," + cHolderFixed; */
				insertCHolderFixed.textContent = cHolderFixed;
			}
			if (bbox && cLabel){
				for (var i = 0; i < bbox.length; i += 1){
					var box = bbox[i];
					var rawMapBounds = map.getBounds();
					var mapSouthWest = rawMapBounds.getSouthWest().wrap(), mapNorthEast = rawMapBounds.getNorthEast().wrap(),
					mapBounds = L.latLngBounds(mapSouthWest, mapNorthEast);
					var southWestBox = L.latLng(box[0], box[1]), northEastBox = L.latLng(box[2], box[3]),
					boundsBox = L.latLngBounds(southWestBox, northEastBox);
					if (mapBounds.intersects(boundsBox)){
						if (map.getZoom() >= zoomMinLevel){
							rawCHolder.push(' ' + cLabel);
							cHolder = rawCHolder.reduce(function(a, b){ if (a.indexOf(b) < 0){ a.push(b); } return a; }, []);
							insertCHolder.textContent = "," + cHolder + ".";
						} else {
							insertCHolder.textContent = ".";
						}
					}
				}
			} else {
				insertCHolder.textContent = ".";
			}
		}
	};
};
reqCHolder();
map.on('zoomend', reqCHolder);
map.on('moveend', reqCHolder);
