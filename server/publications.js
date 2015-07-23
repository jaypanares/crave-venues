Meteor.publish('venuesCount', function () {
  Counts.publish(this, 'venuesCount', Venues.find());
});

Meteor.publish('venues', function () {
  return Venues.find({
    $and:[
      {instagramLocation: {$ne: null}},
      {$or: [{sessionId: null}, {sessionId: ''}, {sessionId: this.userId}]},
      {$or: [{curated: {$lt: 5}}, {curated: null}]}
    ]
  }, {
    fields: {
      'foursquareData.venue.id': 1,
      'foursquareData.venue.name': 1,
      'instagramLocation.data.id': 1,
      curatedMedia: 1,
      curated: 1,
      sessionId: 1
    }
  });
});

Meteor.publish('adminVenues', function () {
  var selector = {};
  var options = {
    fields: {
      'foursquareData.venue.id': 1,
      'foursquareData.venue.name': 1,
      'instagramLocation.data.id': 1,
      curatedMedia: 1,
      curated: 1
    }
  };

  if (this.userId) {
    return Venues.find(selector, options);
  }
  return;
});
