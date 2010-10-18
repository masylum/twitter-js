# twitter-js

Easy peasy twitter client for connect/express.

    npm install twitter-js

## Usage

twitter-js has two methods.

* getAccesToken(_req_, _res_, _callback_): Uses oAuth module to retrieve the access_token
* apiCall(_http_method_, _path_, _params_, _callback_): Does a call to twitter API.

## Example using express.js

    app.post('/tweet/:message', function (req, res) {
      var self = this,
          twitterClient = require('twitter-js').twitterClient('consumerKey', 'consumerSecret');

      twitterClient.getAccessToken(req, res, function (error, token) {
        twitterClient.apiCall('POST', '/statuses/update.json',
          {token: token, status: req.param('message')},
          function (error, result) {
            res.render('tweet.jade', {locals: {result: result}});
          }
        );
      });
    });
