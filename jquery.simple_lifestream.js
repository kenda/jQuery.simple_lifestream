/**
 * jQuery simple_lifestream plugin.
 * Author: Marcus Nitzschke
 * 
 * The plugin aggregates different feeds and sort all entries 
 * by date.
 * 
 * Contribution:
 * The favicon extraction is inspired by
 * jQuery UrlFavicon Plugin - http://urlfavicon.danswackyworld.com - Daniel Yates
 */

(function($) {
  $.fn.lifestream = function(options, callback)
  {
    // Defining settings and default values
    var settings = jQuery.extend(
      {
	// array of the feed urls
	feeds : [],
	
	// number of shown items
	count : 5,
	
	// optionally hide the favicons
	favicons : true,
	
	// Google api key
	api_key : null
      },options
    );
    
    // Array of all feed data
    var feeds = [];
    
    // getting targeted DOM element
    var output = $(this);
    
    // initial cleaning of the target
    output.empty();

    // load google feed api
    var key = settings.api_key ? "?key="+settings.api_key : "";
    $.getScript('https://www.google.com/jsapi' + key, function(){

      google.load("feeds", "1", { callback: function(){

	$.each(settings.feeds, function(index, url){

	  // get feed items
	  var feed = new google.feeds.Feed(url);
	  feed.setNumEntries(settings.count);
	  feed.includeHistoricalEntries();
	  feed.load(function(result) {
            if (!result.error) {
	     
	      // push feed to the global array
	      feeds.push(result);

	      if (index+1 === settings.feeds.length) {
	
		// transform the native feed objects into more useful entry objects
		var entries = [];
		$.each(feeds, function(index, item){
		  var feed_index = index;

		  $.each(item.feed.entries, function(index, entry){
		    
		    // retrieve the favicon of the feed
		    var favicon = null;
		    if (settings.favicons){
		      var http = '(https*:\\/\\/)';
		      var fqdn = '((?:[a-z][a-z\\.\\d\\-]+)\\.(?:[a-z][a-z\\-]+))(?![\\w\\.])';
		      var url = new RegExp(http + fqdn, ['i']).exec(entry.link);

		      if(url != null) {
			favicon = url[0] + '/favicon.ico';
		      }
		      else{
			// Default icon
			// TODO
		      }
		    }

		    entries.push({
		      "feed" : item.feed.title,
		      "favicon" : favicon,
		      "author" : entry.author,
		      "title" : entry.title,
		      "content" : entry.content,
		      "date" : entry.publishedDate,
		      "link" : entry.link
		    });
		    
		    if ((index+1 === item.feed.entries.length) && (feed_index+1 === feeds.length)){
		      // sort all feeds by date
		      entries.sort(_entrySort);

		      // display the results
		      $(output).append("<ul id='entries'>");
		      
		      // check wether there are less items than requested to be printed
		      var length = Math.min(settings.count, entries.length);
		      
		      for ( i = 0; i < length; i++){
			// set favicon output
			favicon = entries[i].favicon ? "<img width='16' height='16' src='"+entries[i].favicon+"'/>&nbsp;" : "";

			$("#entries")
			  .append(""
				  + "<li>"
				  + favicon
				  + "<span class='title'>"
    				  + "<a href='"+entries[i].link+"' title='by "+entries[i].author+" on "+entries[i].date+"'>"
				  + entries[i].title
				  + "</a>"
				  + "</span><br />"
				  + "<span class='content'>"+entries[i].content+"</span>"
				  + "</li>"
				 );
			
			// finally call the optional callback function
			if ( (i+1 === length) && ($.isFunction(callback)) ){
			  callback();
			};
		      };
		    };
		  });
		});
              };
	    };
	  });
	});
      }});
    });
    
    /**
     * Sort entry objects by descending date
     */
    function _entrySort(a, b){
      a = new Date(a.date);
      b = new Date(b.date);
      return b - a;
    }

  };
})(jQuery);