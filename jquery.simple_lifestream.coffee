###
 jQuery simple_lifestream plugin.
 Author: Marcus Nitzschke

 The plugin aggregates different feeds and sort all entries
 by date.

 Contribution:
 The favicon extraction is inspired by
 jQuery UrlFavicon Plugin - http://urlfavicon.danswackyworld.com - Daniel Yates
###

$ = jQuery
$.fn.extend
    lifestream: (options, callback) ->

        # Defining settings and default values
        settings = jQuery.extend(
            # array of the feed urls
            feeds: []

            # number of shown items
            count: 5

            # optionally hide the favicons
            favicons: true

            # Google api key
            api_key: null,
            options)

        # Array of all feed data
        feeds = []

        # getting targeted DOM element
        output = $(this)

        # initial cleaning of the target
        output.empty()

        # load google feed api
        key = if settings.api_key then "?key=#{settings.api_key}" else ""
        $.getScript "https://www.google.com/jsapi#{key}", () ->
            google.load "feeds", "1", callback: ->

                for feed in settings.feeds
                    # get feed items
                    feed = new google.feeds.Feed feed
                    feed.setNumEntries settings.count
                    feed.includeHistoricalEntries()
                    feed.load (result) ->
                        if not result.error
                            # push feed to the data array
                            feeds.push result

        # wait until the feeds are loaded, so that they can processed
        setTimeout( (() ->

            # transform the native feed objects into more useful entry objects
            entries = []

            for item in feeds
                for entry in item.feed.entries
                    # retrieve the favicon of the feed
                    favicon = null
                    if settings.favicons
                        http = "(https*:\\/\\/)"
                        fqdn = "((?:[a-z][a-z\\.\\d\\-]+)\\.(?:[a-z][a-z\\-]+))(?![\\w\\.])"
                        url = new RegExp http + fqdn, ['i']
                        url = url.exec entry.link
                        favicon = if url then url[0] + '/favicon.ico' else null
                    entries.push
                        feed : item.feed.title
                        favicon : favicon
                        author : entry.author
                        title : entry.title
                        content : entry.content
                        date : entry.publishedDate
                        link : entry.link

            # sort all feeds by date
            entries.sort (a,b) ->
                a = new Date a.date
                b = new Date b.date
                b - a

            # display the results
            $(output).append "<ul id='entries'>"

            # check whether there are less items than requested to be printed
            length = Math.min settings.count, entries.length
            for i in [0..length]
                if entries[i]?
                    # set favicon output
                    favicon = if entries[i].favicon then """
                      <img width='16' height='16' src='#{entries[i].favicon}'/>&nbsp;
                      """ else ""
                    $("#entries").append """
                      <li> #{favicon}
                           <span class='title'>
                                <a href='#{entries[i].link}' title='by #{entries[i].author} on #{entries[i].date}'>
                                     #{entries[i].title}
                                </a>
                            </span>
                            <br />
                            <span class='content'>
                                 #{entries[i].content}
                            </span>
                      </li>"""

            if $.isFunction callback
                # finally call the optional callback function
                do callback
            ),500)