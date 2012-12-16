var ninjaBlocks = require('ninja-blocks')
  , request = require('request');

exports.handleNinjaAuthentication = function(req,res,ninja) {

  req.session.ninja = ninja.data;
  req.session.token = ninja.token;
  res.redirect('/');
};

exports.proxy = function(req,res) {

  // Extend the request's query string with the access token
  var query = req.query;
  query.access_token = req.session.token;
  // Make the request
  request({
      url:'https://api.ninja.is'+req.url,
      qs:query,
      json:req.body
  }).pipe(res);
};

exports.index = function(req, res){

  var ninja = ninjaBlocks.app({access_token:req.session.token});
  ninja.devices(function(err,devices) {

    res.render('index.jade',{
      title:'Node Ninja App Stub',
      ninja:req.session.ninja,
      devices:devices
    });
  });
};

exports.putUserStore = function(req,res) {

  for (var i in req.body) {
    if (req.body.hasOwnProperty(i)) {
      if (typeof req.body[i]==="object")
        req.body[i] = JSON.stringify(req.body[i])
    }
  }
  req.redisClient.hmset('user:'+req.session.ninja.id+':store',req.body,function(err) {

    if (err) {
      res.json({error:'Unkown Database Error'},500);
      return;
    }
    res.send(200);
  });
};

exports.getUserStore = function(req,res) {

  req.redisClient.hgetall('user:'+req.session.ninja.id+':store',function(err,reply) {

    reply = reply || {};
    for (var i in reply) {
      if (reply.hasOwnProperty(i)) {
        try { reply[i] = JSON.parse(reply[i]) }
        catch (err) { }
      }
    }

    if (err) {
      res.json({error:'Unkown Database Error'},500);
      return;
    }
    res.json(reply);
  });
};