  // Function to dynamically load JavaScript with Promise
  function loadScript(src) {
    return new Promise(function(resolve, reject) {
      var script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }
  
  // Function to dynamically load CSS
  function loadCSS(href) {
    return new Promise(function(resolve, reject) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = resolve;
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }
  
  // Load CSS files
  var cssLinks = [

  ];
  
  Promise.all(cssLinks.map(loadCSS)).then(function() {
    console.log('All CSS files have been loaded');
  
    // Load JS files
    var scripts = [
        'https://code.jquery.com/jquery-2.2.4.min.js'
    ];
  
    Promise.all(scripts.map(loadScript)).then(function() {
      console.log('All JS files have been loaded');
  
      // Place your script execution code here
      $(document).ready(function () {

            var makeItRain = function() {
                //clear out everything
                $('.rain').empty();
            
                var increment = 0;
                var drops = "";
                var backDrops = "";
            
                while (increment < 100) {
                //couple random numbers to use for various randomizations
                //random number between 98 and 1
                var randoHundo = (Math.floor(Math.random() * (98 - 1 + 1) + 1));
                //random number between 5 and 2
                var randoFiver = (Math.floor(Math.random() * (5 - 2 + 1) + 2));
                //increment
                increment += randoFiver;
                //add in a new raindrop with various randomizations to certain CSS properties
                drops += '<div class="drop" style="left: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
                backDrops += '<div class="drop" style="right: ' + increment + '%; bottom: ' + (randoFiver + randoFiver - 1 + 100) + '%; animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"><div class="stem" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div><div class="splat" style="animation-delay: 0.' + randoHundo + 's; animation-duration: 0.5' + randoHundo + 's;"></div></div>';
                }
            
                $('.rain.front-row').append(drops);
                $('.rain.back-row').append(backDrops);
            }
            
            $('.splat-toggle.toggle').on('click', function() {
                $('body').toggleClass('splat-toggle');
                $('.splat-toggle.toggle').toggleClass('active');
                makeItRain();
            });
            
            $('.back-row-toggle.toggle').on('click', function() {
                $('body').toggleClass('back-row-toggle');
                $('.back-row-toggle.toggle').toggleClass('active');
                makeItRain();
            });
            
            $('.single-toggle.toggle').on('click', function() {
                $('body').toggleClass('single-toggle');
                $('.single-toggle.toggle').toggleClass('active');
                makeItRain();
            });
            
            makeItRain();
      });
    });
  });
  
