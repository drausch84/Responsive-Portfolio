$(document).ready(function() {
    var firstLoad = true;
    show();
    /* Every time the window is scrolled ... */
    $(window).scroll( function(){
      firstLoad = false;
      show();
    });
    
    function show () {
      /* Check the location of each desired element */
      $('.toShow').each( function(i){
              
        var bottom_of_object = $(this).position().top + $(this).outerHeight() - ($(this).outerHeight() / 2);
        var bottom_of_window = $(window).scrollTop() + $(window).height();
  
        /* If the object is completely visible in the window, fade it it */
        if( bottom_of_window > bottom_of_object ){
  
          $(this).removeClass('toShow');
          if (firstLoad == false) {
            $(this).addClass('animated bounceInUp');
          }
        }  
  
      });
    }
      
  });