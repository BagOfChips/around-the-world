
/**
 * Dark theme for map
 *  Deep warm oceans
 *  Grey / Green continents
 */
var mapColors = {
    sea: '#251d1b',
    seaText: '#c1bac9',
    seaTextStroke: '#251d1b',
    land: '#474c4e',
    parks: '#646a6f',
    countryText: '#c1bac9',
    countryTextStroke: '#251d1b',
    countryBorder: '#e7e3eb',
    provinceText: '#918c97',
    provinceTextStroke: '#251d1b',
    provinceBorder: '#e7e3eb'
};

var map;

/**
 * Initialize map and listeners
 */
function initMap(){
    map = new google.maps.Map(document.getElementById('map'), {
        // required
        center: {
            lat: 30.0,
            lng: 0.0
        },
        zoom: 3,

        // optional
        backgroundColor: mapColors.sea,
        disableDoubleClickZoom: true,
        maxZoom: 6,
        minZoom: 3,

        // hide clickables
        zoomControl: false,
        streetViewControl: false,
        scaleControl: false,
        fullscreenControl: false,
        mapTypeControl: false,

        // styling
        styles: [
            {
                elementType: 'geometry',
                stylers: [{color: mapColors.land}]
            }, {
                elementType: 'labels.text.stroke',
                stylers: [{color: mapColors.countryTextStroke}]
            }, {
                elementType: 'labels.text.fill',
                stylers: [{color: mapColors.countryText}] // show country labels
            }, {
                featureType: 'administrative.country',
                elementType: 'geometry.stroke',
                stylers: [{color: mapColors.countryBorder}] // show country borders
            }, {
                featureType: 'administrative.province',
                elementType: 'geometry.stroke',
                stylers: [{color: mapColors.provinceBorder}] // show province borders
            }, {
                featureType: 'administrative.locality',
                elementType: 'labels.text.fill',
                stylers: [{color: mapColors.provinceText}] // show province labels
            }, {
                featureType: 'adminstrative.locality',
                elementType: 'labels.text.stroke',
                stylers: [{color: mapColors.provinceTextStroke}] // show cities
            }, {
                featureType: 'poi.park',
                elementType: 'geometry',
                stylers: [{color: mapColors.parks}] // show parks
            }, {
                featureType: 'poi',
                elementType: 'labels.text',
                stylers: [{visibility: 'off'}] // hide park labels
            }, {
                featureType: 'poi.park',
                elementType: 'labels.text.fill',
                stylers: [{visibility: 'off'}]
            }, {
                featureType: 'road',
                elementType: 'geometry',
                stylers: [{visibility: 'off'}] // hide roads
            }, {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: [{visibility: 'off'}]
            }, {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: [{visibility: 'off'}] // hide road labels
            }, {
                featureType: 'road.highway',
                elementType: 'geometry',
                stylers: [{visibility: 'off'}]
            }, {
                featureType: 'transit',
                elementType: 'geometry',
                stylers: [{visibility: 'off'}] // hide transit
            }, {
                featureType: 'transit.station',
                elementType: 'labels.text.fill',
                stylers: [{visibility: 'off'}] // hide transit labels
            }, {
                featureType: 'water',
                elementType: 'geometry',
                stylers: [{color: mapColors.sea}] // show bodies of water
            }, {
                featureType: 'water',
                elementType: 'labels.text.fill',
                stylers: [{color: mapColors.seaText}] // show water labels
            }, {
                featureType: 'water',
                elementType: 'labels.text.stroke',
                stylers: [{color: mapColors.seaTextStroke}]
            }
        ]
    });

    /**
     * Prevent user from dragging outside of map
     *
     * Latitude values range from (-90 (SOUTH), 90 (NORTH))
     * Reset map scale and center if user drags out of bounds
     */
    map.addListener('drag', function(){
        var southLat = map.getBounds().getSouthWest().lat();
        var northLat = map.getBounds().getNorthEast().lat();

        if(southLat < -89 || northLat > 89){
            var newBounds = new google.maps.LatLngBounds(
                {lat: 80, lng: -170},
                {lat: -50, lng: 170}
            );
            map.fitBounds(newBounds);
        }
    });

    /**
     * Add marker on click
     */
    map.addListener('click', function(event){
        placeMarker(event.latLng);
    });
}

// array of markers
var markers = [];

// custom markers
var customMarkerA;
var customMarkerB;

// scaled marker sizes (original .svg file too big)
var markerSizes = {
    width: 36,
    height: 54
};

/**
 *
 * Warning: `$(window).load(function(){...});` deprecated
 *  Switch to `$(window).on('load', function(){...});`
 */
$(window).on('load', function(){
    var anchorCoordinates = [markerSizes.width / 1.7, markerSizes.height + 2];

    customMarkerA = {
        url: 'images/customMarkerA.svg',
        scaledSize: new google.maps.Size(markerSizes.width, markerSizes.height),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(anchorCoordinates[0], anchorCoordinates[1])
    };
    customMarkerB = {
        url: 'images/customMarkerB.svg',
        scaledSize: new google.maps.Size(markerSizes.width, markerSizes.height),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(anchorCoordinates[0], anchorCoordinates[1])
    };

    geocoder = new google.maps.Geocoder;

    instructionsTyped = new Typed('#instructions-text', {
        strings: [instructionSet.start],
        typeSpeed: 10,
        startDelay: 1200,
        showCursor: false
    });
});

