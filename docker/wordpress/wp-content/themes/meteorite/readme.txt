=== Meteorite ===
Contributors: terrathemes
Tags: one-column, two-columns, three-columns, left-sidebar, right-sidebar, grid-layout, custom-background, custom-colors, custom-menu, custom-logo, featured-image-header, featured-images, footer-widgets, full-width-template, post-formats, theme-options, threaded-comments, translation-ready, blog, portfolio
License: GNU General Public License v3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

== Description ==

Meteorite is a powerful multipurpose WordPress theme for business and portfolio websites. It brings everything you need to create an expressive website: Control over all colors and access to more than 800 Google fonts to match your corporate identity, header image or slider, different navigation types, multiple blog layouts and more than 20 widgets. Meteorite is build with SEO in mind, responsive, translation ready and supports the page builders Elementor and SiteOrigin. Start creating your website with Meteorite!

== Installation ==

1. In your admin panel, go to Appearance > Themes and click the Add New button.
2. Click Upload and Choose File, then select the theme's .zip file. Click Install Now.
3. Click Activate to use your new theme right away.

== Frequently Asked Questions ==

= Does Meteorite support any special plugins? =
Meteorite includes support for Elementor, Page Builder by SiteOrigin, Terra Themes Tools and Meteorite Extensions.

== Screenshots ==

== Changelog ==
= 2.5.2 | 01/17/2023 =
* Removed old parallax fix for Webkit which was now causing problems

= 2.5.1 | 12/26/2020 =
* Fixed wrong carousel width calculation

= 2.5 | 12/26/2020 =
* Moved and enqueued imagesLoaded before other scripts
* Rewritten main.js file to work with the new jQuery version of WordPress 5.6 (window.on(load) not always fired inside document.ready)
* Fixed mobile menu button not always working and preloader not hiding by rewriting main.js

= 2.4.3 | 12/21/2020 =
* Changed jQuery click functions to document with context

= 2.4.2 | 12/21/2020 =
* Added date param to main.min.js and scripts.js

= 2.4.1 | 12/14/2020 =
* Added required wp_body_open function

= 2.4 | 12/14/2020 =
* Fixed console error about jQuery and bootstrap.js
* Removed bootstrap.js and handled PostTabs widget with a custom function

= 2.3.1 | 05/24/2020 =
* Added Requires PHP and Tested up to as style.css header fields due to theme requirements

= 2.3 | 02/07/2020 =
* Background color chosen in Customizer will be applied to Gutenberg editor
* Moved demo import files and setup into Meteorite Extensions due to theme requirements
* Updated meteorite.pot

= 2.2.1 | 10/26/2019 =
* Fixed a JS error caused by Terra Slider when no video slide is used

= 2.2 | 08/19/2019 =
* Added keyboard navigation for main menu
* Added several screen reader texts
* Changed some outline and focus stylings for better accessibility
* Changed project filter styling for better accessibility
* Minor HTML changes for better accessibility
* Removed template-parts/content-search.php as it has not been used since version 2.0
* Removed changelog from theme info page because of missing internationalization
* Updated meteorite.pot

= 2.1 | 12/10/2018 =
* Added proper float clearing after post content
* Added word-break for post titles
* Added small width single post option to support Gutenbergs align-wide
* Added Gutenberg editor styles
* Changed theme description
* Changed checkbox/radio button display style
* Changed list (ul, ol) appearance
* Changed gallery post format image max-width from 850 to 1140
* Changed Google fonts handling
* Changed minor stylings
* Fixed white post details of image posts without a post thumbnail set
* Fixed error in gallery post type if shortcode has no ids
* Removed typo in changelog
* Removed html5shiv for IE9 and lower
* Updated meteorite.pot

