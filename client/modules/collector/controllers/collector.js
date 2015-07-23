/*globals angular, Counts*/

angular
  .module('crave.collector')
  .controller('CollectorCtrl', CollectorCtrl);

CollectorCtrl.$inject = ['_', '$meteor', '$rootScope', '$scope', 'FoursquareService', 'InstagramService'];
function CollectorCtrl(_, $meteor, $rootScope, $scope, FoursquareService, InstagramService) {
  var vm = this;

  _.extend(vm, {
    loading: 'Loading...',
    onSubmit: onSubmit,
    getMedia: getMedia,
    venueSave: venueSave,
    venueCancel: venueCancel,
    flagPhoto: flagPhoto,
    resetPhoto: resetPhoto,
    resetCurated: resetCurated
  });

  $scope.$meteorSubscribe('adminVenues')
    .then(function () {
      vm.loading = '';
      vm.collection = $scope.$meteorCollection(Venues, false);
    })

  function onSubmit() {
    vm.formDisabled = true;
    vm.message = 'Fetching data...';

    FoursquareService
      .getData(vm.near, vm.ll)
      .then(foursquareSuccess)
      .catch(handleError)
      .finally(enableForm);

    function foursquareSuccess(data) {
      InstagramService
        .getData()
        .then(instagramSuccess)
        .catch(handleError)
        .finally(enableForm);

      function instagramSuccess(data) {
        vm.message = 'Fetch success!';
        console.log($scope.$meteorObject(Counts, 'venuesCount', false).subscribe('venuesCount'));
      }
    }
  }

  function getMedia() {
    var venue;

    vm.message = 'Loading...';
    vm.selectDisabled = true;
    vm.curatedMedia = [];

    if (!vm.selected) {
      vm.message = '';
      return;
    }else {
      vm.foursquareId = vm.selected.foursquareData.venue.id;
      vm.query = { 'foursquareData.venue.id': vm.foursquareId };
      venue = $scope.$meteorObject(Venues, vm.query, false);
    }

    if (!venue.instagramLocation) {
      vm.message = 'No Instagram data for this venue';
    }else if (!venue.curatedMedia) {
      vm.message = 'Venue not curated yet';
    }else {
      $scope.$meteorAutorun(function () {
        vm.curatedMedia = $scope.$meteorObject(Venues, vm.query, false).curatedMedia;
        vm.curatedCount = $scope.$meteorObject(Venues, vm.query, false).curated;
      });
      vm.message = '';
    }

    vm.selectDisabled = false;
  }

  function handleError(reason) {
    vm.message = reason;
  }

  function enableForm() {
    vm.formDisabled = false;
  }

  function venueSave() {
    vm.saving = 'Saving venue...';

    $meteor
      .call('venueSave', vm.curatedCount, vm.curatedMedia, vm.query)
      .then(function (response) {
        if (response) {
          vm.message = 'Venue Saved!';
          venueCancel();
        }
      });
  }

  function venueCancel() {
    vm.message = '';
    vm.selected = null;
    vm.curatedMedia = [];
    vm.saving = '';
  }

  function flagPhoto(photo) {
    photo.flagged++;
  }

  function resetPhoto(photo) {
    photo.flagged = 0;
  }

  function resetCurated() {
    vm.curatedCount = 0;
  }
}
