# twitter-js

Easy peasy twitter client for connect.

``` bash
npm install twitter-js
```

## Usage

twitter-js has two methods.

* `getAccesToken(req, res, callback)`: Uses oAuth module to retrieve the access_token
* `apiCall(http_method, path, params, callback)`: Does a call to twitter API.

Params must contain the token.

## Example using express.js

    var express = require('express');
      , twitterClient = require('twitter-js')('yourKey', 'yourPass')
      , app = express.createServer(
          express.bodyParser()
        , express.cookieParser()
        , express.session({secret: 'yourSecret'})
        );

    app.get('/', function (req, res) {
      twitterClient.getAccessToken(req, res, function (error, token) {
        res.render('client', {token: token});
      });
    });

    app.post('/message', function (req, res) {
      twitterClient.apiCall('POST', '/statuses/update.json',
        {token: {oauth_token_secret: req.param('oauth_token_secret'), oauth_token: req.param('oauth_token')}, status: req.param('message')},
        function (error, result) {
          res.render('done.jade');
        }
      );
    });

    app.listen(3003);


## Test

`twitter-js` is fully tested using [testosterone](https://github.com/masylum/testosterone)

``` bash
make
```
