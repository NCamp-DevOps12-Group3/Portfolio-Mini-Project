

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
    'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.4/css/bootstrap.min.css',
'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
'https://fonts.googleapis.com/css?family=Lato:300,400,700,300italic,400italic,700italic'
  ];
  
  Promise.all(cssLinks.map(loadCSS)).then(function() {
    // All CSS files have been loaded
    console.log('All CSS files have been loaded');
  });
  
  // Load JS files in sequence using Promise
  Promise.all(scripts.map(loadScript)).then(function() {
    // All JS files have been loaded
    $(document).ready(function () {
    });
  });
  