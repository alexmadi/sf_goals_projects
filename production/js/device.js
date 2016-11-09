// device JS
var viewportWidth = {
    'mobile' : { 'maxWidth' : 767 },
    'tablet' : { 'maxWidth' : 1023 }
};

var layout = {
    getMode : function () {
        var windowWidth = window.innerWidth,
            deviceScreenWidth = screen.width;
        if( (windowWidth <= viewportWidth.mobile.maxWidth) || (deviceScreenWidth <= viewportWidth.mobile.maxWidth)) {
            return 'mobile';

        } else if ( windowWidth <= viewportWidth.tablet.maxWidth ) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    },
    isMobileView: function() {
        return this.getMode() === 'mobile';
    },
    isTabletView: function() {
        return this.getMode() === 'tablet';
    },
    isDesktopView: function() {
        return this.getMode() === 'desktop';
    }
}

function defineModeChange() {
    var resizeId;

    $(window).resize(function() {
        clearTimeout(resizeId);
        resizeId = setTimeout(resizeDelay, 500);
    });

    var viewMode = layout.getMode();

    function resizeDelay() {
        $(document).trigger('window.resize');
        var layoutView = layout.getMode();
        if(viewMode != layoutView) {
            viewMode = layoutView;
            $(document).trigger('window.modechanged', { mode: viewMode });
        }
    }
}
defineModeChange();

// define device view

// if (layout.isMobileView()) {
//     console.log('isMobile');
// } 

// define modechange
// $(document).on('window.modechanged', function (event) {
//     console.log('modechanged');
// });

// define window resize
// $(document).on('window.resize', function() {
//     console.log('resized');
// });