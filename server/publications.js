Meteor.publish('venuesCount', function () {
  Counts.publish(this, 'venuesCount', Venues.find());
});

Meteor.publish('venues', function (userId) {
  return Venues.find({
    $and:[
      {instagramLocation: {$ne: null}},
      // {curatedMedia: null},
      {$or: [{sessionId: null}, {sessionId: ''}, {sessionId: userId}]},
      {$or: [{curated: {$lt: 5}}, {curated: null}]}
    ]
  }, {
    fields: {
      'foursquareData.venue.id': 1,
      'foursquareData.venue.name': 1,
      'instagramLocation.data.id': 1,
      // instagramMedia: 1,
      curatedMedia: 1,
      curated: 1,
      sessionId: 1
    }
  });
});

Meteor.publish('adminVenues', function () {
  return Venues.find({}, {
    fields: {
      'foursquareData.venue.id': 1,
      'foursquareData.venue.name': 1,
      'instagramLocation.data.id': 1,
      curatedMedia: 1,
      curated: 1
    }
  });
});
