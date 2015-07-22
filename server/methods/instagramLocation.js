var url = 'https://api.instagram.com/v1/locations/search';
var client_id = 'b67a26049bb94a3fb1af3e1a6866ba90';

Meteor.methods({
  getInstagramData: function () {
    var wrapped = Meteor.wrapAsync(getInstagramData);
    return wrapped();
  }
});

function getInstagramData(callback) {

  _.each(Venues.find({instagramLocation: null}, {
    // limit: 10,
    fields: {
      'foursquareData.venue.id': 1,
      instagramLocation: 1
    }
  }).fetch(), getIds);

  callback(null, {status: 'success'});

  function getIds(item) {
    var venueId = item.foursquareData.venue.id;

    HTTP.get(url, {params:
      {
        client_id: client_id,
        foursquare_v2_id: venueId
      }
    }, httpCallback);

    function httpCallback(error, result) {
      if (!error && result.data.data.length > 0) {

        Venues.update({'foursquareData.venue.id': venueId}, {
          $set: {
            instagramLocation: result.data
          }
        }, updateCallback);

        function updateCallback(error, result) {
          if (!error) {
            console.log('Instagram ID added to:', venueId);
          }else {
            console.log(error);
          }
        }
      }
    }
  }
}
