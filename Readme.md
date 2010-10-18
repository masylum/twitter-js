# twitter-js

Easy peasy twitter client

    npm install twitter-js

## Usage

twitter-js has two methods.

*getAccesToken*: Uses oAuth module to retrieve the access_token
*apiCall*: Does a call to twitter API.

## Example using express.js

    app.post('/tweet/:message', function (req, res) {
      var self = this,
          twitterClient = require('twitter-js').twitterClient('consumerKey', 'consumerSecret');

      twitterClient.getAccessToken(req, res, function (error, token) {
        twitterClient.apiCall(
          'POST',
          '/statuses/update.json',
          { token: {oauth_token_secret: token.oauth_token, oauth_token: token.oauth_token_secret}, status: req.param('message') },
          function (error, result) {
            res.render('tweet.jade', {locals: {result: result}});
          }
        );
      });
    });
