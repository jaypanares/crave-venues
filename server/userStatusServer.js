Meteor.publish('anonymous', function () {
  return [
    Meteor.users.find({status: 'online'}, {fields: {status: 1, username: 1}}),
    UserStatus.connections.find()
  ];
});

UserStatus.events.on("connectionLogin", function(fields) {
});

UserStatus.events.on("connectionLogout", function(fields) {
  Venues.update({sessionId: fields.userId}, {$set: {sessionId: null}}, function (error, result) {
    if (!error) {
      Meteor.users.remove({$and: [{_id: fields.userId}, {username: {$ne: 'admin'}}]}, function (error, result) {
        if (error) {
          console.log('ERROR', error);
        }
      });
    }else {
      console.log(error);
    }
  });
});
