var exec = require( 'mz/child_process' ).execFile;
var assert = require( 'assert' );

module.exports = function ( filename ) {
	return exec( 'ffprobe', [
		'-v', 'error',
		'-of', 'flat=s=_',
		'-select_streams', 'v:0',
		'-show_streams',
		filename
	] ).then( function ( out ) {
		var stdout = out[ 0 ].toString( 'utf8' );
		var width = /width=(\d+)/.exec( stdout );
		var height = /height=(\d+)/.exec( stdout );
		assert( width && height, 'No dimensions found!' );
		var rotate = /tags_rotate=\"(\d+)\"/.exec( stdout );
		if ( rotate !== undefined ) {
			rotate = parseInt( rotate[ 1 ] );
			if ( rotate === 90 || rotate === -90 ) {
				return {
					width: parseInt( height[ 1 ] ),
					height: parseInt( width[ 1 ] ),
				};
			}
		}
		return {
			width: parseInt( width[ 1 ] ),
			height: parseInt( height[ 1 ] ),
		};
	} );
};