(function($){
    $.fn.Am_slider = function(options) {
        var settings = {
            autoplay: true,
            speed: 2500,
            pag: true,
            controls: true,
            mouseDrag: true,
            touchDrag: true,
        };

        return this.each(function() {

            $(window).on('resize', function() {
                $('.am_slider_outer').each(function() {
                    initSlideSize($(this), $(this).find('.am_slider_item'));
                });
            });

            // drag EVENT

            function sliderDragging($sliderContainer) {
                var dragging = false,
                    draggableElement = $sliderContainer.find('.am_slider'),
                    $sliderItem = $sliderContainer.find('.am_slider_item'),
                    startedDragPosition_x  = 0,
                    isDraggingToLeft = true,
                    isDraggingToRight = true,
                    sliderItemWidth = $sliderItem.outerWidth(),
                    slidesCount = $sliderItem.length,
                    x;

                draggableElement.mousedown(function(event) {
                    $sliderContainer.css('cursor','-webkit-grabbing');
                    dragging = true;
                    event.preventDefault();
                    startedDragPosition_x = event.pageX;
                    isDraggingToLeft = false;
                    isDraggingToRight = false;
                });

                draggableElement.mousemove(function(event){
                    var currentDragPosition_x = 0,
                        distanceToMoveSlides,
                        newActiveSlideIndex = $sliderContainer.find('.am_slider_item.active').index() + 1;

                    if (dragging) {
                        currentDragPosition_x = event.pageX;

                        if (currentDragPosition_x>startedDragPosition_x) {
                            var gapBtwStartedAndCurrentDdrag_Right = currentDragPosition_x - startedDragPosition_x;

                            isDraggingToRight = true;
                            distanceToMoveSlides = ((sliderItemWidth * (newActiveSlideIndex - 1)) - gapBtwStartedAndCurrentDdrag_Right) * - 1;
                            distanceToMoveSlidesOnCircleEnd = sliderItemWidth * 4 - gapBtwStartedAndCurrentDdrag_Right;

                            if (isDraggingToRight) {
                                $sliderContainer.find('.am_slider_item').css('transform', 'translateX(' + distanceToMoveSlides + 'px)');

                                if ($sliderContainer.find('.am_slider_item').eq(0).hasClass('active')) {
                                    $sliderContainer.find('.am_slider_item').eq(slidesCount-1).css('transform', 'translateX(-' + distanceToMoveSlidesOnCircleEnd + 'px)');
                                }
                            }
                           
                            $(window).mouseup(function(event){

                                if ((isDraggingToRight) && (gapBtwStartedAndCurrentDdrag_Right > 1) && (currentDragPosition_x>startedDragPosition_x)) {
                                    $sliderContainer.find('.prev').click();
                                    gapBtwStartedAndCurrentDdrag_Right = 0;
                                    isDraggingToRight = false;
                                }

                                dragging = false;
                                $sliderContainer.css('cursor','auto');
                            });

                        } else {
                            var gapBtwStartedAndCurrentDdrag_Left = startedDragPosition_x - currentDragPosition_x;

                            isDraggingToLeft = true;
                            distanceToMoveSlides = ((sliderItemWidth*(newActiveSlideIndex - 1)) + gapBtwStartedAndCurrentDdrag_Left) * -1;
                            distanceToMoveSlidesOnCircleEnd = sliderItemWidth - gapBtwStartedAndCurrentDdrag_Left;

                            if (isDraggingToLeft) {
                                $sliderContainer.find('.am_slider_item').css('transform', 'translateX(' + distanceToMoveSlides + 'px)');

                                if  ($sliderContainer.find('.am_slider_item').eq(slidesCount-1).hasClass('active')) {
                                    $sliderContainer.find('.am_slider_item').eq(0).css('transform', 'translateX(' + distanceToMoveSlidesOnCircleEnd + 'px)');
                                }
                            }
                          
                            $(window).mouseup(function(event){
                            
                                if ((isDraggingToLeft) && (gapBtwStartedAndCurrentDdrag_Left > 1) && (currentDragPosition_x<startedDragPosition_x)) {
                                    $sliderContainer.find('.next').click();
                                    gapBtwStartedAndCurrentDdrag_Left = 0;
                                    isDraggingToLeft = false; 
                                }

                                dragging = false; 
                                $sliderContainer.css('cursor','auto');
                            });
                        }
                    }
                });
            }
            // end sliderDragging

            function initSlideSize($sliderContainer,$sliderItem) {

                function updatePositions($sliderItem) {
                    var slidesCount = $sliderItem.length,
                        translate = '';

                    for (var i=0; i <= slidesCount-1; i++) {
                        if ($sliderItem.eq(i).hasClass('active')) {
                            if (i > 0) {
                                $sliderItem.css('transform', 'translateX(-' + distanceToMoveSlides * i + 'px)');
                            }
                        }
                    }

                    if ($sliderItem.eq(0).hasClass('active')) {
                        $sliderItem.css('transform', '');
                        $sliderItem.eq(slidesCount-1).css('transform', 'translateX(-' + distanceToMoveSlides*slidesCount + 'px)');
                        $sliderItem.eq(slidesCount-1).css('z-index', '2');
                    }

                    if ($sliderItem.eq(slidesCount - 1).hasClass('active')) {
                        $sliderItem.css('transform', 'translateX(-' + distanceToMoveSlides*(slidesCount-1) + 'px)');
                        $sliderItem.eq(0).css('transform', 'translateX(+' + distanceToMoveSlides + 'px)');
                        $sliderItem.eq(0).css('z-index', '6');
                    }
                    if ($sliderItem.eq(slidesCount-2).hasClass('active')) {
                        $sliderItem.eq(slidesCount-1).css('z-index', '3');
                    }
                }

                function ChangePosition($sliderItem, direction) {
                    var slidesCount = $sliderItem.length;
                    $sliderItem.css('transition','.7s');

                    if (direction == "left") {
                        var prevCounter = activeSlideIndex - 1;

                        activeSlideIndex = prevCounter;
                        newActiveSlideIndex = activeSlideIndex;

                        if (prevCounter < 1 ) {
                            prevCounter = slidesCount;
                            activeSlideIndex = slidesCount;
                        }

                        $sliderItem.eq(activeSlideIndex-slidesCount).removeClass('active');
                        $sliderItem.eq(activeSlideIndex-(slidesCount+1)).addClass('active');
                        
                        updatePositions($sliderItem);

                        $sliderContainer.find('.am_slider_pag_item').removeClass('active');
                        $sliderContainer.find('.am_slider_pag_item').eq(activeSlideIndex - 1).addClass('active');
                    }

                    if (direction == "right") {
                        var nextCounter = activeSlideIndex + 1;

                        activeSlideIndex = nextCounter;
                        newActiveSlideIndex = activeSlideIndex;

                        if (nextCounter > slidesCount ) {
                            nextCounter = 1;
                            activeSlideIndex = 1;
                        }

                        $sliderItem.eq(activeSlideIndex-2).removeClass('active');
                        $sliderItem.eq(activeSlideIndex-1).addClass('active');
                        
                        updatePositions($sliderItem);

                        $sliderContainer.find('.am_slider_pag_item').removeClass('active');
                        $sliderContainer.find('.am_slider_pag_item').eq(activeSlideIndex - 1).addClass('active');
                    }
                }

                var activeSlideIndex =  $sliderContainer.find('.am_slider_item.active').index() + 1,
                    newActiveSlideIndex = activeSlideIndex,
                    sliderContainerWidth = $sliderContainer.css('width');

                $sliderItem.outerWidth(sliderContainerWidth);
                slidesCount = $sliderItem.length;

                var distanceToMoveSlides = $sliderItem.outerWidth();

                updatePositions($sliderItem);
                $sliderItem.css('transition','0s');

                $buttonNextSlide = $sliderContainer.find('.next');
                $buttonPrevSlide = $sliderContainer.find('.prev');

                $buttonPrevSlide.click(function(){
                   ChangePosition($sliderItem, "left");
                });

                $buttonNextSlide.click(function(){
                   ChangePosition($sliderItem, "right");
                });


                //touchDrag Event

                if ((layout.isMobileView()) && (settings.touchDrag == true)) {
                    $sliderItem.on( "swiperight", function( event ) {
                        $buttonPrevSlide.click();
                    });

                    $sliderItem.on( "swipeleft", function( event ) {
                        $buttonNextSlide.click();
                    });
                }

                // pagination
                
                $sliderContainer.find('.am_slider_pag_item').click(function() {
                    $sliderItem.css('transition','.3s');
                    $sliderContainer.find('.am_slider_pag_item.active').removeClass('active');
                    $sliderContainer.find('.am_slider_item.active').removeClass('active');
                    $(this).addClass('active');
                   
                    var active_pag_index = $(this).index();

                    $sliderItem.eq(active_pag_index).addClass('active');

                    activeSlideIndex_prev = activeSlideIndex;
                    activeSlideIndex = active_pag_index + 1;

                    updatePositions($sliderItem);
                });
            };

            function initSlider($sliderContainer) {
                $sliderContainer.find('ul').wrap("<div class='am_slider'></div>" );
                $sliderContainer.find('ul').addClass('am_slider_inner');
                $sliderContainer.find('li').addClass('am_slider_item');
                $sliderContainer.find('li:first-child').addClass('active');
                $sliderContainer.append("<span class='prev'>prev</span><span class='next'>next</span>");
                $sliderContainer.append("<ul class='am_slider_pag'></ul>");

                // selectors
                $sliderItem = $sliderContainer.find('.am_slider_item');
                $sliderPagination = $sliderContainer.find('.am_slider_pag');

                var slidesCount = $sliderItem.length;

                for (var i=1; i <= slidesCount; i++) {
                    $sliderPagination.append("<li class='am_slider_pag_item'></li>");
                }

                $sliderPagination.children().first().addClass('active');
            }

            if (options) {
               $.extend(settings, options);
            }

            // classes 

            var $sliderContainer = $(this);

            initSlider($sliderContainer);

            var $sliderPagination = $sliderContainer.find('.am_slider_pag');

            // RUNNING SLIDER

            if (settings.autoplay) {
                function run_am_slider() {
                  $sliderContainer.find('.next').click();
                }

                var interval = setInterval(run_am_slider, settings.speed);

                $sliderContainer.find('.am_slider, .next, .prev').mouseover(function() {
                    clearInterval(interval);
                }); 

                $sliderPagination.find('.am_slider_pag_item').click(function() {
                    clearInterval(interval);
                    interval = setInterval(run_am_slider, settings.speed);
                });

                $sliderContainer.find('.am_slider').mouseout(function() {
                    interval = setInterval(run_am_slider, settings.speed);
                });
            }

            // ran

            if (settings.pag == false) {
                $sliderPagination.css('display','none');
            }
      
            if (settings.controls == false) {
                $sliderContainer.find('.next, .prev').css('display','none');
            }

            // initialize and resize current slide dimentions
            $('.am_slider_outer').each(function() {
                initSlideSize($(this), $(this).find('.am_slider_item'));
            }); 

            if (settings.mouseDrag == true) {
                if (!layout.isMobileView()) {
                    sliderDragging($sliderContainer);
                }
            }
        });
    };
})(jQuery);

/*
usage

1.add class="" to outer container
2.call Am_slider

$('.slider_1').Am_slider({
    autoplay: true,
    speed: "2500",
    pag: true,
    controls: true,
}); 

*/