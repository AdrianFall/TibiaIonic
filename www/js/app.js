// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives', 'ngRoute', 'ngCookies'])

  .config(function($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.defaults.useXDomain = true;

    /* Global Loading Screen interceptor*/
    $httpProvider.interceptors.push(function($rootScope) {
      return {
        request: function(config) {
          $rootScope.$broadcast('loading:show')
          return config
        },
        response: function(response) {
          $rootScope.$broadcast('loading:hide')
          return response
        }
      }
    });
  })

  .run(function($ionicPlatform, $rootScope, $ionicLoading) {
    $ionicPlatform.ready(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
    $rootScope.$on('loading:show', function() {
      $ionicLoading.show({template: '<ion-spinner icon="ripple"</ion-spinner>'})
    });

    $rootScope.$on('loading:hide', function() {
      $ionicLoading.hide()
    })
  })
