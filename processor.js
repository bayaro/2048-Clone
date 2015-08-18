
// we don't use additional array because of in any case we should check/move
// numbers throw cells, so we should check as current as neibour cell

COLS = ROWS = 4;

function game_over() {
    alert( "Game Over" );
}

$(document).ready( function() {
    $('.map').add_boxes({'rows':ROWS,'cols':COLS}).add_number().add_number();
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
    case 27:
        e.preventDefault();
        $('.map').add_boxes({'rows':ROWS,'cols':COLS}).add_number().add_number();
        return;
    default:
        return;
    }
    e.preventDefault();
    $('.map').shift( e.which - 37 );
});

(function($) {
    $.fn.add_boxes = function( customOptions ) {
        var options = {
            rows: 5,
            cols: 5
        };

        $.extend( options, customOptions );

        // clear map, if, in future, we will want to change rows/cols interactivelly
        map = $(this).html( '' ).attr( 'cell_count', options.rows * options.cols )
            .attr( 'rows', options.rows ). attr( 'cols', options.cols );
        boxH = ( 100 / options.rows ) + '%';
        boxW = ( 100 / options.cols ) + '%';
        fSize = ( 33 / options.rows ) + 'vh';
        i = 2;
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
        sc = $(this).attr( 'cell_count' );
        n = Math.floor( Math.random() * sc );
        checked = 0;
        while( $(this).find('.box#n_' + n).text() && ++checked <= sc ) {
            if ( ++n >= sc ) n = 0;
        }
        if ( checked >= sc ) {
            game_over();
            return;
        }
        $(this).find('.box#n_' + n ).text('2'); // TODO random number (?)
        return $(this);
    };

    $.fn.shift = function( dir ) {
        map = $(this);
        rows = parseInt( map.attr( 'rows' ) );
        cols = parseInt( map.attr( 'cols' ) );
        switch( dir ) {
        case 0: // left
            for( r = 0; r < rows; r++ ) for( c = 1; c < cols; c++ ) {
                ci = r * cols + c;
                check_prev( ci, ci - 1 );
            }
            break;
        case 2: // right
            for( r = 0; r < rows; r++ ) for( c = cols-2; c >= 0; c-- ) {
                ci = r * cols + c;
                check_prev( ci, ci + 1 );
            }
            break;
        case 1: // up
            for( c = 0; c < cols; c++ ) for( r = 1; r < rows; r++ ) {
                ci = r * cols + c;
                check_prev( ci, ci - cols );
            }
            break;
        case 3: // down
            for( c = 0; c < cols; c++ ) for( r = rows-2; r >= 0; r-- ) {
                ci = r * cols + c;
                check_prev( ci, ci + cols );
            }
            break;
        default: return $(this);
        }
        $(this).add_number();
        return $(this);
    };
})(jQuery);

function check_prev( ci, pi ) {
    cur = $('#n_' + ci );
    ct = cur.text();
    if ( ct == '' ) return;
    prev = $('#n_' + pi );
    switch( prev.text() ) {
    case ct: ct = 2 * parseInt( ct );
    case '':
        break;
    default: return;
    }
    prev.text( ct );
    cur.text( '' )
}
