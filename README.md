# Neighborhood-Map
The goal of this project is to develop a map of a neighborhood with locations of interest marked. The markers need to be animated in response to user interactions and the user should have the ability to filter though the listed locations.

## [Udacity Project Overview](Project_Overview.MD)

### Languages, APIs, and Frameworks Used
* [JavaScript, HTML, CSS](https://www.w3schools.com/)
* [KnockoutJS](http://knockoutjs.com)
* [Google Maps API](https://cloud.google.com/maps-platform/)
* [Foursquare Venues API](https://developer.foursquare.com/)
* [Bootstrap](https://getbootstrap.com/docs/4.0/components/navbar/)
* [JQuery](http://api.jquery.com/)

### Directions for Viewing
1. Download all the files from the [Neighborhood-Map](https://github.com/DanSLuong/Neighborhood-Map) repository into a folder.
2. Register as a developer on [Google's Developers site](console.developers.google.com).
3. Create a new project.
4. Click on ```API and Services``` and select ```Enable APIS AND SERVICES```.
5. Enable the following API:
   * MapsMaps JavaScript API
   * Directions API
   * Distance Matrix API
   * Geocoding API
   * Geolocation API
   * Maps Elevation API
   * Maps Static API 
   * Places API
   * Roads API
 * Time Zone API
6. On the left menu select ```Credentials```.
7. Select ```Create credentials``` and select ```API Key``` as the credential type.
8. Copy the API key generated.
9. Open ```index.html``` in any text editor. (I chose [Visual Studio Code](https://code.visualstudio.com/)).
10. Find the section that contains:
    ```
    <!-- Load the JS API ASYNCHRONOUSLY -->
    <script src="https://maps.googleapis.com/maps/api/js?libraries=places,geometry&key=AIzaSyCq1GE9uIunJEUzqnfxH8id_xknI7okebk&callback=initMap"
        async defer></script>
     ```
11. Replace the part between ```key=``` and ```&callback=initMap``` with your generated API key from google and save.
12. Register for a [Foursquare Developer account](https://developer.foursquare.com/) and save the Client ID and Client Secret.
13. Open the ```script.js``` file located in the js folder in any text editor.
14. Replace the ```clientID``` and ```clientSecret``` with the info you generated and save.
15. Open the ```index.html``` file in any web browser.

### Resources
* [KnockoutJS Documentation](http://knockoutjs.com/documentation)
* [Foursquare Documentation](https://developer.foursquare.com/docs)
* [Google Maps API Documentation](https://developers.google.com/maps/documentation/)
* [JQuery Documentation](http://api.jquery.com/)
