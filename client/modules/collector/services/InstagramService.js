angular
  .module('crave.collector')
  .service('InstagramService', InstagramService);

InstagramService.$inject = ['$meteor', '$q'];

function InstagramService($meteor, $q) {
  var service = this;

  service.getData = getData;

  function getData() {
    var defer = $q.defer();

    $meteor
      .call('getInstagramData')
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
