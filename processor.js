
// we don't use additional array because of in any case we should check/move
// numbers throw cells, so we should check as current as neibour cell

COLS = ROWS = 4;

function game_over() {
    $('.gameover').css('display','block');
}

$(document).ready( function() {
    $('.map').add_boxes({'rows':ROWS,'cols':COLS}).add_number().add_number();
    $(window).resize();
});

$(window).resize( function() {
    m = $('.map');
    h = m.height() + 'px';
    m.css( 'width', h );
    o = m.offset();
    t = parseFloat( h );
    h = 0.75 * t + 'px';
    l = t / 8 + o.left +'px';
    t = t / 8 + o.top + 'px';
    $('.gameover').css({'width':h, 'height':h, 'left':l, 'top':t});
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
    map = $('.map');
    map.shift( e.which - 37 );
    if ( map.data('moved') ) map.add_number();
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
        $(this).find('.box#n_' + n ).text('2'); // TODO random number (?)

        test = $('.map-test');
        if ( test.length == 0 ) {
            test = $(this).clone().removeClass('map').addClass('map-test').css('display','none').appendTo('body');
        } else test.html( $(this).html() );
        for( i = 0; i <= 3; i++ ) {
            test.shift( i );
            if ( test.data('moved') ) return $(this);
        }
        game_over();
        return $(this);
    };

    $.fn.shift = function( dir ) {
        map = $(this);
        rows = parseInt( map.attr( 'rows' ) );
        cols = parseInt( map.attr( 'cols' ) );
        map.check_prev = map.one_step;
        map.check_prev = map.roll_down;
        map.data('moved',0);
        switch( dir ) {
        case 0: // left
            for( r = 0; r < rows; r++ ) for( c = 1; c < cols; c++ ) {
                map.check_prev( r * cols, cols, r, c, -1  );
            }
            break;
        case 2: // right
            for( r = 0; r < rows; r++ ) for( c = cols-2; c >= 0; c-- ) {
                map.check_prev( ( r + 1 ) * cols - 1, cols, r, c, 1  );
            }
            break;
        case 1: // up
            for( c = 0; c < cols; c++ ) for( r = 1; r < rows; r++ ) {
                map.check_prev( c, cols, r, c, -cols  );
            }
            break;
        case 3: // down
            for( c = 0; c < cols; c++ ) for( r = rows-2; r >= 0; r-- ) {
                map.check_prev( ( rows - 1 ) * cols + c, cols, r, c, cols );
            }
            break;
        }
        return $(this);
    };

    $.fn.roll_down = function roll_down( down, cols, r, c, step ) {
        ci = r * cols + c;
        cur = $(this).find('#n_' + ci );
        ct = cur.text();
        if ( ct == '' ) return $(this);
        pi = ci + step;
        la = -1;
        while( true ) {
            prev = $(this).find('#n_' + pi );
            switch( prev.text() ) {
            case ct: ct = 2 * parseInt( ct );
                break;
            case '':
                if ( pi == down ) break;
                la = pi;
                pi += step;
                continue;
            default:
                if ( la < 0 ) return $(this);
                prev = $(this).find('#n_' + la );
                break;
            }
            break;
        }
        prev.text( ct );
        cur.text( '' );
        $(this).data('moved',1);
        return $(this);
    };

    $.fn.one_step = function one_step( down, cols, r, c, step ) {
        ci = r * cols + c;
        cur = $(this).find('#n_' + ci );
        ct = cur.text();
        if ( ct == '' ) return $(this);
        pi = ci + step;
        prev = $(this).find('#n_' + pi );
        switch( prev.text() ) {
        case ct: ct = 2 * parseInt( ct );
        case '':
            prev.text( ct );
            cur.text( '' );
            $(this).data('moved',1);
        }
        return $(this);
    };
})(jQuery);
