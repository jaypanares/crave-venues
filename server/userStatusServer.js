Meteor.publish('anonymous', function () {
  return [
    Meteor.users.find({'status.online': true}, {fields: {status: 1, username: 1}}),
    UserStatus.connections.find()
  ];
});

UserStatus.events.on("connectionLogin", function(fields) {});

UserStatus.events.on("connectionLogout", function(fields) {
  console.log('LOGOUT', fields.userId);
  Venues.update({sessionId: fields.userId}, {$set: {sessionId: null}}, function (error, result) {
    if (!error) {
      Meteor.users.remove({_id: fields.userId}, function (error, result) {
        if (!error) {
          console.log('SUCCESS', result);
        }else {
          console.log('ERROR', error);
        }
      });
    }else {
      console.log(error);
    }
  });
});
