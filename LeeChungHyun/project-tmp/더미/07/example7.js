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
    'https://fonts.googleapis.com/css?family=Raleway:100,200,400,600',
    'https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/2.7.4/jquery.fullPage.min.css',
    'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css'
  ];
  
  Promise.all(cssLinks.map(loadCSS)).then(function() {
    console.log('All CSS files have been loaded');
  
    // Load JS files
    var scripts = [
      'https://code.jquery.com/jquery-2.1.1.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/wow/1.1.2/wow.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.2/js/bootstrap.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/fullPage.js/2.7.4/jquery.fullPage.min.js'
    ];
  
    Promise.all(scripts.map(loadScript)).then(function() {
      console.log('All JS files have been loaded');
  
      $(document).ready(function () {
        // typing animation
        (function ($) {
          $.fn.writeText = function (content) {
            var contentArray = content.split(""),
              current = 0,
              elem = this;
            setInterval(function () {
              if (current < contentArray.length) {
                elem.text(elem.text() + contentArray[current++]);
              }
            }, 80);
          };
        })(jQuery);
      
        // input text for typing animation
        $("#holder").writeText("WEB DESIGNER + FRONT-END DEVELOPER");
      
        // initialize wow.js
        new WOW().init();
      
        // Push the body and the nav over by 285px over
        var main = function () {
          $(".fa-bars").click(function () {
            $(".nav-screen").animate(
              {
                right: "0px"
              },
              200
            );
      
            $("body").animate(
              {
                right: "285px"
              },
              200
            );
          });
      
          // Then push them back */
          $(".fa-times").click(function () {
            $(".nav-screen").animate(
              {
                right: "-285px"
              },
              200
            );
      
            $("body").animate(
              {
                right: "0px"
              },
              200
            );
          });
      
          $(".nav-links a").click(function () {
            $(".nav-screen").animate(
              {
                right: "-285px"
              },
              500
            );
      
            $("body").animate(
              {
                right: "0px"
              },
              500
            );
          });
        };
      
        $(document).ready(main);
      
        // initiate full page scroll
      
        $("#fullpage").fullpage({
          scrollBar: true,
          responsiveWidth: 400,
          navigation: true,
          navigationTooltips: ["home", "about", "portfolio", "contact", "connect"],
          anchors: ["home", "about", "portfolio", "contact", "connect"],
          menu: "#myMenu",
          fitToSection: false,
      
          afterLoad: function (anchorLink, index) {
            var loadedSection = $(this);
      
            //using index
            if (index == 1) {
              /* add opacity to arrow */
              $(".fa-chevron-down").each(function () {
                $(this).css("opacity", "1");
              });
              $(".header-links a").each(function () {
                $(this).css("color", "white");
              });
              $(".header-links").css("background-color", "transparent");
            } else if (index != 1) {
              $(".header-links a").each(function () {
                $(this).css("color", "black");
              });
              $(".header-links").css("background-color", "white");
            }
      
            //using index
            if (index == 2) {
              /* animate skill bars */
              $(".skillbar").each(function () {
                $(this)
                  .find(".skillbar-bar")
                  .animate(
                    {
                      width: $(this).attr("data-percent")
                    },
                    2500
                  );
              });
            }
          }
        });
      
        // move section down one
        $(document).on("click", "#moveDown", function () {
          $.fn.fullpage.moveSectionDown();
        });
      
        // fullpage.js link navigation
        $(document).on("click", "#skills", function () {
          $.fn.fullpage.moveTo(2);
        });
      
        $(document).on("click", "#projects", function () {
          $.fn.fullpage.moveTo(3);
        });
      
        $(document).on("click", "#contact", function () {
          $.fn.fullpage.moveTo(4);
        });
      
        // smooth scrolling
        $(function () {
          $("a[href*=#]:not([href=#])").click(function () {
            if (
              location.pathname.replace(/^\//, "") ==
                this.pathname.replace(/^\//, "") &&
              location.hostname == this.hostname
            ) {
              var target = $(this.hash);
              target = target.length
                ? target
                : $("[name=" + this.hash.slice(1) + "]");
              if (target.length) {
                $("html,body").animate(
                  {
                    scrollTop: target.offset().top
                  },
                  700
                );
                return false;
              }
            }
          });
        });
      
        //ajax form
        $(function () {
          // Get the form.
          var form = $("#ajax-contact");
      
          // Get the messages div.
          var formMessages = $("#form-messages");
      
          // Set up an event listener for the contact form.
          $(form).submit(function (e) {
            // Stop the browser from submitting the form.
            e.preventDefault();
      
            // Serialize the form data.
            var formData = $(form).serialize();
      
            // Submit the form using AJAX.
            $.ajax({
              type: "POST",
              url: $(form).attr("action"),
              data: formData
            })
              .done(function (response) {
                // Make sure that the formMessages div has the 'success' class.
                $(formMessages).removeClass("error");
                $(formMessages).addClass("success");
      
                // Set the message text.
                $(formMessages).text(response);
      
                // Clear the form.
                $("#name").val("");
                $("#email").val("");
                $("#message").val("");
              })
              .fail(function (data) {
                // Make sure that the formMessages div has the 'error' class.
                $(formMessages).removeClass("success");
                $(formMessages).addClass("error");
      
                // Set the message text.
                if (data.responseText !== "") {
                  $(formMessages).text(data.responseText);
                } else {
                  $(formMessages).text(
                    "Oops! An error occured and your message could not be sent."
                  );
                }
              });
          });
        });
      });
    });
  });