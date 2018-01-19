# Hide and Google 🤖
*Hide and Google* is a twitter-bot that runs server-side (or client-side, if you wanted) to play the world's most difficult and adventerous game of hide-n-go-seek. Utilizing a variety of API's such as [twit](https://github.com/ttezel/twit) and the free Google Street View API, this little piece of [Node.js](nodejs.org) Javascript can actively monitor for responses on tweets and run itself.

![screenshot](https://i.imgur.com/EiiYCkp.png)

![screenshot](https://i.imgur.com/VB12xxm.png)

#### Current development status [1.0.0]
As of Jan. 2018 - this is barely built up. Meaning – It's probably unstable since I just wrote it. But it seems to work... Feel free to fork and have fun under the [GNU AGPLv3](https://www.gnu.org/licenses/agpl-3.0.en.html) license but **please note** a large majority of this source code is likely to be overwritten or heavily modified on a day-to-day basis.

##### Script workflow

  - Searches downloaded list of city names and filters names that are just too difficult to spell in English
  - Sends an API request to Google to see if a random street view .JPG is available in the city.
  - Since Google doesn't offer a "no" output, but rather a grey "not found" image, the software tests the size of it and determines what it is, automatically filtering it.
  - Connects to twitter API and posts the image with a randomly selected message. Uses the stream to wait for the correct response, and when it's seen, the bot congratulates the winner and moves onto the next round.

##### To be added
- Lots.


#### Demo
https://twitter.com/hideandgoogle


#### Quick Start

`$ cd /hide-and-google/`

`npm i --save twit random-world inquirer image-downloader fs`

Go into the `hag-bot.js` file and focus at the top.

This will need to be configured as per your keys and desired settings.

```
// ----- SETTINGS
const googleStreetAPIKey = 'x';
const googleStreetSettings = '&fov=100';
const sizeOf404Image = 9000;
var T = new Twit({
    consumer_key: 'x',
    consumer_secret: 'x',
    access_token: 'x-x',
    access_token_secret: 'x',
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
})
```

Then `node hag-bot.js`.

Reccomended that you run this on a VPS with latest Node.js installed.

Licensed under [GNU AGPLv3](https://www.gnu.org/licenses/agpl-3.0.en.html)
