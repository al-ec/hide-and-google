// THIS IS AN EARLY UNSTABLE BETA
// USE AT OWN RISK
// 1.0.0
// Jan. 19, 2018

// NPM dependencies
var Twit = require('twit');
var random = require('random-world');
var inquirer = require('inquirer');
const download = require('image-downloader');
const fs = require("fs"); //Load the filesystem module

// data variables (don't touch)
var freshTwitterAcct = true;
var randomInitialPostText = 1;
var roundNum = 0;
var correctAnswer = '';
var imageHits = 0;
var imageMisses = 0;
var randomCityChoose = '';

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

// ----- TWITTER
function randomPostText() {
    if (randomInitialPostText == 1) {
        return "Can you guess which city in the world this photo was taken? #hideandgoogle (repl" +
            "y to this with the correct city name to win)";
    }
    if (randomInitialPostText == 2) {
        return "Okay, I'm sure you won't guess this one. Which city was this taken in? #hideandg" +
            "oogle (reply to this with just the correct city name to win)";
    }
    if (randomInitialPostText == 3) {
        return "Can you guess this city? #hideandgoogle (reply to this with the correct city nam" +
            "e to win)";
    }
    if (randomInitialPostText == 4) {
        return "Where in the WORLD was this photo taken? #hideandgoogle (reply to this with the " +
            "correct city name to win)";
    }
    if (randomInitialPostText == 5) {
        return "I made this one hard on purpose, sorry. #hideandgoogle (reply to this with the c" +
            "orrect city name to win)";
    }
    if (randomInitialPostText == 6) {
        return "Which. City? #hideandgoogle (reply to this with the correct city name to win)";
    }
    if (randomInitialPostText == 7) {
        return "Good luck with this one... Which city? #hideandgoogle (reply to this with the co" +
            "rrect city name to win)";
    }
    if (randomInitialPostText == 8) {
        return "Guess the city and win. Can you get this one? #hideandgoogle (reply to this with" +
            " the correct city name to win)";
    }
    if (randomInitialPostText == 9) {
        return "Who wants that high score? Guess which city this was taken in and get your name " +
            "on the leaderboard. #hideandgoogle (reply to this with the correct city name to " +
                "win)";
    }
    if (randomInitialPostText == 10) {
        return "Betcha won't guess this one! Can you guess this city? #hideandgoogle (reply to t" +
            "his with the the correct city name to win)";
    }
    if (randomInitialPostText == 11) {
        return "Even I couldn't guess this one. Good luck. Can you tell me this city? #hideandgo" +
            "ogle (reply to this with the correct city name to win)";
        randomInitialPostText = 0;
    } else {
        return "Which city was this photo taken in? #hideandgoogle (reply to this with the corre" +
            "ct city name to win)";
    }
}

// ----- TWITTER API STREAM
function twitterStream() {
    freshTwitterAcct = false;
    console.log("")
    console.log("")
    var stream = T.stream('statuses/filter', {track: ['@hideandgoogle']})
    stream.on('connect', function (request) {
        console.log("# -----------------------------------------------------")
        console.log('#\x1b[1m OPENING TWITTER STREAM\x1b[0m')
        console.log('# Seeking: ' + randomCityChoose + '.')
        console.log("# -----------------------------------------------------\x1b[0m")
    })
    stream.on('connected', function (response) {
        console.log("# -----------------------------------------------------")
        console.log('# \x1b[32mTWITTER STREAM OPENED \x1b[0m')
        console.log('# Seeking: \x1b[32m' + randomCityChoose + '\x1b[0m.')
        console.log("# -----------------------------------------------------\x1b[0m")
        console.log("# Actively monitoring...\x1b[0m")
    })
    stream.on('reconnect', function (request, response, connectInterval) {
        console.log("# -----------------------------------------------------")
        console.log('# \x1b[32mTWITTER STREAM RECONNECTING \x1b[0m')
        console.log("# -----------------------------------------------------\x1b[0m")
    })
    stream.on('error', function (error) {
        if (error !== undefined) {
            console.log("Error!");
        }
    })
    stream.on('tweet', tweetEvent);

    function tweetEvent(tweet) {
        var name = tweet.user.screen_name;
        // What is the text?
        var txt = tweet.text;
        // If we want the conversation thread
        var id = tweet.id_str;
        var checkIt = tweet
            .text
            .toLowerCase()
            .indexOf(randomCityChoose)
        if (checkIt === -1) {
            stream.stop();
            var replyText = 'We have a winner! @' + name + ' guessed it right. This photo was taken in ' + randomCityChoose + '. Next photo coming now! #hideandgoogle';
            var params = {
                status: replyText,
                in_reply_to_status_id: tweet.in_reply_to_status_id
            };
            T.post('statuses/update', params, function (err, data, response) {
                if (err !== undefined) {
                    apiError();
                }
                if (data !== undefined) {}
                if (response !== undefined) {}
                console.log("");
                console.log("");
                console.log("");
                console.log("# -----------------------------------------------------")
                console.log("#      \x1b[1m ANNOUNCED WINNER:\x1b[32m " + tweet.user.screen_name)
                console.log("\x1b[0m# -----------------------------------------------------")
                console.log("");
                console.log("");
                console.log("");
                roundNum++;
                newRound();
            })
        }
    }

}

