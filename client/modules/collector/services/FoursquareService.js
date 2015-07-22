/*globals angular*/

angular
  .module('crave.collector')
  .service('FoursquareService', FoursquareService);

FoursquareService.$inject = ['$meteor', '$q'];

function FoursquareService($meteor, $q) {
  var service = this;

  service.getData = getData;

  function getData(near, ll) {
    var defer = $q.defer();

    $meteor
      .call('getFoursquareData', near, ll)
      .then(callbackHandler);

    return defer.promise;

    function callbackHandler(response) {
      if (response.status === 'success') {
        defer.resolve(response);
      }else {
        defer.reject(response.message);
      }
    }
  }
}
