var mainMap = function(){
	//------- Google Maps ---------//

	// Creating a LatLng object containing the coordinate for the center of the map
	var latlng = new google.maps.LatLng(64.130591,-21.855927);

	// Creating an object literal containing the properties we want to pass to the map
	var options = {
		zoom: 11, // This number can be set to define the initial zoom level of the map
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP, // This value can be set to define the map type ROADMAP/SATELLITE/HYBRID/TERRAIN
		scrollwheel: false
	};
	// Calling the constructor, thereby initializing the map
	var map = new google.maps.Map($('#map')[0], options);

	addSpot(64.100032, -21.853051, 'segull'); // Segull
	//addSpot(64.102637,-21.822453, 'hafernir'); // Hafernir
	addSpot(64.12321,-21.874123, 'gardbuar'); // Garðbúar
	addSpot(64.117759,-21.794257, 'arbuar'); // Árbúar
	addSpot(64.134128,-21.857901, 'skjoldungar'); // Skjöldungar
	//addSpot(64.129765,-21.907768, 'landnemar'); // Landnemar
	addSpot(64.133341,-21.789064, 'hamar'); // Hamar
	//addSpot(64.126095,-21.758208, 'dalbuar'); // Dalbúar
	addSpot(64.105898,-21.878500, 'kopar'); // Kópar
	addSpot(64.075952,-21.965489, 'hraunbuar'); // Hraunbúar
	addSpot(64.167957,-21.686025, 'mosverjar'); // Mosverjar
	addSpot(64.091248,-21.91957, 'vifill'); // Vífill
	addSpot(64.103949,-22.019992, 'svanir'); // Svanir
	//addSpot(64.141915,-21.958966, 'aegisbuar'); // Ægisbúar

	// Create information window
	function addSpot(lat, lon, url){
		// Add Marker
		var marker1 = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lon),
			map: map
		});

		// Add listener for a click on the pin
		google.maps.event.addListener(marker1, 'click', function() {
			$(' [data-group=' + url + ']').find('a').click();
		});

		google.maps.event.addListener(marker1, 'mouseover', function() {
			$('[data-group=' + url + ']').addClass('group-hover');
		});

		google.maps.event.addListener(marker1, 'mouseout', function() {
			$('[data-group=' + url + ']').removeClass('group-hover');
		});
	}
	google.maps.event.trigger(map, "resize");
}

var loadSmallMap = function loadSmallMap(lat, lng){

	// Creating a LatLng object containing the coordinate for the center of the map
	var latlng = new google.maps.LatLng(lat, lng);

	// Creating an object literal containing the properties we want to pass to the map
	var options = {
		zoom: 14, // This number can be set to define the initial zoom level of the map
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP, // This value can be set to define the map type ROADMAP/SATELLITE/HYBRID/TERRAIN
		scrollwheel: false
	};
	// Calling the constructor, thereby initializing the map



	var mapSmall = new google.maps.Map($('.map-small:visible')[0], options);

	var marker1 = new google.maps.Marker({
		position: new google.maps.LatLng(lat, lng),
		map: mapSmall
	});

}

$(".slidebox").mSlidebox({
    autoPlayTime:7000,
    animSpeed:1000,
    easeType:"easeInOutQuint",
    controlsPosition:{
        buttonsPosition:"inside",
        thumbsPosition:"inside"
    },
    pauseOnHover:true,
    numberedThumbnails:false
});






