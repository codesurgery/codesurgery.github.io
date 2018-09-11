/* globals jQuery, PhotoSwipe, PhotoSwipeUI_Default, AOS */

(function ($) {
  var cfg = {
    scrollDuration: 800, // smoothscroll duration
    mailChimpURL: 'https://facebook.us8.list-manage.com/subscribe/post?u=cdb7b577e41181934ed6a6a44&amp;id=e6957d85dc' // mailchimp url
  };
  var $WIN = $(window);
  var doc = document.documentElement;
  doc.setAttribute('data-useragent', navigator.userAgent);

  /* Preloader */
  var clPreloader = function () {
    $('html').addClass('cl-preload');
    $WIN.on('load', function () {
      $('#loader').fadeOut(300, function () {
        $('#preloader').delay(300).fadeOut(300);
      });
      $('html').removeClass('cl-preload');
      $('html').addClass('cl-loaded');
    });
  };

  /* Menu on Scrolldown */
  var clMenuOnScrolldown = function () {
    var menuTrigger = $('.header-menu-toggle');

    $WIN.on('scroll', function () {
      if ($WIN.scrollTop() > 150) {
        menuTrigger.addClass('opaque');
      } else {
        menuTrigger.removeClass('opaque');
      }
    });
  };

  /* OffCanvas Menu */
  var clOffCanvas = function () {
    var menuTrigger = $('.header-menu-toggle');
    var nav = $('.header-nav');
    var closeButton = nav.find('.header-nav__close');
    var siteBody = $('body');

    // open-close menu by clicking on the menu icon
    menuTrigger.on('click', function (e) {
      e.preventDefault();
      siteBody.toggleClass('menu-is-open');
    });

    // close menu by clicking the close button
    closeButton.on('click', function (e) {
      e.preventDefault();
      menuTrigger.trigger('click');
    });

    // close menu clicking outside the menu itself
    siteBody.on('click', function (e) {
      if (!$(e.target).is('.header-nav, .header-nav__content, .header-menu-toggle, .header-menu-toggle span')) {
        siteBody.removeClass('menu-is-open');
      }
    });
  };

  /* photoswipe */
  var clPhotoswipe = function () {
    var items = [];
    var $pswp = $('.pswp')[0];
    var $folioItems = $('.item-folio');

    // get items
    $folioItems.each(function (i) {
      var $folio = $(this);
      var $thumbLink = $folio.find('.thumb-link');
      var $title = $folio.find('.item-folio__title');
      var $caption = $folio.find('.item-folio__caption');
      var $titleText = '<h4>' + $.trim($title.html()) + '</h4>';
      var $captionText = $.trim($caption.html());
      var $href = $thumbLink.attr('href');
      var $size = $thumbLink.data('size').split('x');
      var $width = $size[0];
      var $height = $size[1];

      var item = {
        src: $href,
        w: $width,
        h: $height
      };

      if ($caption.length > 0) {
        item.title = $.trim($titleText + $captionText);
      }

      items.push(item);
    });

    // bind click event
    $folioItems.each(function (i) {
      $(this).on('click', function (e) {
        e.preventDefault();
        var options = {
          index: i,
          showHideOpacity: true
        };

        // initialize PhotoSwipe
        var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
        lightBox.init();
      });
    });
  };

  /* Stat Counter */
  var clStatCount = function () {
    var statSection = $('.s-stats');
    var stats = $('.stats__count');

    statSection.waypoint({
      handler: function (direction) {
        if (direction === 'down') {
          stats.each(function () {
            var $this = $(this);

            $({ Counter: 0 }).animate({ Counter: $this.text() }, {
              duration: 4000,
              easing: 'swing',
              step: function (curValue) {
                $this.text(Math.ceil(curValue));
              }
            });
          });
        }
        this.destroy();
      },
      offset: '90%'
    });
  };

  /* Masonry */
  var clMasonryFolio = function () {
    var containerBricks = $('.masonry');

    containerBricks.imagesLoaded(function () {
      containerBricks.masonry({
        itemSelector: '.masonry__brick',
        resize: true
      });
    });

    // layout Masonry after each image loads
    containerBricks.imagesLoaded().progress(function () {
      containerBricks.masonry('layout');
    });
  };

    /* slick slider */
  var clSlickSlider = function () {
    $('.testimonials__slider').slick({
      arrows: false,
      dots: true,
      infinite: true,
      slidesToShow: 2,
      slidesToScroll: 1,
      pauseOnFocus: false,
      autoplaySpeed: 1500,
      responsive: [
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    });
  };

  /* Smooth Scrolling */
  var clSmoothScroll = function () {
    $('.smoothscroll').on('click', function (e) {
      var target = this.hash;
      var $target = $(target);

      e.preventDefault();
      e.stopPropagation();

      $('html, body').stop().animate({
        'scrollTop': $target.offset().top
      }, cfg.scrollDuration, 'swing').promise().done(function () {
        // check if menu is open
        if ($('body').hasClass('menu-is-open')) {
          $('.header-menu-toggle').trigger('click');
        }

        window.location.hash = target;
      });
    });
  };

  /* Placeholder Plugin Settings */
  var clPlaceholder = function () {
    $('input, textarea, select').placeholder();
  };

  /* Alert Boxes */
  var clAlertBoxes = function () {
    $('.alert-box').on('click', '.alert-box__close', function () {
      $(this).parent().fadeOut(500);
    });
  };

  /* Animate On Scroll */
  var clAOS = function () {
    AOS.init({
      offset: 200,
      duration: 600,
      easing: 'ease-in-sine',
      delay: 300,
      once: true,
      disable: 'mobile'
    });
  };

  /* AjaxChimp */
  var clAjaxChimp = function () {
    $('#mc-form').ajaxChimp({
      language: 'es',
      url: cfg.mailChimpURL
    });

    // Mailchimp translation
    //
    //  Defaults:
    //   'submit': 'Submitting...',
    //  0: 'We have sent you a confirmation email',
    //  1: 'Please enter a value',
    //  2: 'An email address must contain a single @',
    //  3: 'The domain portion of the email address is invalid (the portion after the @: )',
    //  4: 'The username portion of the email address is invalid (the portion before the @: )',
    //  5: 'This email address looks fake or invalid. Please enter a real email address'

    $.ajaxChimp.translations.es = {
      'submit': 'Submitting...',
      0: '<i class="fas fa-check"></i> We have sent you a confirmation email',
      1: '<i class="fas fa-exclamation-circle"></i> You must enter a valid e-mail address.',
      2: '<i class="fas fa-exclamation-circle"></i> E-mail address is not valid.',
      3: '<i class="fas fa-exclamation-circle"></i> E-mail address is not valid.',
      4: '<i class="fas fa-exclamation-circle"></i> E-mail address is not valid.',
      5: '<i class="fas fa-exclamation-circle"></i> E-mail address is not valid.'
    };
  };

  /* Back to Top */
  var clBackToTop = function () {
    var pxShow = 500;
    var fadeInTime = 400;
    var fadeOutTime = 400;
    var goTopButton = $('.cl-go-top');

    // Show or hide the sticky footer button
    $(window).on('scroll', function () {
      if ($(window).scrollTop() >= pxShow) {
        goTopButton.fadeIn(fadeInTime);
      } else {
        goTopButton.fadeOut(fadeOutTime);
      }
    });
  };

  var clGetLocation = function () {
    var locCb = function (loc) {
      var country = loc.country;
      var code = loc.countryCode;
      if (country) {
        var theCountryPrefixes = [
          'United ',
          'Dominican ',
          'Ivory ',
          'Cook Islands',
          'Solomon Islands',
          'Marshall Islands',
          'Maldives',
          'Netherlands',
          'Philippines',
          'Seychelles',
          'Comoros'
        ];
        var TheCountryPrefixes = [
          'Bahamas',
          'Gambia'

        ];
        var prefix, i;
        for (i = 0; i < theCountryPrefixes.length; i++) {
          prefix = theCountryPrefixes[i];
          if (!country.indexOf(prefix)) return countryCb(code, 'the ' + country);
        }
        for (i = 0; i < TheCountryPrefixes.length; i++) {
          prefix = TheCountryPrefixes[i];
          if (!country.indexOf(prefix)) return countryCb(code, 'The ' + country);
        }
        return countryCb(code, country);
      }
    };
    var countryCb = function (code, country) {
      code = code.toLowerCase();
      var localeEl = document.getElementById('locale');
      localeEl.setAttribute('class', 'flag-icon flag-icon-' + code);
      localeEl.style.borderRadius = '9999px';
      localeEl.style.border = '1px solid #fff';
      localeEl.style.boxSizing = 'content-box';
    };

    var loc = window.localStorage.getItem('loc');
    if (loc) return locCb(JSON.parse(loc));

    $.getJSON('http://ip-api.com/json', function (loc) {
      window.localStorage.setItem('loc', JSON.stringify(loc));
      locCb(loc);
    });
  };

  /* Initialize */
  clGetLocation();
  clPreloader();
  clMenuOnScrolldown();
  clOffCanvas();
  clPhotoswipe();
  clStatCount();
  clMasonryFolio();
  clSlickSlider();
  clSmoothScroll();
  clPlaceholder();
  clAlertBoxes();
  clAOS();
  clAjaxChimp();
  clBackToTop();
})(jQuery);
