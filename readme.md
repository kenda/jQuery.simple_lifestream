## About
jQuery.simple_lifestream is a tiny plugin that aggregates multiple rss/atom feeds and prints their
items sorted by date.
It uses the [Google Feed API](http://code.google.com/intl/de/apis/feed/) for getting the feed items.

## Requirements
Well, of course you need jQuery.
Additionally you need an [API key](http://code.google.com/intl/de/apis/loader/signup.html) from Google for accessing their API.

## Usage
### Howto
Call `lifestream(settings, [callback()])`. See `index.html` for a simple example of including the lifestream.

### Settings
Object of following settings:

- `feeds` : array of the feed urls
- `count` : integer of how many items should be printed, Default: 5
- `favicons` : boolean whether the favicon of each item should be printed, Default: true
- `api_key` : string of your api key of Google
