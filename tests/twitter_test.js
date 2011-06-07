var testosterone = require('testosterone')({title: 'models/twitter'})
  , assert = testosterone.assert
  , querystring = require('querystring')
  , gently = global.GENTLY = new (require('gently'))
  , key = 'foo'
  , secret = 'bar'
  , redirect = 'http://google.com'
  , token = {oauth_token: '123', oauth_token_secret: '456'}
  , twitter_client = require('../')(key, secret, redirect)
  ;

testosterone

  .add('`apiCall` GET', function (done) {
    var callback;

    gently.expect(twitter_client.oauth, 'get', function (_path, _token, _secret, _callback) {
      assert.equal(_path, 'https://api.twitter.com/1/statuses/public_timeline.json?trim_user=true');
      assert.equal(_token, token.oauth_token);
      assert.equal(_secret, token.oauth_token_secret);
      _callback(null, '{"foo": "bar"}');
    });

    callback = gently.expect(function (error, response, body) {
      assert.deepEqual(response, {foo: 'bar'});
      done();
    });

    twitter_client.apiCall('GET', '/statuses/public_timeline.json', {token: token, trim_user: true}, callback);
  })

  .add('`apiCall` POST', function (done) {
    var callback;

    gently.expect(twitter_client.oauth, 'post', function (_path, _token, _secret, _params, _accept_header, _callback) {
      assert.equal(_path, 'https://api.twitter.com/1/statuses/update.json');
      assert.equal(_token, token.oauth_token);
      assert.equal(_secret, token.oauth_token_secret);
      assert.deepEqual(_params, {status: 'Tweet!'});
      assert.deepEqual(_accept_header, 'application/json; charset=UTF-8');
      _callback(null, '{"foo": "bar"}');
    });

    callback = gently.expect(function (error, response, body) {
      assert.deepEqual(response, {foo: 'bar'});
      done();
    });

    twitter_client.apiCall('POST', '/statuses/update.json', {token: token, status: 'Tweet!'}, callback);
  })

  .run();
