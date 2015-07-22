Meteor.startup(createAdmin);

function createAdmin() {
  var userCount = Meteor.users.find().count();
  
  if (!userCount) {
    console.log('admin created');
    Accounts.createUser({username: 'admin', password: 'siddyadmin'});
  }
}