= 2.0 | 09/24/2018 =
* Added option for related posts and related projects in the Customizer
* Added fallback for topbar/footer/404 menu if no menu is assigned in the specific location
* Added masonry style for search
* Added footer link to privacy page, if set in the WordPress settings
* Added a notic about the theme derivation in style.css
* Added theme-side breadcrumbs for titlebar
* Added support for post formats: Aside, Audio, Gallery, Image, Link, Quote, Status, Video
* Added right-to-left support
* Added HTML comments in source code for better orientation
* Added image sizes on blog/archives/search page
* Added support for Fade In (Up) One By One for Elementor
* Added theme info page
* Added demo import
* Added admin notice for theme info page
* Changed .hentry to article for masonry layout since not all items in search do have the .hentry class (masonry-init.js)
* Changed theme screenshot to follow recent changes of the WordPress.org requirements
* Changed theme description
* Changed search submit button in searchform.php
* Changed location of custom-editor-style.css. Moved to /inc/admin/css/
* Changed .nav-placeholder to be located directly in HTML code instead of created by JS
* Fixed missing space between classes with masonry blog layout while having blog/archives on full width
* Fixed the header slider not showing on the blog page
* Fixed the header text not showing if the homepage shows the latest posts
* Fixed Terra Slider not autoplaying the first video slide in Google Chrome
* Fixed heading for day/month/year archives that printed doubled h1 tags
* Fixed missing footer widget areas, if the first footer widget area is empty
* Fixed parallax background not being parallax caused by 1.13.1
* Fixed issues with multiple fade-in-(up-)single animations within one row
* Improved content.php and removed unnecessary code
* Improved navigation fallback text if no menu is assigned in the specific location
* Improved diverse smaller styling issues
* Improved php code for better readability and best practices in all files
* Removed option to show full content on search page due to bad results when using a Page Builder
* Removed option for the search layout, it now has the same as the blog/archives
* Removed option for Yoast/WooCoomerce breadcrumbs. Instead added own breadcrumbs (see above)
* Removed image size meteorite-tiny-thumb which was only used in post tab widget (in companion plugin)
* Updated theme tags
* Updated meteorite.pot

= 1.13.2 | 08/03/2018 =
* Fixed a non-object error within a header image function

= 1.13.1 | 07/13/2018 =
* Fixed background image bug in Chrome

= 1.13 | 02/27/2018 =
* Added support for Elementor and Beaver Builder
* Fixed horizontal scrollbar caused by dropdown menus
* Improved dropdown menu animation
* Renamed Customizer section (Navigation type > Topbar type)

= 1.12.2 | 02/06/2018 =
* Small CSS adjustments (textarea, .label)

= 1.12.1 | 01/24/2018 =
* Fixed an error with the breadcrumbs

Full changelog can be seen on https://terra-themes.com/changelog/meteorite/.


== Credits ==

a) Underscores
Meteorite is based on Underscores 
Resource URI: http://underscores.me/
Copyright: 2012-2016 Automattic, Inc.,
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

b) Bootstrap 
Resource URI: http://getbootstrap.com/
Copyright: 2011-2015 Twitter, Inc
License: MIT
License URI: http://opensource.org/licenses/MIT

c) FitVids 
Resource URI: http://fitvidsjs.com/
Copyright: Chris Coyier, Paravel
License: WTFPL
License URI: http://www.wtfpl.net/txt/copying/

d) Isotope 
Resource URI: http://isotope.metafizzy.co/
Copyright: Metafizzy
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html

e) Owlcarousel 
Resource URI: http://owlgraphic.com/owlcarousel/
Copyright: Bartosz Wojciechowski
License: MIT
License URI: http://opensource.org/licenses/MIT

f) jQuery Waypoints 
Resource URI: http://imakewebthings.com/jquery-waypoints/
Copyright: Caleb Troughton
License: MIT
License URI: http://opensource.org/licenses/MIT

g) jQuery CountTo
Resource URI: https://github.com/mhuggins/jquery-countTo
Copyright: Matt Huggins
License: MIT
License URI: http://opensource.org/licenses/MIT

h) Icon set used is FontAwesome 
Resource URI: http://fontawesome.io
Copyright: Dave Gandy
License: SIL Open Font License | MIT
License URI: https://scripts.sil.org/OFL | http://opensource.org/licenses/MIT

i) easy-pie-chart 
Resource URI: https://rendro.github.io/easy-pie-chart/
Copyright: Robert Fleischmann
License: MIT
License URI: http://opensource.org/licenses/MIT

j) Image used in screenshot 
The design was inpired from the work of DKNG
Resource URI: https://dribbble.com/shots/2549267-Mystery-Project-76-1
Copyright: Terra Themes
License: CC0 1.0
License URI: https://creativecommons.org/publicdomain/zero/1.0/

k) Accessible navigation
Resource URI: https://github.com/anace/keyboard-navigation
Copyright: anace
License: GPLv3
License URI: https://www.gnu.org/licenses/gpl-3.0.html