Meteor.methods({
  venueSave: function (curatedMedia, query) {
    var wrapped = Meteor.wrapAsync(venueSave);
    return wrapped(curatedMedia, query);
  }
});

function venueSave(curatedMedia, query, callback) {
  var modifier = {
    $set: { curatedMedia: curatedMedia, sessionId: null },
    $inc: { curated: 1 }
  };

  Venues.update(query, modifier, updateCallback);

  function updateCallback(error, result) {
    if (!error) {
      callback(null, result);
    }else {
      callback(null, error);
    }
  }
}
