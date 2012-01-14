var url = require('url')
  , http = require('http')
  , OAuth = require('oauth').OAuth
  , querystring = require('querystring')
  , memoize = {};

module.exports = function (key, secret) {
  if (memoize[key + secret]) {
    return memoize[key + secret];
  }

  var CLIENT = {
    oauth: new OAuth(
      'https://twitter.com/oauth/request_token'
    , 'https://twitter.com/oauth/access_token'
    , key
    , secret
    , '1.0'
    , false
    , 'HMAC-SHA1'
    , null
    , {'Accept': '*/*', 'Connection': 'close'}
    )
  }

    , _rest_base = 'https://api.twitter.com/1';

  memoize[key + secret] = CLIENT;


  /* Does an API call to twitter and callbacks
   * when the result is available.
   *
   * @param {String} method
   * @param {String} path
   * @param {Object} params
   * @param {Function} callback
   * @return {Request}
   */
  CLIENT.apiCall = function (method, path, params, callback) {
    var token = params.token;

    delete params.token;

    function requestCallback(callback) {
      return function (error, data, response) {
        if (error) {
          callback(error, null);
        } else {
          try {
            callback(null, JSON.parse(data));
          } catch (exc) {
            callback(exc, null);
          }
        }
      };
    }

    if (method.toUpperCase() === 'GET') {
      var base = _rest_base;
      if (path.search("/search") > -1){
        base = "http://search.twitter.com";
      }
      return CLIENT.oauth.get(
        base + path + '?' + querystring.stringify(params)
      , token.oauth_token
      , token.oauth_token_secret
      , requestCallback(callback)
      );
    } else if (method.toUpperCase() === 'POST') {
      return CLIENT.oauth.post(
        _rest_base + path
      , token.oauth_token
      , token.oauth_token_secret
      , params
      , 'application/json; charset=UTF-8'
      , requestCallback(callback)
      );
    }
  };

  /* Redirects to twitter to retrieve the token
   * or callbacks with the proper token
   *
   * @param {Request} req
   * @param {Response} res
   * @param {Function} callback
   */
  CLIENT.getAccessToken = function (req, res, callback) {

    var parsed_url = url.parse(req.url, true)
      , protocol = req.socket.encrypted ? 'https' : 'http'
      , callback_url = protocol + '://' + req.headers.host + parsed_url.pathname
      , has_token = parsed_url.query && parsed_url.query.oauth_token
      , has_secret = req.session.auth && req.session.auth.twitter_oauth_token_secret;

    // Acces token
    if (has_token &&  has_secret) {

      CLIENT.oauth.getOAuthAccessToken(
        parsed_url.query.oauth_token,
        req.session.auth.twitter_oauth_token_secret,
        parsed_url.query.oauth_verifier,
        function (error, oauth_token, oauth_token_secret, additionalParameters) {
          if (error) {
            callback(error, null);
          } else {
            callback(null, {oauth_token: oauth_token, oauth_token_secret: oauth_token_secret});
          }
        }
      );

    // Request token
    } else {

      CLIENT.oauth.getOAuthRequestToken(
        { oauth_callback: callback_url },
        function (error, oauth_token, oauth_token_secret, oauth_authorize_url, additionalParameters) {
          if (!error) {
            req.session.twitter_redirect_url = req.url;
            req.session.auth = req.session.auth || {};
            req.session.auth.twitter_oauth_token_secret = oauth_token_secret;
            req.session.auth.twitter_oauth_token = oauth_token;
            res.redirect("http://api.twitter.com/oauth/authorize?oauth_token=" + oauth_token);
          } else {
            callback(error, null);
          }
        }
      );
    }
  };

  return CLIENT;
};
