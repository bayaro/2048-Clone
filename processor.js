
// we don't use additional array because of in any case we should check/move
// numbers throw cells, so we should check as current as neibour cell

$(document).ready( function() {
    $('.map').add_boxes({'rows':5,'cols':5}).add_number().add_number();
    $(window).resize();
});

$(window).resize( function() {
    $('.map').css( 'width', $('.map').height() + 'px' );
}).keydown( function(e) {
    switch(e.which){
    case 37: // left
    case 38: // up
    case 39: // right
    case 40: // down
        break;
    default:
        return;
    }
    e.preventDefault();
    $('.map').shift();
});


(function($) {
    $.fn.add_boxes = function( customOptions ) {
        var options = {
            rows: 5,
            cols: 5
        };

        $.extend( options, customOptions );

        // clear map, if, in future, we will want to change rows/cols interactivelly
        map = $(this).html( '' ).attr( 'cell_count', options.rows * options.cols );
        boxH = ( 100 / options.rows ) + '%';
        boxW = ( 100 / options.cols ) + '%';
        fSize = ( 60 / options.rows ) + 'vh';
        for( r = 0; r < options.rows; r++ ) {
            row = $( '<div class="row">' ).css( 'height', boxH ).appendTo( map );
            for( c = 0; c < options.cols; c++ ) {
                cell = $( '<div class="box"></div>' ).css( {'width':boxW,'font-size':fSize} )
                    .attr( 'id','n_' + ( r * options.cols + c ) ).appendTo( row );
            }
        }

        return $(this);
    };

    $.fn.add_number = function() {
        $(this).find('.box#n_' + Math.floor( Math.random() * $(this).attr( 'cell_count' ) ) )
            .text('2'); // TODO random number (?)
        return $(this);
    };

    $.fn.shift = function() {
        return $(this);
    };
})(jQuery);
