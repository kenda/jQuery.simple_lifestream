(function() {

  /*
   jQuery simple_lifestream plugin.
   Author: Marcus Nitzschke
  
   The plugin aggregates different feeds and sort all entries
   by date.
  
   Contribution:
   The favicon extraction is inspired by
   jQuery UrlFavicon Plugin - http://urlfavicon.danswackyworld.com - Daniel Yates
  */

  var $;

  $ = jQuery;

  $.fn.extend({
    lifestream: function(options, callback) {
      var feeds, key, output, settings;
      settings = jQuery.extend({
        feeds: [],
        count: 5,
        favicons: true,
        api_key: null
      }, options);
      feeds = [];
      output = $(this);
      output.empty();
      key = settings.api_key ? "?key=" + settings.api_key : "";
      $.getScript("https://www.google.com/jsapi" + key, function() {
        return google.load("feeds", "1", {
          callback: function() {
            var feed, _i, _len, _ref, _results;
            _ref = settings.feeds;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              feed = _ref[_i];
              feed = new google.feeds.Feed(feed);
              feed.setNumEntries(settings.count);
              feed.includeHistoricalEntries();
              _results.push(feed.load(function(result) {
                if (!result.error) return feeds.push(result);
              }));
            }
            return _results;
          }
        });
      });
      return setTimeout((function() {
        var entries, entry, favicon, fqdn, http, i, item, length, url, _i, _j, _len, _len2, _ref;
        entries = [];
        for (_i = 0, _len = feeds.length; _i < _len; _i++) {
          item = feeds[_i];
          _ref = item.feed.entries;
          for (_j = 0, _len2 = _ref.length; _j < _len2; _j++) {
            entry = _ref[_j];
            favicon = null;
            if (settings.favicons) {
              http = "(https*:\\/\\/)";
              fqdn = "((?:[a-z][a-z\\.\\d\\-]+)\\.(?:[a-z][a-z\\-]+))(?![\\w\\.])";
              url = new RegExp(http + fqdn, ['i']);
              url = url.exec(entry.link);
              favicon = url ? url[0] + '/favicon.ico' : null;
            }
            entries.push({
              feed: item.feed.title,
              favicon: favicon,
              author: entry.author,
              title: entry.title,
              content: entry.content,
              date: entry.publishedDate,
              link: entry.link
            });
          }
        }
        entries.sort(function(a, b) {
          a = new Date(a.date);
          b = new Date(b.date);
          return b - a;
        });
        $(output).append("<ul id='entries'>");
        length = Math.min(settings.count, entries.length);
        for (i = 0; 0 <= length ? i <= length : i >= length; 0 <= length ? i++ : i--) {
          if (entries[i] != null) {
            favicon = entries[i].favicon ? "<img width='16' height='16' src='" + entries[i].favicon + "'/>&nbsp;" : "";
            $("#entries").append("<li> " + favicon + "\n     <span class='title'>\n          <a href='" + entries[i].link + "' title='by " + entries[i].author + " on " + entries[i].date + "'>\n               " + entries[i].title + "\n          </a>\n      </span>\n      <br />\n      <span class='content'>\n           " + entries[i].content + "\n      </span>\n</li>");
          }
        }
        if ($.isFunction(callback)) return callback();
      }), 500);
    }
  });

}).call(this);
