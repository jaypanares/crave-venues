var foursquareUrl = 'https://api.foursquare.com/v2/venues/explore';
var foursquareParams = {
  client_id: 'JS0C5EYQVSPELHZDEVXKAAIRUK2YSJP1XX5DLOKSSCNUR1FS',
  client_secret: 'NOATEYKMV1XPNZEXZVGNVVN2R22QP5HVPXALSTMDXLMVUNAT',
  v: '20150716',
  m: 'foursquare',
  limit: 5,
  offset: 0
};

var venues = [];

Meteor.methods({
  getFoursquareData: function (near, ll) {
    var wrapped = Meteor.wrapAsync(getFoursquareData);
    return wrapped(near, ll);
  }
});

function getFoursquareData(near, ll, callback) {
  foursquareParams = _.omit(foursquareParams, 'near');
  foursquareParams = _.omit(foursquareParams, 'll');

  if (near) {
    foursquareParams.near = near;
  }
  if (ll) {
    foursquareParams.ll = ll;
  }

  console.log(foursquareParams);

  HTTP.get(foursquareUrl, {params: foursquareParams}, function (error, result) {
    if (!error) {
      var items = result.data.response.groups[0].items;

      if (items.length > 0) {
        console.log('FETCHING', items.length);

        _.each(items, function (item) {
          if (Venues.find({'foursquareData.venue.id': item.venue.id}).count() !== 1) {
            Venues.insert({
              foursquareData: item,
              instagramLocation: null
            });
          }
        });

        // foursquareParams.offset += 50;
        // getFoursquareData(near, ll, callback);
        console.log('TOTAL VENUES FETCHED: ', Venues.find().count());
        foursquareParams.offset = 0;
        callback(null, {status: 'success'});
      }else {
        console.log('TOTAL VENUES FETCHED: ', Venues.find().count());
        foursquareParams.offset = 0;
        callback(null, {status: 'success'});
      }
    }else {
      callback(null, {status: 'error', message: error.response.data.meta.errorDetail});
    }
  })
}
