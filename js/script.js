// Map Variable.
var map;
var largeInfowindow;
// Styles array to formate the map design
var styles = [];

// Locations list for some of the Mountain View places
var locations = [
    { title: 'Googleplex', location: { lat: 37.4220, lng: -122.0841 } },
    { title: 'NASA Ames Research Center', location: { lat: 37.4037799, lng: -122.1057486 } },
    { title: 'Computer History Museum', location: { lat: 37.4154126, lng: -122.0871518 } },
    { title: 'In-N-Out Burger', location: { lat: 37.4174795, lng: -122.0864403 } },
    { title: 'Shoreline Lake Boathouse', location: { lat: 37.4135125, lng: -122.1162864 } },
    { title: 'Bubb Park', location: { lat: 37.4239477, lng: -122.112866 } },
    { title: 'Burger King', location: { lat: 37.379408, lng: -122.0814392 } },
    { title: 'McKelvey Ball Park', location: { lat: 37.4135125, lng: -122.1162864 } },
    { title: 'Marymeade Park', location: { lat: 37.3779178, lng: -122.1222946 } },
    { title: 'The Habit Burger Grill', location: { lat: 37.379408, lng: -122.0814392 } },
    { title: 'Magnolia Park', location: { lat: 37.3779178, lng: -122.1222946 } },
    { title: 'Cornelis Bol Park', location: { lat: 37.381328, lng: -122.1370574 } },
    { title: 'Boardwalk Fries Burgers Shakes', location: { lat: 37.379408, lng: -122.0814392 } },
    { title: 'Umami Burger Palo Alto', location: { lat: 37.4111842, lng: -122.097747 } }
];


var markers = function (locationItem) {
    var self = this;

    this.title = ko.observable(locationItem.title);
    this.location = ko.observable(locationItem.location);
    this.lat = ko.observable(locationItem.lat);
    this.lng = ko.observable(locationItem.lng);

    // Create Markers with the given data
    var marker = new google.maps.Marker({
        title: self.title(),
        position: self.location(),
        map: map
    });

    // Listener for when clicked to open info window
    marker.addListener('click', function () {
        showInfo(this, largeInfowindow);
    });
    self.marker = marker;
};


var ViewModel = function () {
    var self = this;

    // Create a observableArray to store the location's markers
    this.locationsList = ko.observableArray([]);

    // Store each of the locations as markers on the LocationsList
    locations.forEach(function (locationItem) {
        self.locationsList.push(new markers(locationItem));
    });

    // Empty obserbable string to store the filter query string
    this.query = ko.observable('');

    // Filter the locationsList according to the text typed in the Filter box
    this.filteredResult = ko.computed(function () {
        // Changes query to lowercase because case sensitive comparisons
        var filter = self.query().toLowerCase();

        // Check if there is no text in the filter and returns full list if query is empty
        if (!self.query()) {
            ko.utils.arrayForEach(self.locationsList(), function (item) {
                if (item.marker) {
                    item.marker.setVisible(true);
                }
            });
            return self.locationsList();
        } else {
            // Returns items in locationsList that contain the query request
            return ko.utils.arrayFilter(self.locationsList(), function (item) {
                // Lowercase of the location title for case sensitivity
                var titleLower = item.title().toLowerCase();
                // Store the LocationsList titles that contain the filter value
                var filtered = (titleLower.search(filter) >= 0)
                if (item.marker) {
                    item.marker.setVisible(filtered);
                }
                return filtered;
            })
        }
    });

};


var showInfo = function (marker) {
    var self = this;

    // Checks if old info window was open and closes it if it was
    if (largeInfowindow) {
        largeInfowindow.close();
    }

    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    
    function getStreetView(data, status) {
        if (status == google.maps.StreetViewStatus.OK) {
            var nearStreetViewLocation = data.location.latLng;
            var heading = google.maps.geometry.spherical.computeHeading(
                nearStreetViewLocation, marker.position
            );
            largeInfowindow.setContent('<div>' + marker.title + '</div><div id="pano"></div>');
            var panoramaOptions = {
                positon: nearStreetViewLocation,
                pov: {
                    heading: heading,
                    pitch: 20
                }
            };
            var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
        } else {
            largeInfowindow.setContent('<div>' + marker.title + '</div>' + '<div> No Street View Found </div');
        }
    }
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);

    // Loads the infowindow on the map at the marker
    largeInfowindow.open(map, marker);
};


// Initialize the google map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        // Mountain View California
        center: { lat: 37.4133865, lng: -122.1162864 },
        zoom: 13,
        styles, styles,
        mapTypeControl: false
    });

    largeInfowindow = new google.maps.InfoWindow();

    ko.applyBindings(new ViewModel());
};
