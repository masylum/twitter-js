# twitter-js

Easy peasy twitter client for connect.

    npm install twitter-js

## Usage

twitter-js has two methods.

* getAccesToken(_req_, _res_, _callback_): Uses oAuth module to retrieve the access_token
* apiCall(_http_method_, _path_, _params_, _callback_): Does a call to twitter API.

Params must contain the token.

## Example using express.js

    var express = require('express'),
        connect = require('connect');

    var twitterClient = require('./../')('yourKey', 'yourPass', 'http://twitter-js.com:3003/'),
        app = express.createServer(
          connect.bodyDecoder(),
          connect.cookieDecoder(),
          connect.session()
        );

    app.get('/', function (req, res) {
      twitterClient.getAccessToken(req, res, function (error, token) {
        res.render('client.jade', {locals: {token: token}});
      });
    });

    app.post('/message', function (req, res) {
      twitterClient.apiCall('POST', '/statuses/update.json',
        {token: {oauth_token_secret: req.param('oauth_token_secret'), oauth_token: req.param('oauth_token'), status: req.param('message')}},
        function (error, result) {
          res.render('done.jade');
        }
      );
    });

    app.listen(3003);


## Test

To test and see this module working:

  * copy the test folder
  * set up the keys and password of your app
  * run it _node test/client.js_
  * Add 127.0.0.1 twitter-js.com at your hosts file
  * Open your browser at localhost:3003
