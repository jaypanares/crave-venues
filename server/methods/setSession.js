Meteor.methods({
  setSession: function (sessionId, query) {
    var wrapped = Meteor.wrapAsync(setSession);
    return wrapped(sessionId, query);
  }
});

function setSession(sessionId, query, callback) {
  var modifier = {
    $set: {
      sessionId: sessionId
    }
  };

  Venues.update(query, modifier, function(error, result) {
    if (!error) {
      callback(null, result);
    }else {
      callback(null, error);
    }
  });
}