// ----- TWITTER API POST
async function postToTwitter() {
    roundNum++;
    randomInitialPostText++;
    if (roundNum < 1) {
        // don't post congratulations
    }
    var b64content = fs.readFileSync('temp/thumb.jpg', {encoding: 'base64'})

    // first we must post the media to Twitter
    T.post('media/upload', {
        media_data: b64content
    }, function (err, data, response) {
        // now we can assign alt text to the media, for use by screen readers and  ther
        // text-based presentations and interpreters
        var mediaIdStr = data.media_id_string
        var altText = "Which city in the world was this photo captured?"
        var meta_params = {
            media_id: mediaIdStr,
            alt_text: {
                text: altText
            }
        }

        T.post('media/metadata/create', meta_params, function (err, data, response) {
            if (!err) {
                // now we can reference the media and post a tweet (media will attach to the
                // tweet)
                var params = {
                    status: randomPostText(),
                    media_ids: [mediaIdStr]
                }

                T.post('statuses/update', params, function (err, data, response) {
                    console.log("# -----------------------------------------------------")
                    console.log('# \x1b[1mPOSTED TO TWITTER\x1b[0m        * * * * *')
                    console.log("# " + randomCityChoose + " is what we're seeking \x1b[0m")
                    console.log("# -----------------------------------------------------")
                    twitterStream();
                })
            }
        })
    })
}

// ----- GUESSING
async function startGuessing() {
    randomCityChoose = random.city();
    checkForCharacters(randomCityChoose);
    if (checkForCharacters()) {
        console.log("# GUESSING --------------------------------------------")
        console.log("# \x1b[32m" + randomCityChoose + "\x1b[37m looks like a guessable city...");
        console.log("# -----------------------------------------------------")
    } else {
        console.log("# GUESSING --------------------------------------------")
        console.log("# \x1b[31m" + randomCityChoose + "\x1b[37m looks unguessable. \x1b[32mNew guess...\x1b[31m");
        console.log("# -----------------------------------------------------")
        fail();
    }

    const downloadOptions = {
        url: "https://maps.googleapis.com/maps/api/streetview?size=620x620&location=" + randomCityChoose + googleStreetSettings + "&key=" + googleStreetAPIKey,
        dest: './temp/thumb.jpg'
    }
    console.log(" ")
    console.log(" ")
    console.log("# -----------------------------------------------------")
    console.log("# Querying \x1b[34mGoogle Street View API\x1b[0m...");
    console.log("# -----------------------------------------------------")
    console.log("\x1b[34m          .");
    await sleep(20);
    console.log("            .");
    await sleep(20);
    console.log("              .");
    await sleep(20);
    console.log("                .");
    await sleep(20);
    console.log("              .");
    await sleep(20);
    console.log("          .");
    await sleep(20);
    console.log("       .");
    await sleep(20);
    console.log("    .");
    await sleep(20);
    console.log("      .");
    await sleep(20);
    console.log("         .");
    await sleep(20);
    console.log("              .");
    await sleep(20);
    console.log("                .\x1b[0m");
    await sleep(20);
    console.log(" ");
    console.log("# -----------------------------------------------------")
    console.log("# Current API stats:")
    console.log("\x1b[32m#\x1b[0m Guess hits: \x1b[32m" + imageHits);
    console.log("\x1b[31m#\x1b[0m Guess misses: \x1b[31m" + imageMisses);
    console.log("\x1b[0m# Difficult name failures do not count.")
    console.log("# \x1b[1mNOTE: Don't exceed your API limit!\x1b[0m")
    console.log("# -----------------------------------------------------")
    await sleep(1800);

    download.image(downloadOptions)
    .then(({filename, image}) => {

        console.log("# -----------------------------------------------------")
        console.log("\x1b[32m#\x1b[0m Temporary image saved to \x1b[32m" + filename + "\x1b[0m.")
        console.log("# -----------------------------------------------------")
        console.log("# Checking if \x1b[1m" + randomCityChoose + "\x1b[0m has a street view...")
        console.log("# -----------------------------------------------------")
        setTimeout(checkFileSize, 3000);
        if (checkFileSize()) {
            console.log("\x1b[32m# SUCCESS\x1b[0m ---------------------------------------------")
            console.log("# -----------------------------------------------------")
            console.log("\x1b[32m#\x1b[0m \x1b[32m" + randomCityChoose + "\x1b[0m is good!");
            console.log("# -----------------------------------------------------\x1b[0m")
            imageHits++;
            success(randomCityChoose);
        } else {
            console.log("\x1b[31m# FAIL\x1b[0m ------------------------------------------------")
            console.log("\x1b[31m#\x1b[0m No street view found in \x1b[31m" + randomCityChoose + "\x1b[0m.");
            console.log("# -----------------------------------------------------")
            console.log("# Starting over with new guess!");
            console.log("# -----------------------------------------------------\x1b[0m")
            imageMisses++;
            fail();
        }

    }).catch((err) => {
        throw err
        apiError();
    })
}

