angular.module('app.routes', ['ionicUIRouter'])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



      .state('tabsController.news', {
    url: '/news',
    views: {
      'tab1': {
        templateUrl: 'templates/news.html',
        controller: 'newsCtrl'
      }
    }
  })

  .state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('tabsController.login', {
    url: '/login',
    views: {
      'tab2': {
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
      }
    }
  })

  /*
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.register'
      2) Using $state.go programatically:
        $state.go('tabsController.register');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab2/register
      /page1/tab3/register
  */
  .state('tabsController.register', {
    url: '/register',
    views: {
      'tab2': {
        templateUrl: 'templates/register.html',
        controller: 'registerCtrl'
      },
      'tab3': {
        templateUrl: 'templates/register.html',
        controller: 'registerCtrl'
      }
    }
  })

  .state('tabsController.requestResetPassword', {
    url: '/requestResetPassword',
    views: {
      'tab2': {
        templateUrl: 'templates/requestResetPassword.html',
        controller: 'requestResetPasswordCtrl'
      }
    }
  })

  .state('tabsController.resetPasswordForm', {
    url: '/resetPasswordForm',
    views: {
      'tab2': {
        templateUrl: 'templates/resetPasswordForm.html',
        controller: 'resetPasswordFormCtrl'
      }
    }
  })

  /*
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.resendActivationMail'
      2) Using $state.go programatically:
        $state.go('tabsController.resendActivationMail');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab2/resendActivationMail
      /page1/tab3/resendActivationMail
  */
  .state('tabsController.resendActivationMail', {
    url: '/resendActivationMail',
    views: {
      'tab2': {
        templateUrl: 'templates/resendActivationMail.html',
        controller: 'resendActivationMailCtrl'
      },
      'tab3': {
        templateUrl: 'templates/resendActivationMail.html',
        controller: 'resendActivationMailCtrl'
      }
    }
  })

  /*
    The IonicUIRouter.js UI-Router Modification is being used for this route.
    To navigate to this route, do NOT use a URL. Instead use one of the following:
      1) Using the ui-sref HTML attribute:
        ui-sref='tabsController.activateAccount'
      2) Using $state.go programatically:
        $state.go('tabsController.activateAccount');
    This allows your app to figure out which Tab to open this page in on the fly.
    If you're setting a Tabs default page or modifying the .otherwise for your app and
    must use a URL, use one of the following:
      /page1/tab2/activateAccount
      /page1/tab3/activateAccount
  */
  .state('tabsController.activateAccount', {
    url: '/activateAccount',
    views: {
      'tab2': {
        templateUrl: 'templates/activateAccount.html',
        controller: 'activateAccountCtrl'
      },
      'tab3': {
        templateUrl: 'templates/activateAccount.html',
        controller: 'activateAccountCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/page1/news')



});
