$(document).ready(function() {
    var $imgContainer = $(".product_primary_image"),
        $imgThumb = $('.product_images_section .thumb'),
        largeImgNameFormat = "_xl_" ,  // unicue name of Large Images
        imgCount = $imgThumb.length,
        selectedImage = $('.thumb.selected').index() + 1,
        largeImgWidth,
        largeImgHeight;

    $imgThumb.click(function(){

        $imgThumb.not(this).removeClass('selected');
        $(this).addClass('selected');
        $imgContainer.find('img').css('transform','');

        if ($imgThumb.hasClass('selected')) {
            var thumb_index = $(this).index() + 1;
            $imgContainer.find('img').attr("src","img/conf_m_img_" + thumb_index + ".jpg");
        }

        $imgContainer.find('img').removeClass('zoomed')
        selectedImage = $(this).index() + 1;

    });
    
    $('.product_images_section .product_img_prev').click(function() {
        var prevCounter = selectedImage - 1;
        selectedImage = prevCounter;
        
        if (prevCounter < 1 ) {
            prevCounter = imgCount;
            selectedImage = imgCount;
        }

        $imgContainer.find('img').attr("src","img/conf_m_img_" + selectedImage + ".jpg");
        $('.thumb').eq((selectedImage-1)).addClass('selected');
        $('.thumb').eq(selectedImage-4).removeClass('selected');
    });

    $('.product_images_section .product_img_next').click(function(){

        var nextCounter = selectedImage + 1;
        selectedImage = nextCounter;
        if (nextCounter > imgCount ) {
            nextCounter = 1;
            selectedImage = 1;
        }
        $imgContainer.find('img').attr("src","img/conf_m_img_" + selectedImage + ".jpg");
        $imgThumb.eq((selectedImage - 1)).addClass('selected');
        $imgThumb.eq((selectedImage - 2)).removeClass('selected');
    });

    function imgSize(){
        $imgContainer.find('img').load(function(){
            var curr_src = $(this).attr("src");
            if (curr_src.indexOf(largeImgNameFormat) >= 0) {
                largeImgWidth = $imgContainer.find('img').width();
                largeImgHeight = $imgContainer.find('img').height();
            }
        });
    }

    imgSize();

    $imgContainer.click(function(e){
        $(this).find('img').toggleClass('zoomed');
        if ($('.product_primary_image img').hasClass('zoomed')) {
            $(this).find('img').attr("src","img/conf_xl_img_" + selectedImage + ".jpg");
            newPosition = findNewPosition(e.offsetX, e.offsetY);
            setPosition();
        } else {
            $(this).find('img').attr("src","img/conf_m_img_" + selectedImage + ".jpg");
            $imgContainer.find('img').css('transform','');
        }
    }); 

    function findNewPosition(currentOffset_x, currentOffset_y) {
        imgContainerWidth = $imgContainer.width();
        imgContainerHeigth = $imgContainer.height();

        zoomRatio_x = largeImgWidth / imgContainerWidth;
        zoomRatio_y = largeImgHeight / imgContainerHeigth;

        fixedHorizontalPosition = largeImgWidth - currentOffset_x - (imgContainerWidth - currentOffset_x)* zoomRatio_x;
        fixedVerticalPosition = largeImgHeight - currentOffset_y - (imgContainerHeigth - currentOffset_y)* zoomRatio_y;

        return {
            x: fixedHorizontalPosition,
            y: fixedVerticalPosition
        }
    }

    function setPosition() {
        $imgContainer.find('img').css('transform',"translate(-"+ newPosition.x + "px" + ",-" + newPosition.y+"px)");
    }

    $('.product_images_container .product_img_prev, .product_images_container .product_img_next').click(function(){
        $imgContainer.find('img').removeClass('zoomed');
        $imgContainer.find('img').css('transform','');
    });

    $imgContainer.on('mousemove', function (e) {
        if ($imgContainer.find('img').hasClass('zoomed')) {
            currentOffsetLeft = e.pageX;
            currentOffsetTop = e.pageY;
            
            var imgPositionLeftOnMove = $imgContainer.offset().left,
                imgPositionTopOnMove = $imgContainer.offset().top,
                horizontalPosition = currentOffsetLeft - imgPositionLeftOnMove,
                verticalPosition = currentOffsetTop - imgPositionTopOnMove;

            newPosition = findNewPosition(horizontalPosition, verticalPosition);
            
            $imgContainer.find('img').css('transform',"translate(-"+newPosition.x+"px" + ",-" + newPosition.y+"px)")
        }
    });
});