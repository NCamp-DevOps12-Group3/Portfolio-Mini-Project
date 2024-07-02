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
  'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/jquery-ui.css',
  'https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css',
  'https://startbootstrap.com/templates/agency/font-awesome-4.1.0/css/font-awesome.min.css',
  'https://startbootstrap.com/templates/agency/font-awesome-4.1.0/css/font-awesome.min.css'
];

Promise.all(cssLinks.map(loadCSS)).then(function() {
  console.log('All CSS files have been loaded');

  // Load JS files
  var scripts = [
    'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js',
    'https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js',
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js'
  ];

  Promise.all(scripts.map(loadScript)).then(function() {
    console.log('All JS files have been loaded');

    // Place your script execution code here
    $(document).ready(function () {
      $(function() {
        $('a.page-scroll').bind('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top
            }, 1500, 'easeInOutExpo');
            event.preventDefault();
        });
    });
    });
  });
});