$(function(){
  
  // For each .bbq widget, keep a data object containing a mapping of
  // url-to-container for caching purposes.
  $('.bbq').each(function(){
    $(this).data( 'bbq', {
      cache: {
        // If url is '' (no fragment), display this div's content.
        '': $(this).find('.bbq-default')
      }
    });
  });
  
  // For all links inside a .bbq widget, push the appropriate state onto the
  // history when clicked.
  $('.bbq a[href^=#]').on( 'click', function(e){
    var state = {},
      
      // Get the id of this .bbq widget.
      id = $(this).closest( '.bbq' ).attr( 'id' ),
      
      // Get the url from the link's href attribute, stripping any leading #.
      url = $(this).attr( 'href' ).replace( /^#/, '' );
    
    // Set the state!
    state[ id ] = url;
    $.bbq.pushState( state );

    
    // And finally, prevent the default link click behavior by returning false.
    return false;
  });
  
  // Bind an event to window.onhashchange that, when the history state changes,
  // iterates over all .bbq widgets, getting their appropriate url from the
  // current state. If that .bbq widget's url has changed, display either our
  // cached content or fetch new content to be displayed.
  $(window).bind( 'hashchange', function(e) {
    // Iterate over all .bbq widgets.
    $('.bbq').each(function(){
      var that = $(this),
        
        // Get the stored data for this .bbq widget.
        data = that.data( 'bbq' ),
        
        // Get the url for this .bbq widget from the hash, based on the
        // appropriate id property. In jQuery 1.4, you should use e.getState()
        // instead of $.bbq.getState().
        url = $.bbq.getState( that.attr( 'id' ) ) || '';


      
      // If the url hasn't changed, do nothing and skip to the next .bbq widget.
      if ( data.url === url ) { return; }
      
      // Store the url for the next time around.
      data.url = url;
      
      
      // Hide any visible ajax content.
      $('#main-content' ).children( ':visible' ).hide();
      
      // Add .bbq-current class to "current" nav link(s), only if url isn't empty.
      //url && that.find( 'a[href="#' + url + '"]' ).addClass( 'bbq-current' );
      
      if ( data.cache[ url ] ) {
        // Since the widget is already in the cache, it doesn't need to be
        // created, so instead of creating it again, let's just show it!
        data.cache[ url ].show();
        
      } else {
        
        // Create container for this url's content and store a reference to it in
        // the cache.
        data.cache[ url ] = $( '<div class="bbq-item"/>' )
          
          // Append the content container to the parent container.
          .appendTo( $( '#main-content' ) )
          
          // Load external content via AJAX. Note that in order to keep this
          // example streamlined, only the content in .infobox is shown. You'll
          // want to change this based on your needs.
          .load( url );
      }

      if(url === ''){
      	$('.go-back').hide();
      	mainMap();
      } else {
      	if(url !== 'info.html'){

      	}
      	$('.go-back').fadeIn(900);
      }
    });
  })
  
  // Since the event is only triggered when the hash changes, we need to trigger
  // the event now, to handle the hash the page may have loaded with.
  $(window).trigger( 'hashchange' );
  
});


var $goBackButton = $('.go-back');


var backButonPosition = function(){
	if($(window).scrollTop() > 460){
		$goBackButton.css({
			'position' : 'fixed',
			'left' : $('#page').offset().left-($goBackButton.width()),
			'top' : 20
		});
	} else {
		$goBackButton.css({
			'position' : 'absolute',
			'left' : $('#page').offset().left-($goBackButton.width()),
			'top' : 480
		});
	}
}
backButonPosition();
$(window).resize(backButonPosition);
$(window).scroll(backButonPosition);



$goBackButton.hover(
	function () {
		$goBackButton.stop().animate({
			'left' : $('#page').offset().left-($goBackButton.width())-10
		});
	},
	function () {
		$goBackButton.stop().animate({
			'left' : $('#page').offset().left-($goBackButton.width())
		});
	}
);




/*var $sidebar   = $(".go-back"),
    $window    = $(window),
    offset     = $sidebar.offset(),
    topPadding = 0;

$window.scroll(function() {
	console.log($window.scrollTop(), offset.top);
    if ($window.scrollTop() > offset.top) {
        $sidebar.stop().animate({
            top: $window.scrollTop() - offset.top + topPadding
        });
    } else {
        $sidebar.stop().animate({
            top: 20
        });
    }
});
*/
