/*globals angular, Counts*/

angular
  .module('crave.collector')
  .controller('CollectorCtrl', CollectorCtrl);

CollectorCtrl.$inject = ['_', '$meteor', '$scope', 'FoursquareService', 'InstagramService'];

function CollectorCtrl(_, $meteor, $scope, FoursquareService, InstagramService) {
  var vm = this;

  vm.onSubmit = onSubmit;

  $scope.$meteorSubscribe('adminVenues')
    .then(function (data) {
      console.log(data);
    }).catch(function (reason) {
      console.log(reason);
    });

  function onSubmit() {
    vm.btnDisabled = true;
    vm.message = 'Fetching data...';

    FoursquareService
      .getData(vm.near, vm.ll)
      .then(foursquareSuccess)
      .catch(handleError)
      .finally(enableButton);

    function foursquareSuccess(data) {
      InstagramService
        .getData()
        .then(instagramSuccess)
        .catch(handleError)
        .finally(enableButton);

      function instagramSuccess(data) {
        vm.message = 'Fetch success!';
        console.log($scope.$meteorObject(Counts, 'venuesCount', false).subscribe('venuesCount'));
      }
    }
  }

  function handleError(reason) {
    vm.message = reason;
  }

  function enableButton() {
    vm.btnDisabled = false;
  }
}
