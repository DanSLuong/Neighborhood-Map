// Map Variable
var map;
// Info window Variable
var largeInfowindow;
// Boundaries Variable
var bounds;
// Foursquare Info Variables
var clientID = 'DBDW01VAFEOXLYCDACF4Y3CH4NDVRNRSS51CHBODLQ4JHKAJ';
var clientSecret = '5GI1R25JCGGAK2Z3DWICJFTX2TDDM4UO4ON0DP3FSXYKR41T';

// Locations list for some of the Mountain View places
var locations = [
    { title: 'Googleplex', location: { lat: 37.4220, lng: -122.0841 } },
    { title: 'NASA Ames Research Center', location: { lat: 37.4089541, lng: -122.0642083 } },
    { title: 'Computer History Museum', location: { lat: 37.4137122, lng: -122.0778888 } },
    { title: 'In-N-Out Burger', location: { lat: 37.4208109, lng: -122.0932099 } },
    { title: 'Shoreline Lake Boathouse', location: { lat: 37.433036, lng: -122.0882706 } },
    { title: "Mountain Mike's Pizza", location: { lat: 37.419004, lng: -122.110353 } },
    { title: 'Burger King', location: { lat: 37.379408, lng: -122.0814392 } },
    { title: 'McKelvey Ball Park', location: { lat: 37.4135125, lng: -122.1162864 } },
    { title: 'The Habit Burger Grill', location: { lat: 37.367801, lng: -122.033131 } },
    { title: 'Magnolia Park', location: { lat: 37.3779178, lng: -122.1222946 } },
    { title: 'Cornelis Bol Park', location: { lat: 37.4110809, lng: -122.1387771 } },
    { title: 'Boardwalk Fries Burgers Shakes', location: { lat: 37.4030189, lng: -122.0089492 } },
    { title: 'Umami Burger Palo Alto', location: { lat: 37.4477386, lng: -122.1597952 } }
];


var markers = function (locationItem) {
    var self = this;

    this.title = ko.observable(locationItem.title);
    this.position = ko.observable(locationItem.location);

    // Style the markers a bit. this will be our listing marker icon.
    var defaultIcon = makeMarkerIcon('FF0000');

    // Create a "highlighted location" marker color for when the user mouses over the marker.
    var highlightedIcon = makeMarkerIcon('F08080');

    // Create Markers with the given data
    var marker = new google.maps.Marker({
        title: self.title(),
        position: self.position(),
        icon: defaultIcon,
        animation: google.maps.Animation.DROP,
        map: map
    });

    // Listener for when clicked to open info window
    marker.addListener('click', function () {
        // Add bounce animation for when clicked
        marker.setAnimation(google.maps.Animation.BOUNCE);
        // Timeout the animation after 1 cycle
        setTimeout(function () { marker.setAnimation(null); }, 700);
        showInfo(this, largeInfowindow);
    });

    // Mouseover and mouseout events to highlight and return the marker to normal
    marker.addListener('mouseover', function () {
        this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function () {
        this.setIcon(defaultIcon);
    });

    self.marker = marker;

    // Bias the boundaries of the map
    bounds.extend(self.marker.position);
    map.fitBounds(bounds);
};


function pizzaPlaces() {
    // CategoryId for Pizza according to Foursquare API documentation
    categoryID = '4bf58dd8d48988d1ca941735';
    // Foursquare API request URL
    var URL = 'https://api.foursquare.com/v2/venues/explore?query=nearby&ll=37.4133865,' +
        '-122.1162864&categoryId=' + categoryID + '&limit=10&client_id=' +
        clientID + '&client_secret=' + clientSecret + '&v=20180323';

    // Ajax call to Foursquare API to get info for 5 pizza placess nearby.
    $.ajax({
        url: URL,
        dataType: 'jsonp',
        success: function (result) {
            for (var i = 0; i < 10; i++) {
                locations.push({
                    title: result.response.groups[0].items[i].venue.name,
                    location: {
                        lat: result.response.groups[0].items[i].venue.location.lat,
                        lng: result.response.groups[0].items[i].venue.location.lng
                    }
                });
            }
        }, error: function () {
            alert("Couldn't load the Foursquare API. Please try again.");
        }
    });
}


var ViewModel = function () {
    var self = this;

    // Load the Foursquare Data
    pizzaPlaces();

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

        // Check if there is no text in the filter and returns full list if 
        // query is empty
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

    largeInfowindow.setContent('<div>' + marker.title + '</div>');

    // Loads the infowindow on the map at the marker
    largeInfowindow.open(map, marker);
};


// of 0,0 and be anchored at 10, 34
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}


// Mouseover event to highlight the marker
var highlight = function () {
    var highlightedIcon = makeMarkerIcon('F08080');
    this.marker.setIcon(highlightedIcon);
};


// Mouseout event to return the marker to normal
var unhighlight = function () {
    var defaultIcon = makeMarkerIcon('FF0000');
    this.marker.setIcon(defaultIcon);
};


// runs showInfo function when the link is clicked from the list
var clickedLocation = function () {
    showInfo(this.marker);
};


window.googleError = function(){
    alert("An error while loading Google Maps occurred, please try to reload the page.");
};


// Initialize the google map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        // Mountain View California
        center: { lat: 37.4133865, lng: -122.1162864 },
        zoom: 13,
        mapTypeControl: false
    });

    largeInfowindow = new google.maps.InfoWindow();

    bounds = new google.maps.LatLngBounds();

    ko.applyBindings(new ViewModel());
};
