var rMap;
function initRouletteMap() {
  var pos;
  var rMap = new google.maps.Map(document.getElementById('r-map'), {
    zoom: 13,
    mapTypeControl: false
  });

  // set request to place id
  var placeId = $('#r-choice').data('place-id');
  var request = {
    placeId: placeId
  };

  var infowindow = new google.maps.InfoWindow();
  var service = new google.maps.places.PlacesService(rMap);

  service.getDetails(request, function (place, status) {

        if (status == google.maps.places.PlacesServiceStatus.OK) {

          // Set up appropriate marker
          if($('#r-choice').data('tried')){
            var iconImage = "https://dl.dropboxusercontent.com/u/63083085/NextNoms/purpmarker2.png";
          } else {
            var iconImage = "https://dl.dropboxusercontent.com/u/63083085/NextNoms/redmarker2.png";
          }

          var icon = {
              url: iconImage,
              scaledSize: new google.maps.Size(32, 43), // scaled size
              origin: new google.maps.Point(0, 0), // origin
              anchor: new google.maps.Point(16, 43) // anchor
          };

            var marker = new google.maps.Marker({
                map: rMap,
                position: place.geometry.location,
                icon: icon
            });

            // Set Up info window for restaurant, center map on it
            infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
            place.formatted_address + '</div>');
            infowindow.open(rMap, marker);
            rMap.setCenter(place.geometry.location);

            google.maps.event.addListener(marker, 'click', function () {
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                place.formatted_address + '</div>');
                infowindow.open(rMap, this);
            });



            //Set up info to be displayed for restaurant to go into div
            var htmlStr = '';
            var htmlHours = '';

            if(place.permanently_closed){
              htmlStr += 'This location has been permanently closed. Consider removing it from your list.';
            } else {
              var htmlName = '<h2>'+ place.name +'<h2>';
              htmlStr += '<i class="fa fa-map-marker"></i>&emsp;' + place.formatted_address + '<br>';

              if(place.website !== undefined){
                htmlStr += '<i class="fa fa-globe"></i>&emsp;<a href="' + place.website + '" target="_blank">'+ place.website +'</a><br>';
              }

              if(place.formatted_phone_number !== undefined){
                htmlStr += '<i class="fa fa-phone"></i>&emsp;' + place.formatted_phone_number + '<br>';
              }

              htmlStr += '<i class="fa fa-star"></i>&emsp;Average Rating: ' + place.rating + '<br>';

              if(place.price_level === 0){
                htmlStr += '<i class="fa fa-money"></i>&emsp;Price Range: Free<br>';
              }else if(place.price_level === 1){
                htmlStr += '<i class="fa fa-money"></i>&emsp;Price Range: $<br>';
              }else if(place.price_level === 2){
                htmlStr += '<i class="fa fa-money"></i>&emsp;Price Range: $$<br>';
              }else if(place.price_level === 3){
                htmlStr += '<i class="fa fa-money"></i>&emsp;Price Range: $$$<br>';
              }else if(place.price_level === 1){
                htmlStr += '<i class="fa fa-money"></i>&emsp;Price Range: $$$$<br>';
              } else {
                htmlStr += '';
              }

              if(place.opening_hours !== undefined){
                htmlStr += '<i class="fa fa-clock-o"></i>&emsp;' + (place.opening_hours.open_now ? '<span class="open">Open Now</span><br>' : '<span class="closed">Currently Closed</span><br>');

                for (var i=0; i < place.opening_hours.weekday_text.length; i++) {
                  htmlHours += place.opening_hours.weekday_text[i] + '<br>';
                }
              }
            }

            // Add above info onto page
            $(".roulette-name").append(htmlName);
            $(".roulette-rest").append(htmlStr);
            $(".roulette-hours").append(htmlHours);
        }
    });

}
