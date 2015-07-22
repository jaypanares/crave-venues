Meteor.methods({
  flagPhoto: function (query, photoId) {
    var wrapped = Meteor.wrapAsync(flagPhoto);
    return wrapped(query, photoId);
  }
});

function flagPhoto(query, photoId, callback) {
  Venues.update(query, modifier, function(error, result) {
  	if (!error) {
  		callback(null, result);
  	} else{
      callback(null, error);
    }
  });
}
