Meteor.methods({
  venueSave: function (curatedCount, curatedMedia, query) {
    var wrapped = Meteor.wrapAsync(venueSave);
    return wrapped(curatedCount, curatedMedia, query);
  }
});

function venueSave(curatedCount, curatedMedia, query, callback) {
  var user = Meteor.users.findOne(Meteor.userId());
  var modifier = { $set: { curatedMedia: curatedMedia, sessionId: null } };

  if (user.username === 'admin') {
    _.extend(modifier, {$set: {curated: curatedCount}});
  }else{
    _.extend(modifier, {$inc: {curated: 1}});
  }

  Venues.update(query, modifier, function (error, result) {
    if (!error) {
      callback(null, result);
    }else {
      callback(null, error);
    }
  });
}
