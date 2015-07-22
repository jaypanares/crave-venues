var
  url = 'https://api.instagram.com/v1/locations/1288139/media/recent',
  client_id = 'b67a26049bb94a3fb1af3e1a6866ba90',
  venue;

Meteor.methods({
  getInstagramMedia: function (id, query) {
    var wrapped = Meteor.wrapAsync(getInstagramMedia);
    return wrapped(id, query);
  }
});

function getInstagramMedia(id, query, callback) {
  var url = 'https://api.instagram.com/v1/locations/' + id + '/media/recent';
  var params = {params: 
    {client_id: client_id}
  };

  HTTP.get(url, params, httpCallback);

  function httpCallback(error, result) {
    if (!error) {
      var instagramMedia = result.data.data;

      var curatedMedia = _.map(instagramMedia, function (item) {
        return {
          id: item.id,
          images: item.images,
          flagged: 0
        };
      });

      var modifier = { $set: {
          instagramMedia: instagramMedia,
          curatedMedia: curatedMedia,
          curated: 0
        }
      };

      Venues.update(query, modifier, function (error, result) {
        if (!error) { callback(null, result); }
        else { callback(null, error); }
      });

    }else { callback(null, error); }
  }
}
