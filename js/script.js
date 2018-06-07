// Map Variable.
var map;

// Styles array to formate the map design
var styles = [];

var locations = [
    { title: 'Googleplex', location: { lat: 37.4154126, lng: -122.0871518 } },
    { title: 'NASA Ames Research Center', location: { lat: 37.4037799, lng: -122.1057486 } },
    { title: 'Computer History Museum', location: { lat: 37.4154126, lng: -122.0871518 } },
    { title: 'In-N-Out Burger', location: { lat: 37.4174795, lng: -122.0864403 } },
    { title: 'Shoreline Lake Boathouse', location: { lat: 37.4239477, lng: -122.112866 } }
];

var marker = function (data) {
    this.title = ko.observable(data.title);
    this.location = ko.observableArray([data.location.lat, data.location.lng]);
};

var viewModel = function () {
    var self = this;
    this.locationsList = ko.observableArray([]);

    // Add a marker for each location listed.
    locations.forEach(function (locationItem) {
        self.locationsList.push(new marker(locationItem));
    });

    this.currentLocation = ko.observable(this.locationsList()[0]);


};

ko.applyBindings(new viewModel());


function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        // Mountain View California
        center: { lat: 37.4133865, lng: -122.1162864 },
        zoom: 13,
        styles, styles, mapTypeControl: false
    });

    var largeInfowindow = new google.maps.InfoWindow();


}