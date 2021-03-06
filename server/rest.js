var connect, expectJSONObject, http, pump, router, send200, send400, send403, send404, sendError, sendJSON, sys, url, util;

http = require('http');

sys = require('sys');

util = require('util');

url = require('url');

connect = require('connect');

send403 = function(res, message) {
  if (message == null) message = 'Forbidden';
  res.writeHead(403, {
    'Content-Type': 'text/plain'
  });
  return res.end(message);
};

send404 = function(res, message) {
  if (message == null) message = '404: Your document could not be found.\n';
  res.writeHead(404, {
    'Content-Type': 'text/plain'
  });
  return res.end(message);
};

sendError = function(res, message) {
  if (message === 'forbidden') {
    return send403(res);
  } else if (message === 'Document does not exist') {
    return send404(res);
  } else {
    console.warn("REST server does not know how to send error: '" + message + "'");
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    return res.end("Error: " + message);
  }
};

send400 = function(res, message) {
  res.writeHead(400, {
    'Content-Type': 'text/plain'
  });
  return res.end(message);
};

send200 = function(res, message) {
  if (message == null) message = 'OK';
  res.writeHead(200, {
    'Content-Type': 'text/plain'
  });
  return res.end(message);
};

sendJSON = function(res, obj) {
  res.writeHead(200, {
    'Content-Type': 'application/json'
  });
  return res.end(JSON.stringify(obj) + '\n');
};

expectJSONObject = function(req, res, callback) {
  return pump(req, function(data) {
    var obj;
    try {
      obj = JSON.parse(data);
    } catch (error) {
      send400(res, 'Supplied JSON invalid');
      return;
    }
    return callback(obj);
  });
};

pump = function(req, callback) {
  var data;
  data = '';
  req.on('data', function(chunk) {
    return data += chunk;
  });
  return req.on('end', function() {
    return callback(data);
  });
};

router = function(app, model, options) {
  var auth;
  auth = function(req, res, next) {
    var data;
    data = {
      headers: req.headers,
      remoteAddress: req.connection.remoteAddress
    };
    return model.clientConnect(data, function(error, client) {
      if (client) {
        req._client = client;
        return next();
      } else {
        return sendError(res, error);
      }
    });
  };
  app.get('/doc/:name', auth, function(req, res) {
    return model.clientGetSnapshot(req._client, req.params.name, function(error, doc) {
      if (doc) {
        res.setHeader('X-OT-Type', doc.type.name);
        res.setHeader('X-OT-Version', doc.v);
        if (typeof doc.snapshot === 'string') {
          return send200(res, doc.snapshot);
        } else {
          return sendJSON(res, doc.snapshot);
        }
      } else {
        return sendError(res, error);
      }
    });
  });
  app.put('/doc/:name', auth, function(req, res) {
    return expectJSONObject(req, res, function(obj) {
      var meta, type;
      type = obj != null ? obj.type : void 0;
      meta = obj != null ? obj.meta : void 0;
      if (!(typeof type === 'string' && (meta === void 0 || typeof meta === 'object'))) {
        return send400(res, 'Type invalid');
      } else {
        return model.clientCreate(req._client, req.params.name, type, meta, function(error) {
          if (error) {
            return sendError(res, error);
          } else {
            return send200(res);
          }
        });
      }
    });
  });
  app.post('/doc/:name', auth, function(req, res) {
    var query, version;
    query = url.parse(req.url, true).query;
    version = (query != null ? query.v : void 0) != null ? parseInt(query != null ? query.v : void 0) : parseInt(req.headers['x-ot-version']);
    if (!((version != null) && version >= 0)) {
      return send400(res, 'Version required - attach query parameter ?v=X on your URL or set the X-OT-Version header');
    } else {
      return expectJSONObject(req, res, function(obj) {
        var opData;
        opData = {
          v: version,
          op: obj,
          meta: {
            source: req.socket.remoteAddress
          }
        };
        return model.clientSubmitOp(req._client, req.params.name, opData, function(error, newVersion) {
          if (error != null) {
            return sendError(res, error);
          } else {
            return sendJSON(res, {
              v: newVersion
            });
          }
        });
      });
    }
  });
  return app["delete"]('/doc/:name', auth, function(req, res) {
    return model.clientDelete(req._client, req.params.name, function(error) {
      if (error) {
        return sendError(res, error);
      } else {
        return send200(res);
      }
    });
  });
};

module.exports = function(model, options) {
  return connect.router(function(app) {
    return router(app, model, options);
  });
};
