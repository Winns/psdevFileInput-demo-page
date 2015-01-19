$(function() {

	// App
	var psdevFileInput = function( $el, cfg ) {
		var self = this;
		
		this.$el = $el;
		this.cfg = cfg;
		this.el = {};
		
		this.currentFile = 0;
		
		this.templates = {};
		this.templates.btnOpen 		= function() { return '<div class="open"></div>'; };
		this.templates.btnOpenIcon 	= function() { return '<i class="fa fa-file-o"></i>'; };
		this.templates.box 			= function() { return '<div class="psdevFileInput empty"></div>'; };
		
		this.templates.objects 		= function() { 
			var html = '';

			html += '<div class="name-wrap">';
			html += 	'<div class="multiple-control">';
			html += 		'<i class="btn-prev fa fa-caret-left"></i>';
			html += 		'<i class="btn-next fa fa-caret-right"></i>';
			html += 		'<span class="count"></span>';
			html += 	'</div>';
			html += 	'<div class="name">File is not selected..</div>';
			html += '</div>';

			html += '<div class="info">';
			html += 	'<span class="ext" title="Extension"></span>';
			html += 	'<span class="size" title="Size"></span>';
			html += '</div>';
			
			html += '<i class="remove fa fa-times" title="Clear file selection"></i>';
			
			return html;
		};
		
		this.getSize = function( bytes ) {
			if (bytes == 0) return '0 Byte';
			
			var k 		= 1000,
				sizes 	= ['Bytes', 'kb', 'mb', 'gb', 'tb', 'pb'],
				i 		= Math.floor(Math.log( bytes ) / Math.log( k ));
			
			return (bytes / Math.pow(k, i)).toPrecision(3) +' '+ sizes[i];
		};

		this.createStructure = function() {
			$el.wrap( this.templates.btnOpen() );
			$el.parent().append( this.templates.btnOpenIcon() );

			$el.parent().wrap( this.templates.box() );
			$el.parent().parent().append( this.templates.objects() );
			
			this.el.$box 		= $el.parent().parent();
			this.el.$input 		= $el;
			this.el.$name 		= this.el.$box.find( '.name' );
			this.el.$ext 		= this.el.$box.find( '.ext' );
			this.el.$size 		= this.el.$box.find( '.size' );
			this.el.$remove 	= this.el.$box.find( '.remove' );
			this.el.$count 		= this.el.$box.find( '.count' );
			this.el.$btnPrev 	= this.el.$box.find( '.btn-prev' );
			this.el.$btnNext 	= this.el.$box.find( '.btn-next' );
		};
		
		this.renderFiles = function() {
			var files 	= this.el.$input[0].files,
				name 	= 'File is not selected..', 
				ext 	= '',
				size 	= '',
				tmp 	= '';
			
			if (files.length > 0) {
				tmp 	= files[ this.currentFile ].name.split('.');
				
				name 	= tmp.splice(0, tmp.length-1).join('.');
				ext 	= '.' + tmp.pop();
				size 	= this.getSize( files[ this.currentFile ].size );
				
				this.el.$box.removeClass( 'empty' );
			} else {
				this.el.$box.addClass( 'empty' );
			}
			
			// If muptiple files selected
			if (files.length > 1) {
				this.el.$box.addClass( 'multiple' );
				
				this.el.$count.html( (this.currentFile + 1) +'/'+ files.length );
			} else {
				this.el.$box.removeClass( 'multiple' );
			}

			this.el.$name.html( name ).attr( 'title', name );
			this.el.$ext.html( ext );
			this.el.$size.html( size );
		};
		
		this.handleFileSelect = function() {
			this.currentFile = 0;
			
			this.renderFiles();
		};
		
		this.removeFile = function() {
			this.el.$input.val('');
			
			this.renderFiles();
		};
		
		this.switchFiles = function( dir ) {
			var max = this.el.$input[0].files.length - 1;

			if (dir == 'next') {
				if (this.currentFile + 1 <= max) this.currentFile++;
			} else {
				if (this.currentFile - 1 >= 0) this.currentFile--;
			}

			this.renderFiles();
		};

		// Init
		this.init = function() {
			this.createStructure();
			
			this.el.$input.on( 'change', this.handleFileSelect.bind(this) );
			this.el.$remove.on( 'click', this.removeFile.bind(this) );
			
			this.el.$btnPrev.on( 'click', function() { self.switchFiles( 'prev' ); } );
			this.el.$btnNext.on( 'click', function() { self.switchFiles( 'next' ); } );
		};
		
		this.init();
	};

	// Create jQuery plugin
	$.fn.psdevFileInput = function( cfg ) {

		return this.each(function() {
			var el = $( this );

			// Return early if this element already has a plugin instance
			if (el.data('psdevFileInput')) return;

			// Pass options to plugin constructor
			var plugin = new psdevFileInput( $( this ), cfg );

			// Store plugin object
			el.data( 'psdevFileInput', plugin );
		});

	};
	
});