// Map Variable.
var map;
var largeInfowindow;
// Styles array to formate the map design
var styles = [];

var locations = [
    { title: 'Googleplex', location: { lat: 37.4220, lng: -122.0841 } },
    { title: 'NASA Ames Research Center', location: { lat: 37.4037799, lng: -122.1057486 } },
    { title: 'Computer History Museum', location: { lat: 37.4154126, lng: -122.0871518 } },
    { title: 'In-N-Out Burger', location: { lat: 37.4174795, lng: -122.0864403 } },
    { title: 'Shoreline Lake Boathouse', location: { lat: 37.4239477, lng: -122.112866 } }
];


var markers = function (data) {
    var self = this;

    this.title = ko.observable(data.title);
    this.location = ko.observable(data.location);
    this.lat = ko.observable(data.lat);
    this.lng = ko.observable(data.lng);
    // Empty string observable to store the address in later
    this.address = ko.observable('');

    // Create Markers with the given data
    var marker = new google.maps.Marker({
        title: self.title(),
        position: self.location(),
        map: map
    });
};


var ViewModel = function () {
    var self = this;
    
    this.locationsList = ko.observableArray([]);

    locations.forEach(function (item) {
        self.locationsList.push(new markers(item));
    });

    this.query = ko.observable('');

    
};

var showInfo = function (marker) {
    var self = this;

    // Checks if old info window was open and closes it if it was
    if (largeInfowindow) {
        largeInfowindow.close();
    }

    // Basic info to show in infowindow for now
    var info = '<div id="InfoWindowContent"></div>' + marker.title + '<br' + marker.location;
    largeInfowindow = new google.maps.InfoWindow({ content: info });

    // Loads the infowindow on the map at the marker
    largeInfowindow.open(map, marker);
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        // Mountain View California
        center: { lat: 37.4133865, lng: -122.1162864 },
        zoom: 13,
        styles, styles,
        mapTypeControl: false
    });

    ko.applyBindings(new ViewModel());
};
