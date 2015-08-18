
$(document).ready( function() {
    $('.map').add_boxes({'rows':5,'cols':5});
    $(window).resize();
});

$(window).resize( function() {
    $('.map').css( 'width',$('.map').height() + 'px' );
});

(function ($) {
    $.fn.add_boxes = function (customOptions) {
        var options = {
            rows: 5,
            cols: 5
        };

        $.extend(options, customOptions);

        map = $(this);
        boxH = ( 100 / options.rows ) + '%';
        boxW = ( 100 / options.cols ) + '%';
        for( r = 0; r < options.rows; r++ ) {
            row = $('<div class="row">').css( 'height', boxH ).appendTo( map );
            for( c = 0; c < options.cols; c++ ) {
                cell = $('<div class="box"> </div>').css( 'width', boxW ).attr('id','n_' + ( r * options.cols + c ) ).appendTo( row );
            }
        }
    };
})(jQuery);
