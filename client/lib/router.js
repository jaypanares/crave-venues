angular
  .module('crave')
  .config(RouterConfig);

RouterConfig.$inject = ['$urlRouterProvider', '$stateProvider', '$locationProvider'];

function RouterConfig($urlRouterProvider, $stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider
    .state('collector', {
      url: '/collector',
      templateUrl: 'client/modules/collector/views/collector.ng.html',
      controller: 'CollectorCtrl',
      controllerAs: 'collector'
    })
    .state('curator', {
      url: '/curator',
      templateUrl: 'client/modules/curator/views/curator.ng.html',
      controller: 'CuratorCtrl',
      controllerAs: 'curator'
    })

  $urlRouterProvider.otherwise('/curator');
}