function fail() {
    newRound();
}

async function success(x) {
    this.correctAnswer = x;
    console.log("-------------------------------------------------------")
    console.log("# \x1b[1mINITIATING PUBLIC ROUND\x1b[0m")
    console.log("# New round with answer: \x1b[32m" + this.correctAnswer);
    console.log("\x1b[0m# -----------------------------------------------------\x1b[0m")
    await sleep(1200);
    postToTwitter();
}

async function apiError() {
    console.log("\x1b[31m# -----------------------------------------------------")
    console.log("# API ERROR")
    console.log("# Are you sure your config is set correctly?");
    console.log("# -----------------------------------------------------\x1b[0m")
    await sleep(1200);
}

async function newRound() {
    console.log('');
    console.log('');
    console.log('');
    console.log("# -----------------------------------------------------")
    console.log('#      \x1b[1mNEW SEARCH\x1b[0m   * * * * * * * * * * * * * *')
    console.log("# -----------------------------------------------------\x1b[0m")
    await sleep(600);
    startGuessing();
}

async function freshGame() {
    var output = [];
    // ui start
    console.log("\x1b[36m");
    console.log("");
    console.log("");
    console.log("  # -------------------------------")
    console.log("  # \x1b[37mWELCOME!\x1b[36m")
    console.log("  # \x1b[1mHide n' Go Google\x1b[0m");
    console.log("  # \x1b[37mTwitter Bot v.1.0\x1b[36m");
    console.log("  # \x1b[37mdev: github.com/al-ec \x1b[36m ")
    console.log("  # \x1b[37mRelease date: Feb. 3, 2018\x1b[36m")
    console.log("  # \x1b[37mPlease read notes before using!\x1b[36m")
    console.log("  # -------------------------------")
    console.log("");
    console.log("\x1b[31m");
    await sleep(10);
    console.log('   \x1b[4mPlease ensure\x1b[0m you added your API information');
    console.log('   and your settings in ./settings.js!');
    console.log('');

    inquirer.prompt([
        {
            type: 'confirm',
            message: '\x1b[37m Would you like to start a fresh game?',
            name: 'answer',
            choices: [
                new inquirer.Separator('NOTE: Configure your settings in bot.js!'), {
                    name: 'I am all configured... Start a fresh game already!'
                }, {
                    name: 'Let me exit.'
                }
            ]
        }
    ]).then(answers => {
        output.push(answers.answer);
        if (answers.answer) {
            newRound();
        } else {
            return;
        }
    });
}

function checkFileSize() {
    const stats = fs.statSync("./temp/thumb.jpg");
    const fileSizeInBytes = stats.size;
    if (fileSizeInBytes == sizeOf404Image) {
        return false;
    }
    if (fileSizeInBytes > sizeOf404Image) {
        return true;
    } else {
        return false;
    }
}

function checkForCharacters(info) {
    var pattern = new RegExp(/[~`!#Ã©$%\^&*+=\-\[\]\\';,/{}|\\":<>\?]/); //unacceptable chars
    if (pattern.test(info)) {
        return false;
    }
    return true;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

freshGame();
