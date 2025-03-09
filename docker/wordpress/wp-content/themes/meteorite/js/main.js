
; (function ($) {

  'use strict'

  /**
   * Enables the row seperators and calculates its border color based on background colors
   */
  var meteorite_enableRowSeperator = function () {
    if ($('.row-has-seperator').length) {
      $('.row-has-seperator').each(function () {
        var rowWithSeperator = $(this);
        rowWithSeperator.after('<div class="row-seperator"></div>');
        rowWithSeperator.parent().find('.row-seperator').each(function () {
          var rowSeperator = $(this);

          var bgColor = rowSeperator.prev().css('background-color');
          if (bgColor == 'transparent') {
            if ($('body.meteorite-boxed').length) {
              bgColor = $('.meteorite-boxed #page').css('background-color');
            } else if ($('body.custom-background').length) {
              bgColor = $('body.custom-background').css('background-color');
            } else {
              bgColor = $('body').css('background-color');
            }
          }
          rowSeperator.css('background-color', bgColor);

          var borderColor = rowSeperator.prev().css('border-bottom-color');
          rowSeperator.css({
            'border-bottom-color': borderColor,
            'border-right-color': borderColor,
          });
        });
      });
    }
  }
  meteorite_enableRowSeperator();


  /**
   * Calculates the CSS positioning for the .sub-menu elements
   * @param {*} context The context element that contains sub menus
   */
  var meteorite_submenuPositioning = function (context) {
    return context.children('.sub-menu').each(function () {
      var submenu = $(this);
      if (submenu.length) {
        var submenu_position = submenu.offset(),
          submenu_left = submenu_position.left,
          submenu_top = submenu_position.top,
          submenu_height = submenu.height(),
          submenu_width = submenu.outerWidth(),
          submenu_bottom_edge = submenu_top + submenu_height,
          submenu_right_edge = submenu_left + submenu_width,
          browser_bottom_edge = $(window).height(),
          browser_right_edge = $(window).width()

        if (submenu_right_edge > browser_right_edge) {
          // Current submenu goes beyond browser's right edge
          if (!submenu.parent().parent('.sub-menu').length) {
            // First level submenu
            submenu.css({
              'left': (-1) * submenu_width + submenu.parent().width(),
              'top': '115%'
            });
          } else {
            // Second level submenu
            submenu.css({
              'left': (-1) * submenu_width,
              'top': '10px'
            });
          }
        }

      }
    });
  }


  /**
   * Recursively iterate through the sub menus and call the positioning function for the element
   * @param {*} context The context element that contains sub menus
   */
  var meteorite_walkThroughMenuItems = function (context) {
    meteorite_submenuPositioning(context);

    if (context.find('.sub-menu').length) {
      var ctx = $(this).find('.sub-menu li');
      meteorite_walkThroughMenuItems(ctx)
    } else {
      return;
    }
  }


  /**
   * Sets up the walker and positioning functions for menu items with children
   */
  var meteorite_callDropdownFunctions = function () {
    $('.menu-item-has-children, .menu-item-has-children li').mouseenter(function () {
      var ctx = $(this);
      meteorite_submenuPositioning(ctx);
    });

    $('.menu-item-has-children > ul > li').each(function () {
      var ctx = $(this);
      meteorite_walkThroughMenuItems(ctx);
    });

    $('.menu-item-has-children').each(function () {
      var ctx = $(this);
      meteorite_walkThroughMenuItems(ctx);
    });
  }
  meteorite_callDropdownFunctions();
  $(window).on('resize', meteorite_callDropdownFunctions);


  /**
   * Scrolls the page smoothly to an element id
   */
  var meteorite_smoothScroll = function () {
    $(document).on('click', '#main-nav a[href*="#"]:not(.search-button-toggle), #footer-nav a[href*="#"], #mobile-menu a[href*="#"], .meteorite-button[href*="#"], .button[href*="#"], .smooth-scroll[href*="#"]', function (e) {
      var target = this.hash;
      var $target = $(target);
      if ($target.length) {
        e.preventDefault();
        if ((matchMedia('only screen and (min-width: 992px)').matches)) {
          $('html, body').stop().animate({
            'scrollTop': $target.offset().top - ($('.nav-container').outerHeight())
          }, 1000);
        } else {
          $('html, body').stop().animate({
            'scrollTop': $target.offset().top
          }, 1000);
        }
      }
    });
  }
  meteorite_smoothScroll();


  /**
   * Showing the up button after a certain amount of scrolling
   */
  var meteorite_showUpButton = function () {
    if ($(document).scrollTop() > ($('.header-container').height())) {
      $('.upbutton').addClass('meteorite-show');
    } else {
      $('.upbutton').removeClass('meteorite-show');
    }
  }
  meteorite_showUpButton();
  $(window).on('scroll', meteorite_showUpButton);


  /**
   * Click function for the up button
   */
  var meteorite_clickUpButton = function () {
    $(document).on('click', '.upbutton', function () {
      $('html, body').animate({ scrollTop: 0 }, 800);
      return false;
    });
  }
  meteorite_clickUpButton();


  /**
   * Toggle the header search and its overlay
   */
  var meteorite_headerSearch = function () {
    var meteorite_searchIsClosed = true;

    function toggleSearchOverlay() {
      $('.meteorite-header-search').stop().fadeToggle(200);
      meteorite_searchIsClosed = !meteorite_searchIsClosed;
    }
    if ($('.search-button-toggle').length) {
      $(document).on('click', '.search-button-toggle', function (event) {
        event.preventDefault();
        $('.meteorite-header-search').stop().fadeToggle(200);
        $('.overlay-search input').focus();
        meteorite_searchIsClosed = !meteorite_searchIsClosed;
      });
      $(document).on('click', '.overlay-search-close', function (e) {
        e.preventDefault();
        toggleSearchOverlay();
        $('.search-button-toggle').focus();
      });
      $(document).keydown(function (e) {
        if (e.keyCode == 27 && !meteorite_searchIsClosed) {
          toggleSearchOverlay();
          $('.search-button-toggle').focus();
        }
      });
    }
  }
  meteorite_headerSearch();


  /**
   * Click function for the mobile menu
   */
  var meteorite_mobileMenuBtn = function () {
    $(document).on('click', '.btn-menu, #mobile-menu a', function () {
      $('#mobile-menu').stop().slideToggle(300);
      $('.btn-menu').toggleClass('open-nav-cross');
    });
  }
  meteorite_mobileMenuBtn();


  /**
   * Click function for mobile sub menus
   */
  var meteorite_mobileSubmenus = function () {
    var hasChildMenu = $('#mobile-menu').find('li:has(ul)');
    hasChildMenu.children('a').after('<span class="btn-submenu"></span>');

    $(document).on('click', '#mobile-menu .btn-submenu', function () {
      $(this).next('ul').stop().slideToggle(300);
      $(this).toggleClass('active');
    });
  }
  meteorite_mobileSubmenus();


  /**
   * Hides the mobile menu and resets burger menu icon when viewport is larger than 1024 px
   * to prevent it from staying open after resize
   */
  var meteorite_hideMobileMenu = function () {
    if (!(matchMedia('only screen and (max-width: 1024px)').matches)) {
      $('#mobile-menu').removeAttr('style');
      $('.btn-menu').removeClass('open-nav-cross');
    }
  }
  meteorite_hideMobileMenu();
  $(window).on('resize', meteorite_hideMobileMenu);


  /**
   * Enables the sticky header on scroll
   */
  var meteorite_stickyHeader = function () {
    var navContainer = $(".nav-container");
    var headerAreaHeight = $(".header-area").height();
    var docScrollTop = $(document).scrollTop();
    var topbarHeight = $(".topbar").outerHeight() || 0;

    if ($("#masthead.above .nav-container").hasClass("sticky")) {
      // Navbar above header area
      if (docScrollTop > 0 + topbarHeight) {
        navContainer.addClass("fixed");
      } else {
        navContainer.removeClass("fixed");
      }
      if (docScrollTop > 0 + topbarHeight + (headerAreaHeight / 2)) {
        navContainer.addClass("floated");
      } else {
        navContainer.removeClass("floated");
      }
    } else if ($("#masthead.below .nav-container").hasClass("sticky")) {
      // Navbar below header area
      if (docScrollTop > headerAreaHeight + topbarHeight) {
        navContainer.addClass("fixed");
        navContainer.addClass("floated");
      } else {
        navContainer.removeClass("fixed");
        navContainer.removeClass("floated");
      }
    }
  }
  meteorite_stickyHeader();
  $(window).on('scroll', meteorite_stickyHeader);


  /**
   * Resize the nav placeholder
   */
  var meteorite_navPlaceholderHeight = function () {
    $(".nav-placeholder").height($(".nav-container").outerHeight());
  }
  meteorite_navPlaceholderHeight();
  $(window).on('resize', meteorite_navPlaceholderHeight);


  /**
   * Deactivate sticky header on smaller screens
   */
  var meteorite_deactivateStickyHeaderMobile = function () {
    if ($(window).width() < 1024) {
      $('.nav-container').removeClass('fixed');
      $('.parallax-header').css({ 'top': '0' });
    }
  }
  meteorite_deactivateStickyHeaderMobile();
  $(window).on('resize', meteorite_deactivateStickyHeaderMobile);


  /**
   * Enables the parallax header and calculates its movement
   */
  var meteorite_parallaxHeader = function () {
    if ($(window).width() > 1024) {
      var parallaxText = $('.parallax-text:not(.no-parallax)');
      var parallaxImage = $('.parallax-header:not(.no-parallax)');
      var headerButton = $('.header-button');
      var headerHeight = $('.header-image').height() / 1.5; // Scrolltop value when opacity should be 0

      var scrollTop = $(this).scrollTop();
      var textHeight = $('.header-image').height() / 2;

      // Prevent calculating the top value when it isn't visible anymore
      if (scrollTop < (headerHeight * 1.5 + $('#masthead').height())) {
        parallaxText.css({ 'opacity': (1 - scrollTop / headerHeight) });
        parallaxText.css("top", textHeight + (scrollTop * 0.1) + 'px');
        headerButton.css({ 'opacity': (1 - scrollTop / headerHeight) });
        parallaxImage.css("top", scrollTop * 0.45 + 'px');
      }
    }
  }
  meteorite_parallaxHeader();
  $(window).on('scroll', meteorite_parallaxHeader);


  /**
   * Calculates the parallax backgrounds from SiteOrigin rows
   */
  var meteorite_parallaxBg = function () {
    if ($(window).width() > 1024) {
      $('.meteorite-parallax[data-hasbg="hasbg"]').each(function () {

        var scrPos = $(window).scrollTop();
        var offTop = $(this).offset().top;
        var bottom = scrPos + $(window).height();

        if (bottom > offTop) {
          if (offTop > scrPos) {
            var coords = (Math.abs(scrPos - offTop) / 2);
          } else {
            var coords = (offTop - scrPos) / 2;
          }
          $(this).css("backgroundPosition", ("0px " + (parseInt(coords)).toString() + "px"));
        } else {
          $(this).css({ backgroundPosition: '' })
        }
      });
    }
  }
  meteorite_parallaxBg();
  $(window).on('scroll', meteorite_parallaxBg);


  /**
   * Fade in effects for Meteorite widgets
   */
  var meteorite_fadeInEffects = function () {
    if ($(window).width() <= 1024) {
      return;
    }

    $(".fade-in").each(function () {
      var offTop = $(this).offset().top;
      var scrPos = $(window).scrollTop();
      var bottom = scrPos + $(window).height();

      if (bottom > offTop + 150) {
        $(this).addClass("meteorite-show").delay(1000).queue(function () {
          $(this).removeClass("fade-in meteorite-show").dequeue();
        });
      }
    });

    $(".fade-in-left, .fade-in-right").each(function () {
      var offTop = $(this).offset().top;
      var scrPos = $(window).scrollTop();
      var bottom = scrPos + $(window).height();

      if (bottom > offTop + 150) {
        $(this).addClass("meteorite-show").delay(1000).queue(function () {
          $(this).removeClass("fade-in-left fade-in-right meteorite-show").dequeue();
        });
      }
    });

    $(".fade-in-up").each(function () {
      var offTop = $(this).offset().top;
      var scrPos = $(window).scrollTop();
      var bottom = scrPos + $(window).height();

      if (bottom > offTop + 150) {
        $(this).addClass("meteorite-show").delay(1000).queue(function () {
          $(this).removeClass("fade-in-up meteorite-show").dequeue();
        });
      }
    });

    $(".fade-in-single").each(function () {
      var offTop = $(this).offset().top;
      var scrPos = $(window).scrollTop();
      var bottom = scrPos + $(window).height();

      if ($(this).hasClass('meteorite-text-with-icon')) {
        if ($('body').hasClass('siteorigin-panels')) {
          $(this).closest(".panel-row-style").find('.meteorite-text-with-icon').find(".meteorite-item").each(function (i) {
            $(this).css('animation-delay', 100 * i + 'ms');
          });
        } else if ($('body').hasClass('elementor-page')) {
          $(this).closest('.elementor-section').find('.meteorite-text-with-icon').find('.meteorite-item').each(function (i) {
            $(this).css('animation-delay', 100 * i + 'ms');
          });
        }
      }
      if (bottom > offTop + 150) {
        $(this).find('.meteorite-item').each(function (l) {
          var $this = $(this);
          setTimeout(function () {
            $this.addClass("meteorite-show").delay(2000).queue(function () {
              $this.removeClass("meteorite-show").dequeue();
              $this.closest(".fade-in-single").removeClass("fade-in-single");
            });
          }, 100 * l);
        });
      }
    });

    $(".fade-in-up-single").each(function () {
      var offTop = $(this).offset().top;
      var scrPos = $(window).scrollTop();
      var bottom = scrPos + $(window).height();

      if ($(this).hasClass('meteorite-text-with-icon')) {
        if ($('body').hasClass('siteorigin-panels')) {
          $(this).closest(".panel-row-style").find('.meteorite-text-with-icon').find(".meteorite-item").each(function (i) {
            $(this).css('animation-delay', 200 * i + 'ms');
          });
        } else if ($('body').hasClass('elementor-page')) {
          $(this).closest('.elementor-section').find('.meteorite-text-with-icon').find('.meteorite-item').each(function (i) {
            $(this).css('animation-delay', 100 * i + 'ms');
          });
        }
      }
      if (bottom > offTop + 150) {
        $(this).find('.meteorite-item').each(function (l) {
          var $this = $(this);
          setTimeout(function () {
            $this.addClass("meteorite-show").delay(4000).queue(function () {
              $this.removeClass("meteorite-show").dequeue();
              $this.closest(".fade-in-up-single").removeClass("fade-in-up-single");
            });
          }, 200 * l);
        });
      }
    });
  }
  meteorite_fadeInEffects();
  $(window).on('scroll', meteorite_fadeInEffects);


  /**
   * Removes the fade in classes on smaller screen and deactivation in Customizer
   */
  var meteorite_removeFadeInClass = function () {
    if ((matchMedia('only screen and (max-width: 1024px)').matches) || $('body').hasClass('meteorite-no-animations')) {
      $(".fade-in").removeClass("fade-in");
      $(".fade-in-up").removeClass("fade-in-up");
      $(".fade-in-left").removeClass("fade-in-left");
      $(".fade-in-right").removeClass("fade-in-right");
      $(".fade-in-single").removeClass("fade-in-single");
      $(".fade-in-up-single").removeClass("fade-in-up-single");
    }
  }
  meteorite_removeFadeInClass();
  $(window).on('resize', meteorite_removeFadeInClass);


  /**
   * Detect waypoints and trigger the custom on-appear event
   */
  var meteorite_detectWaypoint = function () {
    $('[data-waypoint-active="yes"]').waypoint(function () {
      $(this).trigger('on-appear');
    }, { offset: '90%', triggerOnce: true });

    setTimeout(function () {
      $.waypoints('refresh');
    }, 100);
  }
  meteorite_detectWaypoint();
  $(window).on('load', function () {
    // Need to call it once loaded too
    meteorite_detectWaypoint();
  })


  /**
   * Animates the skill bar width on appearence
   */
  var meteorite_skillBars = function () {
    if ($('.skill-bar').length) {
      $('.skill-bar').each(function () {
        $(this).on('on-appear', function () {
          var percent = $(this).data('percent');
          $(this).find('.skill-bar-fill').animate({ "width": percent + '%' }, 3000);
          $(this).parent().find('.skill-perc').addClass('meteorite-show').animate({ "width": percent + '%' }, 3000);
        });
      });
    }
  }
  meteorite_skillBars();


  /**
   * Animates the skill circles on appearence
   */
  var meteorite_skillCircles = function () {
    if ($('.meteorite-skill-circle').length) {
      $('.meteorite-skill-circle').on('on-appear', function () {
        var $barColor = $(this).parent().data('fillcolor');
        var $trackColor = $(this).parent().data('unfillcolor');
        var $size = $(this).parent().data('size');
        var $lineWidth = $(this).parent().data('linewidth');
        var $speed = $(this).parent().data('speed');

        $(this).find('.meteorite-skill-circle-inner').each(function () {
          $(this).easyPieChart({
            barColor: $barColor,
            scaleColor: false,
            trackColor: $trackColor,
            size: $size,
            lineWidth: $lineWidth,
            animate: { duration: $speed, enabled: true }
          });
        });
      });
    }
  }
  meteorite_skillCircles();


  /**
   * SiteOrigin page builder row styling
   */
  var meteorite_panelsStyling = function () {
    $(".panel-row-style").each(function () {
      if ($(this).data('hascolor')) {
        $(this).find('h1, h2, h3, h4, h5, h6, a, .fa, div, span').css('color', 'inherit');
      }
      if ($(this).data('hasbg') && $(this).data('overlay')) {
        $(this).append('<div class="overlay"></div>');
        var overlayColor = $(this).data('overlay-color');
        $(this).find('.overlay').css('background-color', overlayColor);
      }
    });
    $('.panel-grid .panel-widget-style').each(function () {
      var titleColor = $(this).data('title-color');
      var headingsColor = $(this).data('headings-color');
      if (titleColor != '#444444') {
        $(this).find('.widget-title').css('color', titleColor);
      }
      if (headingsColor != '#444444') {
        $(this).find('h1, h2, h3:not(.widget-title), h4, h5, h6, h3 a').css('color', headingsColor);
      }
    });
  }
  meteorite_panelsStyling();


  /**
   * Init testimonial carousels
   */
  var meteorite_testimonialCarousel = function () {
    if ($(".meteorite-testimonials").length) {
      $('.meteorite-testimonials').each(function () {
        var this_carousel = $(this);
        var sliderHeightAuto = true;
        if (this_carousel.data('items-large') > 1) {
          sliderHeightAuto = false;
        }
        this_carousel.owlCarousel({
          navigation: false,
          pagination: this_carousel.data('pagination'),
          responsive: true,
          items: this_carousel.data('items-large'),
          itemsDesktopSmall: [1400, this_carousel.data('items-large')],
          itemsTablet: [992, this_carousel.data('items-medium')],
          itemsTabletSmall: [768, this_carousel.data('items-medium')],
          itemsMobile: [480, this_carousel.data('items-small')],
          touchDrag: true,
          mouseDrag: true,
          autoHeight: sliderHeightAuto,
          stopOnHover: true,
          autoPlay: this_carousel.data('autoplay'),
          afterInit: function () {
            $(this).imagesLoaded(function () {
              setTimeout(function () {
                $(".meteorite-testimonials").each(function () {
                  // Fixes a bug where the outer-wrapper has wrong width because when the plugin calculates the width
                  // the SiteOrigin wrapper isn't loaded 
                  $(this).data('owlCarousel').updateVars();
                });
              }, 0);
            });
          },
        });
      });
    }
  }
  meteorite_testimonialCarousel();


  /**
   * Init team carousel
   */
  var meteorite_teamCarousel = function () {
    if ($(".meteorite-team").length) {
      $('.meteorite-team').each(function () {
        var this_carousel = $(this);
        this_carousel.owlCarousel({
          navigation: false,
          pagination: this_carousel.data('pagination'),
          responsive: true,
          items: this_carousel.data('items-large'),
          itemsDesktopSmall: [1400, this_carousel.data('items-large')],
          itemsTablet: [992, this_carousel.data('items-medium')],
          itemsTabletSmall: [768, this_carousel.data('items-medium')],
          itemsMobile: [480, this_carousel.data('items-small')],
          touchDrag: true,
          mouseDrag: true,
          stopOnHover: true,
          autoHeight: false,
          autoPlay: this_carousel.data('autoplay'),
          afterInit: function () {
            $(this).imagesLoaded(function () {
              setTimeout(function () {
                $(".meteorite-team").each(function () {
                  // Fixes a bug where the outer-wrapper has wrong width because when the plugin calculates the width
                  // the SiteOrigin wrapper isn't loaded 
                  $(this).data('owlCarousel').updateVars();
                });
              }, 0);
            });
          },
        });
      });
    }
  }
  meteorite_teamCarousel();


  /**
   * Init blog post carousel
   */
  var meteorite_newsCarousel = function () {
    if ($(".meteorite-latest-news-carousel").length) {
      $(".meteorite-latest-news-carousel").each(function () {
        var this_carousel = $(this);
        this_carousel.owlCarousel({
          navigation: false,
          pagination: this_carousel.data('pagination'),
          responsive: true,
          items: this_carousel.data('items-large'),
          itemsDesktopSmall: [1400, this_carousel.data('items-large')],
          itemsTablet: [992, this_carousel.data('items-medium')],
          itemsTabletSmall: [768, this_carousel.data('items-medium')],
          itemsMobile: [480, this_carousel.data('items-small')],
          touchDrag: true,
          mouseDrag: true,
          stopOnHover: true,
          autoHeight: false,
          autoPlay: this_carousel.data('autoplay'),
          afterInit: function () {
            $(this).imagesLoaded(function () {
              setTimeout(function () {
                $(".meteorite-latest-news-carousel").each(function () {
                  // Fixes a bug where the outer-wrapper has wrong width because when the plugin calculates the width
                  // the SiteOrigin wrapper isn't loaded 
                  $(this).data('owlCarousel').updateVars();
                });
              }, 0);
            });
          },
        });
      });
    }
  }
  meteorite_newsCarousel();


  /**
   * Init clients carousel
   */
  var meteorite_clientsCarousel = function () {
    if ($(".meteorite-clients").length) {
      $(".meteorite-clients").each(function () {
        var this_carousel = $(this);
        this_carousel.owlCarousel({
          navigation: false,
          pagination: this_carousel.data('pagination'),
          responsive: true,
          items: this_carousel.data('items-large'),
          itemsDesktopSmall: [1400, this_carousel.data('items-large')],
          itemsTablet: [992, this_carousel.data('items-medium')],
          itemsTabletSmall: [768, this_carousel.data('items-medium')],
          itemsMobile: [480, this_carousel.data('items-small')],
          touchDrag: true,
          mouseDrag: true,
          stopOnHover: true,
          autoHeight: false,
          autoPlay: this_carousel.data('autoplay'),
          afterInit: function () {
            $(this).imagesLoaded(function () {
              setTimeout(function () {
                $(".meteorite-clients").each(function () {
                  // Fixes a bug where the outer-wrapper has wrong width because when the plugin calculates the width
                  // the SiteOrigin wrapper isn't loaded 
                  $(this).data('owlCarousel').updateVars();
                });
              }, 0);
            });
          },
        });
      });
    }
  }
  meteorite_clientsCarousel();

  /**
   * Init projects carousel
   */
  var meteorite_projectsCarousel = function () {
    if ($(".meteorite-projects-carousel").length) {
      $(".meteorite-projects-carousel").each(function () {
        var this_carousel = $(this);
        var carouselCols = this_carousel.data('cols');

        this_carousel.owlCarousel({
          navigation: false,
          pagination: this_carousel.data('pagination'),
          responsive: true,
          items: carouselCols,
          itemsDesktopSmall: [1400, carouselCols],
          itemsTablet: [992, 3],
          itemsTabletSmall: [768, 2],
          itemsMobile: [480, 1],
          touchDrag: true,
          mouseDrag: true,
          stopOnHover: true,
          autoHeight: true,
          autoPlay: this_carousel.data('autoplay'),
          afterInit: function () {
            $(this).imagesLoaded(function () {
              setTimeout(function () {
                $(".meteorite-projects-carousel").each(function () {
                  // Fixes a bug where the outer-wrapper has wrong width because when the plugin calculates the width
                  // the SiteOrigin wrapper isn't loaded 
                  $(this).data('owlCarousel').updateVars();
                });
              }, 0);
            });
          },
        });
        // Custom Navigation Events
        var owl = this_carousel;
        this_carousel.parent().find(".next").click(function () {
          owl.trigger('owl.next');
        });
        this_carousel.parent().find(".prev").click(function () {
          owl.trigger('owl.prev');
        });
      });
    }
  }
  meteorite_projectsCarousel();

  /**
   * Init related posts carousel for blog post pages
   */
  var meteorite_relatedPostsCarousel = function () {
    if ($(".related-posts-carousel").length) {
      $(".related-posts-carousel").each(function () {
        var this_carousel = $(this);
        this_carousel.owlCarousel({
          navigation: false,
          pagination: this_carousel.data('pagination'),
          responsive: true,
          items: this_carousel.data('items-large'),
          itemsDesktopSmall: [1400, this_carousel.data('items-large')],
          itemsTablet: [992, this_carousel.data('items-medium')],
          itemsTabletSmall: [768, this_carousel.data('items-medium')],
          itemsMobile: [480, this_carousel.data('items-small')],
          touchDrag: true,
          mouseDrag: true,
          autoHeight: false,
          autoPlay: this_carousel.data('autoplay'),
          stopOnHover: this_carousel.data('stop-on-hover'),
          afterInit: function () {
            $(this).imagesLoaded(function () {
              setTimeout(function () {
                $(".related-posts-carousel").each(function () {
                  // Fixes a bug where the outer-wrapper has wrong width because when the plugin calculates the width
                  // the SiteOrigin wrapper isn't loaded 
                  $(this).data('owlCarousel').updateVars();
                });
              }, 0);
            });
          },
        });
        // Custom Navigation Events
        var owl = this_carousel;
        this_carousel.parent().find(".next").click(function () {
          owl.trigger('owl.next');
        });
        this_carousel.parent().find(".prev").click(function () {
          owl.trigger('owl.prev');
        });
      });
    }
  }
  meteorite_relatedPostsCarousel();

  /**
   * Init the gallery post format carousel
   */
  var meteorite_formatGalleryCarousel = function () {
    if ($(".format-gallery-carousel").length) {
      $(".format-gallery-carousel").each(function () {
        var this_carousel = $(this);
        this_carousel.owlCarousel({
          navigation: false,
          pagination: true,
          responsive: true,
          items: 1,
          touchDrag: true,
          mouseDrag: true,
          autoHeight: true,
          autoPlay: this_carousel.data('autoplay'),
          singleItem: true,
          stopOnHover: this_carousel.data('stop-on-hover'),
          afterInit: function () {
            $(this).imagesLoaded(function () {
              setTimeout(function () {
                $(".format-gallery-carousel").each(function () {
                  // Fixes a bug where the outer-wrapper has wrong width because when the plugin calculates the width
                  // the SiteOrigin wrapper isn't loaded 
                  $(this).data('owlCarousel').updateVars();
                });
              }, 0);
            });
          },
        });
        // Custom Navigation Events
        var owl = this_carousel;
        this_carousel.parent().find(".next").click(function () {
          owl.trigger('owl.next');
        });
        this_carousel.parent().find(".prev").click(function () {
          owl.trigger('owl.prev');
        });
      });
    }
  }
  meteorite_formatGalleryCarousel();

  /**
   * Init the header slider
   */
  var meteorite_headerSlider = function () {
    if ($(".terra-themes-header-slider").length) {
      $(".terra-themes-header-slider").owlCarousel({
        navigation: $('.terra-themes-header-slider').data('navigation'),
        pagination: $('.terra-themes-header-slider').data('pagination'),
        responsive: true,
        items: 1,
        responsiveRefreshRate: 1,
        touchDrag: false,
        mouseDrag: false,
        autoHeight: true,
        addClassActive: true,
        autoPlay: $('.terra-themes-header-slider').data('autoplay'),
        singleItem: true,
        transitionStyle: $('.terra-themes-header-slider').data('transition'),
        stopOnHover: $('.terra-themes-header-slider').data('hoverstop'),
        afterInit: function () {
          $(this).imagesLoaded(function () {
            setTimeout(function () {
              $(".terra-themes-header-slider").each(function () {
                // Fixes a bug where the outer-wrapper has wrong width because when the plugin calculates the width
                // the SiteOrigin wrapper isn't loaded 
                $(this).data('owlCarousel').updateVars();
              });
            }, 0);
          });

          $('.owl-item.active .header-image.do-animate').each(function () {
            $(this).addClass('meteorite-show');
          });

          $('.parallax-text, .header-button-down').hide().delay(450).fadeIn(400);

          // Chrome fix not autoplaying the first video by default (v68.0.3440.106)
          if ($('.owl-item.active .header-video video').length) {
            $('.owl-item.active .header-video video')[0].play();
          }
        },
        beforeMove: function () {
          setTimeout(function () {
            $('.owl-item:not(.active) .header-image.do-animate').removeClass('meteorite-show');
            if ($('.owl-item:not(.active) .header-video video').length) {
              $('.owl-item:not(.active) .header-video video')[0].pause();
            }
          }, 500);
        },
        afterMove: function () {
          if ($('.owl-item.active .header-video video').length) {
            $('.owl-item.active .header-video video')[0].currentTime = 0;
            $('.owl-item.active .header-video video')[0].play();
          }
          $('.owl-item.active .header-image.do-animate').each(function () {
            $(this).addClass('meteorite-show');
          });
          $('.parallax-text, .header-button-down').hide().delay(450).fadeIn(400);
        },
      });

      // Custom Navigation Events
      var owl = $('.terra-themes-header-slider');
      $(".terra-themes-slider-controls .next").click(function () {
        owl.trigger('owl.next');
      });
      $(".terra-themes-slider-controls .prev").click(function () {
        owl.trigger('owl.prev');
      });
    }
  }
  meteorite_headerSlider();


  /**
   * Call fitVids
   */
  var meteorite_responsiveVideo = function () {
    $("body").fitVids();
  }
  meteorite_responsiveVideo();


  /**
   * Count the fact values on appearence
   */
  var meteorite_facts = function () {
    if ($('.meteorite-facts').length) {
      $('.meteorite-facts .fact-item.count-me').on('on-appear', function () {
        $(this).find('.fact-count').each(function () {
          var to = parseInt($(this).attr('data-to')),
            speed = parseInt($(this).attr('data-speed'));
          $(this).countTo({
            to: to,
            speed: speed
          });
        });
      });
    }
  }
  meteorite_facts();


  /**
   * Adds target="_blank" to social media widget menu items
   */
  var meteorite_socialMenuTarget = function () {
    $('.social-menu-widget a').attr('target', '_blank');
  }
  meteorite_socialMenuTarget();


  /**
   * Init isotope filtering for project images
   */
  var meteorite_portfolioIsotope = function () {
    if ($('.meteorite-projects').length) {
      $('.meteorite-projects').each(function () {

        var self = $(this);
        var filterNav = self.find('.project-filter').find('a');

        var projectIsotope = function ($selector) {

          $selector.isotope({
            filter: '*',
            itemSelector: '.project-item',
            percentPosition: true,
            animationOptions: {
              duration: 750,
              easing: 'liniar',
              queue: false,
            }
          });
        }

        self.find('.isotope-container').imagesLoaded(function () {
          projectIsotope(self.find('.isotope-container'));
        });

        $(window).load(function () {
          projectIsotope(self.find('.isotope-container'));
        });

        filterNav.click(function () {
          var selector = $(this).attr('data-filter');
          filterNav.removeClass('active');
          $(this).addClass('active');

          self.find('.isotope-container').isotope({
            filter: selector,
            animationOptions: {
              duration: 750,
              easing: 'liniar',
              queue: false,
            }
          });
          return false;
        });

      });
    }
  }
  meteorite_portfolioIsotope();


  /**
   * Custom post tabs function that replaces the bootstrap.js functionality since Meteorite 2.4
   */
  var meteorite_postTabs = function () {
    if ($('.meteorite-post-tabs-widget').length) {
      $(document).on('click', '.meteorite-post-tabs-widget a[data-toggle="tab"]', function (e) {
        e.preventDefault();
        var widgetContainer = $(this).closest('.meteorite-post-tabs-widget');
        var target = $(this).attr('href');
        widgetContainer.find('li').removeClass('in active');
        $(this).closest().addClass('in active');
        widgetContainer.find('.tab-pane').removeClass('in active');
        widgetContainer.find(target).addClass('in active');
      });
    }
  }
  meteorite_postTabs();


  /**
   * Resize videos in Terra Slider to fit view
   */
  var meteorite_resizeVideoSlides = function () {
    if ($('.terra-themes-header-slider').length) {
      $('.terra-themes-header-slider .video-wrap').each(function (i) {
        var min_w = 992; // minimum video width allowed
        var video_width_original = 1280;  // original video dimensions
        var video_height_original = 720;
        var vid_ratio = 1280 / 720;
        var header_height = $(this).closest('.terra-themes-header-slider').outerHeight();

        var $sectionWidth = $(this).closest('.terra-themes-header-slider').outerWidth();
        $(this).width($sectionWidth);

        var $sectionHeight = $(this).closest('.terra-themes-header-slider').outerHeight();
        min_w = vid_ratio * ($sectionHeight + 20);
        $(this).height($sectionHeight);

        var scale_h = $sectionWidth / video_width_original;
        var scale_v = ($sectionHeight - header_height) / video_height_original;
        var scale = scale_v;
        if (scale_h > scale_v) {
          scale = scale_h;
        }
        if (scale * video_width_original < min_w) {
          scale = min_w / video_width_original;
        }

        $(this).find('video, .mejs-overlay, .mejs-poster').width(Math.ceil(scale * video_width_original + 2));
        $(this).find('video, .mejs-overlay, .mejs-poster').height(Math.ceil(scale * video_height_original + 2));
        $(this).scrollLeft(($(this).find('video').width() - $sectionWidth) / 2);
        $(this).find('.mejs-overlay, .mejs-poster').scrollTop(($(this).find('video').height() - ($sectionHeight)) / 2);
        $(this).scrollTop(($(this).find('video').height() - ($sectionHeight)) / 2);
      });
    }
  }
  meteorite_resizeVideoSlides();
  $(window).on('resize', meteorite_resizeVideoSlides);


  /**
   * Remove the preloader after page load
   */
  var meteorite_removePreloader = function () {
    $('#preloader').css('opacity', 0);
    setTimeout(function () { $('#preloader').hide(); }, 600);
  }
  meteorite_removePreloader();

})(jQuery);