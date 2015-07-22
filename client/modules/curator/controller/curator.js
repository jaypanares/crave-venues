angular
  .module('crave.curator')
  .controller('CuratorCtrl', CuratorCtrl);

CuratorCtrl.$inject = ['$scope', '$meteor', '_'];
function CuratorCtrl($scope, $meteor, _) {
  var vm = this;

  vm.sessionId = new Date().toISOString();
  vm.loading = 'Loading venues...';
  vm.getMedia = getMedia;
  vm.venueSave = venueSave;
  vm.venueCancel = venueCancel;
  vm.flagPhoto = flagPhoto;

  Meteor.insecureUserLogin(vm.sessionId);

  $scope.$meteorSubscribe('anonymous');

  $scope.$meteorAutorun(function () {
    $scope
      .$meteorSubscribe('venues', Meteor.userId())
      .then(function () {
        vm.collection = $scope.$meteorCollection(Venues, false);
        vm.loading = '';
      });
  });

  $scope.$meteorAutorun(function (c) {
    try {
      UserStatus.startMonitor();
      return c.stop();
    } catch (e) {}
  });

  /*helper functions*/

  function getMedia() {
    vm.message = 'Loading...';

    if (!vm.selected) {
      vm.message = '';
      return;
    }else {
      vm.foursquareId = vm.selected.foursquareData.venue.id;
      vm.instagramId = vm.selected.instagramLocation.data[0].id;
      vm.query = { 'foursquareData.venue.id': vm.foursquareId };

      $meteor.call('setSession', Meteor.userId(), vm.query)
        .catch(setSessionError);
    }

    if (!$scope.$meteorObject(Venues, vm.query, false).curatedMedia) {
      $meteor.call('getInstagramMedia', vm.instagramId, vm.query)
        .then(getMediaSuccess, getMediaError);
    }else {
      getMediaSuccess(null);
    }
  }

  function getMediaSuccess(data) {
    vm.curatedMedia = $meteor.object(Venues, vm.query, false).curatedMedia;
    vm.message = 'Images loaded!';
  }

  function getMediaError(reason) {
    console.log('MEDIA ERROR', reason);
  }

  function venueSave() {
    vm.saving = 'Saving venue...';

    $meteor
      .call('venueSave', vm.curatedMedia, vm.query)
      .then(saveCallback);
  }

  function saveCallback(response) {
    if (response) {
      vm.message = 'Venue Saved!';
      venueCancel();
    }
  }

  function venueCancel() {
    vm.message = '';
    vm.selected = null;
    vm.curatedMedia = [];
    vm.saving = '';

    $meteor.call('setSession', null, vm.query)
      .catch(setSessionError);
  }

  function flagPhoto(photo) {
    photo.flagged++;
  }

  function setSessionError(reason) {
    console.log('SESSION ERROR', reason);
  }
}
