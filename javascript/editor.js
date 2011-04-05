(function($) {
  getSelectionPosition = function($field ) {
    if ($field.length) {
      var start = 0, end = 0;
      var el = $field.get(0);

      if (typeof el.selectionStart == "number" &&
          typeof el.selectionEnd == "number") {
        start = el.selectionStart;
        end = el.selectionEnd;
      } else {
        var range = document.selection.createRange();
        var stored_range = range.duplicate();
        stored_range.moveToElementText( el );
        stored_range.setEndPoint( 'EndToEnd', range );
        start = stored_range.text.length - range.text.length;
        end = start + range.text.length;

        // so, uh, we're close, but we need to search for line breaks and
        // adjust the start/end points accordingly since IE counts them as
        // 2 characters in TextRange.
        var s = start;
        var lb = 0;
        var i;
        for ( i=0; i < s; i++ ) {
          if ( el.value.charAt(i).match(/\r/) ) {
            ++lb;
          }
        }

        if ( lb ) {
          start = start - lb;
          lb = 0;
        }

        var e = end;
        for ( i=0; i < e; i++ ) {
          if ( el.value.charAt(i).match(/\r/) ) {
            ++lb;
          }
        }

        if ( lb ) {
          end = end - lb;
        }
      }

      return {
          start: start,
          end: end
      };
    } // end if ($field.length)
  }
  
  getSelection = function( $field ) {
    var selStr = '';
    var selPos;

    if ( $field.length ) {
      selPos = getSelectionPosition( $field );
      selStr = $field.val().substring( selPos.start, selPos.end );
      return selStr;
    }
    return false;
  }
  
  replaceSelection = function( $field, replaceText, reselect, cursorOffset ) {
    var selPos = getSelectionPosition( $field );
    var fullStr = $field.val();
    var selectNew = true;
    if ( reselect === false) {
      selectNew = false;
    }

    var scrollTop = null;
    if ( $field[0].scrollTop ) {
      scrollTop = $field[0].scrollTop;
    }

    $field.val( fullStr.substring(0, selPos.start) + replaceText +
                fullStr.substring(selPos.end) );
    $field[0].focus();

    if ( selectNew ) {
      if ( $field[0].setSelectionRange ) {
        if ( cursorOffset ) {
          $field[0].setSelectionRange(
                                        selPos.start + cursorOffset,
                                        selPos.start + cursorOffset
           );
        } else {
          $field[0].setSelectionRange( selPos.start,
                                       selPos.start + replaceText.length );
        }
      } else if ( $field[0].createTextRange ) {
        var range = $field[0].createTextRange();
        range.collapse( true );
        if ( cursorOffset ) {
          range.moveEnd( selPos.start + cursorOffset );
          range.moveStart( selPos.start + cursorOffset );
        } else {
          range.moveEnd( 'character', selPos.start + replaceText.length );
          range.moveStart( 'character', selPos.start );
        }
        range.select();
      }
    }

    if ( scrollTop ) {
      // this jumps sometimes in FF
      $field[0].scrollTop = scrollTop;
    }
  }
  
  executeAction = function(search, replace, append) {
    var txt = $("textarea").val()
    var selPos = getSelectionPosition($("textarea"))
    var selText = getSelection( $('textarea') )
    var repText = selText
    var reselect = true
    var cursor = null
  
    if (search && replace) {
      repText = repText.replace(search, replace)
      // remove backreferences
      repText = repText.replace(/\$[\d]/g, '')
      if ( repText === '' ) {
        cursor = replace.indexOf('$1')
    
        repText = replace.replace( /\$[\d]/g, '' )
        if ( cursor == -1 ) cursor = Math.floor( replace.length / 2 )
      }
    }
    
    if (append) {
      if ( repText == selText ) {
        reselect = false;
      }
      repText += append
    }
    
    if (repText) replaceSelection( $('textarea'), repText, reselect, cursor)
  }

})(jQuery)

$(document).ready(function() {
  $(".function-bold").bind("click", function() {
    executeAction(/([^\n]+)([\n\s]*)/g, "**$1**$2")
  })
  $(".function-italic").bind("click", function() {
    executeAction(/([^\n]+)([\n\s]*)/g, "_$1_$2")
  })
  $(".function-code").bind("click", function() {
    executeAction(/(^[\n]+)([\n\s]*)/g, "`$1`$2")
  })
  $(".function-hr").bind("click", function() {
    executeAction(false,false,"\n***\n")
  })
  $(".function-ul").bind("click", function() {
    executeAction(/(.+)([\n]?)/g, "* $1$2")
  })
  $(".function-ol").bind("click", function() {
    var n = 0
    executeAction(/(.+)([\n]?)/g, function(str, p1, p2, offset, s) { return ++n + ". " + p1 + p2})
  })
  
  
})
