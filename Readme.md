# twitter-js

Easy peasy twitter client

## Usage

twitter-js has two methods.

*getAccesToken*: Uses oAuth module to retrieve the access_token
*apiCall*: Does a call to twitter API.

## Example

      var twitterClient = require('twitter-js').twitterClient('consumerKey', 'consumerSecret');

      twitterClient.getAccessToken({
        redirect_uri: '/auth/twitter',
        code: req.param('code'),
      },
      function (error, token) {
        if (token) {
          facebookClient.graphCall('GET', 'me', {access_token: token.access_token}, function (error, result) {
            sys.puts(sys.inspect(result));
          });
        }
      }
    );