function placeMarker(location){
    switch(markers.length){
        case 0:
            markers.push(new google.maps.Marker({
                position: location,
                map: map,
                draggable: false,
                animation: google.maps.Animation.BOUNCE,
                icon: customMarkerA
            }));

            markers[0].addListener('click', function(){
                toggleBounce(0);
            });

            processMarker(0);

            // implement reset button
            $("#reset").show().animate({
                opacity: 1
            }, 1000);

            break;
        case 1:
            markers.push(new google.maps.Marker({
                position: location,
                map: map,
                draggable: true,
                animation: google.maps.Animation.BOUNCE,
                icon: customMarkerB
            }));

            markers[1].addListener('click', function(){
                toggleBounce(1);
            });

            markers[1].addListener('dragstart', function(){
                processMarkerDrag(1);
            });

            markers[1].addListener('dragend', function(){
                processMarker(1);
            });

            processMarker(1);
            break;
        default:
            // markers.length == 2
            // Remove marker and add new marker
            markers[1].setMap(null);
            markers[1] = new google.maps.Marker({
                position: location,
                map: map,
                draggable: true,
                animation: google.maps.Animation.BOUNCE,
                icon: customMarkerB
            });
            markers[1].addListener('click', function(){
                toggleBounce(1);
            });

            markers[1].addListener('dragstart', function(){
                processMarkerDrag(1);
            });

            markers[1].addListener('dragend', function(){
                processMarker(1);
            });

            processMarker(1);
    }
}

/**
 * Marker is being dragged
 * Animate text
 *
 * @param markerId
 */
function processMarkerDrag(markerId){
    var nextInstruction;
    if(markerId === 0){
        nextInstruction = instructionSet.draggingMarkerA;
    }else{
        nextInstruction = instructionSet.draggingMarkerB;
    }

    instructionsTyped = new Typed('#instructions-text', {
        strings: ["", nextInstruction],
        typeSpeed: 10,
        backSpeed: 10,
        showCursor: false
    });
}

/**
 * Used to reset markers
 *
 * TODO: implement button(s)
 */
function clearAllMarkers(){
    for(var i = 0; i < markers.length; i++){
        markers[i].setMap(null);
    }

    markers = [];
}

/**
 * Toggle BOUNCE animation
 */
function toggleBounce(markerId){
    if(markers[markerId].getAnimation() !== null){
        markers[markerId].setAnimation(null);
    }else{
        markers[markerId].setAnimation(google.maps.Animation.BOUNCE);
    }
}

var instructionsTyped;

var instructionSet = {
    // flow
    start: 'Select your starting location',
    firstMarkerPlaced: 'Select your destination',
    secondMarkerPlaced: 'Processing both points',

    // error messages
    errorNoResults: 'Unknown area - select another location',

    // marker being dragged
    draggingMarkerA: 'Changing starting location',
    draggingMarkerB: 'Changing destination'
};

/**
 * Flow through instruction set
 *
 * @param markerId
 */
function processMarker(markerId){
    // first marker placed
    // get location
    reverseGeocode(markers[markerId].getPosition())
        .then(function(res){
            // location valid
            // animate next instruction `instructionSet.firstMarkerPlaced`
            var nextInstruction;
            if(markerId === 0){
                nextInstruction = instructionSet.firstMarkerPlaced;
            }else{
                nextInstruction = instructionSet.secondMarkerPlaced;
            }

            instructionsTyped = new Typed('#instructions-text', {
                strings: ["", nextInstruction],
                typeSpeed: 10,
                backSpeed: 10,
                showCursor: false
            });
        })
        .catch(function(err){
            // location invalid
            // unset and remove marker
            markers[markerId].setMap(null);
            markers[markerId] = null;
            markers.splice(markerId, 1); // remove element at index `markerId` from array

            // animate `instructionSet.errorNoResults`
            instructionsTyped = new Typed('#instructions-text', {
                strings: ["", instructionSet.errorNoResults],
                typeSpeed: 10,
                backSpeed: 10,
                showCursor: false
            });
        });
}


// geocoder for reverseGeocode
var geocoder;

/**
 * Given a LatLng object, find a corresponding formatted text address
 *
 * @param latLngCoordinates
 */
function reverseGeocode(latLngCoordinates){
    return new Promise(function(resolve, reject){
        geocoder.geocode({'location': latLngCoordinates}, function(res, status){
            if(status === 'OK'){
                var addressIndex = checkAddressTypes(res);
                if(addressIndex !== -1){
                    resolve({
                        status: addressIndex,
                        types: res[addressIndex].types,
                        message: res[addressIndex].formatted_address
                    });
                }else{
                    reject(new Error('Geocoder failed due to ZERO_RESULTS'));
                }
            }else{
                reject(new Error('Geocoder failed due to ' + status));
            }
        });
    });
}

/**
 * Each object in `results[]` stores a `types[]`
 * We want the first found `i` such that
 *  `results[i].types` matches with some `reverseGeocodeTypePriorities[j]`
 *
 * @param results
 */
function checkAddressTypes(results){
    for(var i = 0; i < results.length; i++){
        for(var j = 0; j < reverseGeocodeTypePriorities.length; j++){
            if(checkArraysEqual(results[i].types, reverseGeocodeTypePriorities[j])){
                return i;
            }
        }
    }

    return -1; // not found
}

/**
 * Checks if 2 arrays are equal
 *
 * @param array1
 * @param array2
 * @returns {boolean}
 */
function checkArraysEqual(array1, array2){
    if(array1.length !== array2.length){
        return false;
    }
    for(var i = 0; i < array1.length; i++){
        if(array1[i] !== array2[i]){
            return false;
        }
    }
    return true;
}


var reverseGeocodeTypePriorities = [
    ["locality", "political"], // Richmond BC Canada
    ["administrative_area_level_3", "political"],
    ["administrative_area_level_2", "political"], // Greater Vancouver BC Canada
    ["political"], // Vancouver Metro Area BC Canada
    ["administrative_area_level_1", "political"], // BC Canada
    ["country", "political"] // Canada
];


