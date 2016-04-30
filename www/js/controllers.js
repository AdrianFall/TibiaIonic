angular.module('app.controllers', [])

.controller('newsCtrl', function($scope) {

})

/*.controller('autoCompleteCtrl', function($scope, $rootScope, AutocompleteOnlinePlayersService) {


})*/

.controller('loginCtrl', function($scope, $state, $rootScope, AuthenticationService, InitService, $ionicLoading) {
  // reset login status
  AuthenticationService.ClearCredentials();
  $rootScope.authenicated = false;

  $scope.login = function() {
    $scope.error = undefined;
    // change first character in $scope.username to lowercase
    if ($scope.email)
      $scope.email = $scope.email.charAt(0).toLowerCase() + $scope.email.slice(1);
    AuthenticationService.Login($scope.email, $scope.password, function(response) {
      if(response.email && $scope.email && response.email == $scope.email) {
        AuthenticationService.SetCredentials($scope.email, $scope.password);
        $rootScope.authenticated = true;

        InitService.init();
        $state.go("mainTabsController.settings");
      } else {
        $scope.error = response.error;
        $rootScope.authenticated = false;
      }
      $ionicLoading.hide()
    });

  }
})

.controller('registerCtrl', function($scope, $state, $rootScope, RegistrationService, $ionicLoading) {
  $scope.register = function() {
    $scope.error = undefined;
    $rootScope.message = undefined;
    if ($scope.email) {
      $scope.email = $scope.email.charAt(0).toLowerCase() + $scope.email.slice(1);
    }
    RegistrationService.Register($scope.email, $scope.password, $scope.confirmPassword, function(response) {
      if(response.email && $scope.email && response.email == $scope.email) {
        window.alert("Registration Complete, please activate your account");
        $state.go('tabsController.resendActivationMail_tab3').then( function() {
          $state.go('tabsController.activateAccount_tab3');
        });
      } else
        $scope.error = response.error;

      $ionicLoading.hide();
    });
  }
})
/**/
.controller('requestResetPasswordCtrl', function($scope, $state, $rootScope, ResetPasswordService, $ionicLoading) {
  // Builds up the history for ionicHistory (back button functionality)
  $scope.openRequestResetPasswordWithHistory = function() {
    $state.go('tabsController.login').then(function() {
      $state.go('tabsController.requestResetPassword');
    });
  }

  $scope.requestResetPassword = function () {
    $scope.error = undefined;
    if ($scope.email)
      $scope.email = $scope.email.charAt(0).toLowerCase() + $scope.email.slice(1);
    ResetPasswordService.RequestResetPassword($scope.email, function(response) {
      if (response.message) {
        $rootScope.message = response.message;
        $state.go('tabsController.resetPasswordForm');
      } else
        $scope.error = response.error;
      $ionicLoading.hide();
    })
  }
})

.controller('resetPasswordFormCtrl', function($scope, $state, $rootScope, ResetPasswordService, $ionicLoading, $timeout) {
  // Builds up the history for ionicHistory (back button functionality)
  $scope.openResetPasswordFormWithHistory = function() {
    $state.go('tabsController.login').then(function() {
      $state.go('tabsController.requestResetPassword').then( function() {
        $state.go('tabsController.resetPasswordForm');
      });
    });
  }

  $scope.resetPassword = function() {
    $scope.error = undefined;
    $rootScope.message = undefined;
    $scope.message = undefined;
    ResetPasswordService.ResetPassword($scope.token, $scope.password, $scope.confirmPassword, function(response) {
      if (response.message) {
        $scope.message = response.message;
      } else
        $scope.error = response.error;
      $ionicLoading.hide();
    })
  }
})

.controller('resendActivationMailCtrl', function($scope, $state, $rootScope, AccountActivationService, $ionicLoading) {
  // Builds up the history for ionicHistory (back button functionality)
  $scope.openResendActivationMailWithHistory = function () {
    $state.go('tabsController.register_tab3').then(function() {
      $state.go('tabsController.resendActivationMail_tab3');
    });
  };

  $scope.resendActivationMail = function() {
    $scope.error = undefined;
    $rootScope.message = undefined;
    if ($scope.email)
      $scope.email = $scope.email.charAt(0).toLowerCase() + $scope.email.slice(1);
    AccountActivationService.ResendActivationMail($scope.email, function(response) {
      if (response.message) {
        $rootScope.message = response.message;
        $state.go('tabsController.activateAccount_tab3');
      } else
        $scope.error = response.error;
      $ionicLoading.hide();
    })
  }

})

.controller('activateAccountCtrl', function($scope, $state, $rootScope, AccountActivationService, $ionicLoading) {
  // Builds up the history for ionicHistory (back button functionality)
  $scope.openActivateAccountWithHistory = function () {
    $state.go('tabsController.register_tab3').then(function() {
      $state.go('tabsController.resendActivationMail_tab3').then( function() {
        $state.go('tabsController.activateAccount_tab3');
      });
    });
  };

  $scope.activateAccount = function () {
    $scope.error = undefined;
    $rootScope.message = undefined;
    $scope.message = undefined;
    AccountActivationService.ActivateAccount($scope.token, function(response) {
      if (response.message && response.token && response.token == $scope.token) {
        $scope.message = response.message;
      } else
        $scope.error = response.error;
      $ionicLoading.hide();
    })
  }
})

.controller('huntedListCtrl', function($scope, $rootScope, AutocompleteOnlinePlayersService, HuntedListService, $ionicLoading) {
  $scope.data = { "onlinePlayers" : [], "search" : '' };

  $scope.$on('$ionicView.enter', function (viewInfo, state) {
    console.log('CTRL - $ionicView.enter', viewInfo, state);
    // get the hunted list on enter
    // TODO consider adding some delay
    $scope.getHuntedList();
  });

  $scope.search = function() {

    AutocompleteOnlinePlayersService.autoComplete($scope.data.search).then(
      function(matches) {
        $scope.error = undefined;
        $scope.data.onlinePlayers = matches;
      }
    )
  }

  $scope.getHuntedList = function() {
    HuntedListService.getHuntedList().then(
      function(response) {
        console.log(JSON.stringify(response));
        $rootScope.settings.currentServer.huntedList = response;

      }
    )
  }

  $scope.removeHuntedPlayer = function(huntedPlayerName) {
    var currentServerName = $rootScope.settings.currentServer.name;
    /*console.log('Controller -> start of removeHuntedPlayer')*/
    console.log('RemovingHuntedPlayer with name : ' + huntedPlayerName + ", on server : " + currentServerName);

    var huntedPlayers = [{
      huntedPlayerName:huntedPlayerName,
      serverName:currentServerName
    },]

    var json = { huntedPlayers: huntedPlayers}


    console.log('Passing huntedPlayers : ' + JSON.stringify(json))
    HuntedListService.removeHuntedPlayers(json).then(
      function(response) {
        console.log('RemoveHuntedPlayers response : ' + JSON.stringify(response));
      }
    )

  }

  $scope.addToSearch = function(playerName) {
    $scope.data.search = playerName;
    $scope._cleanTypeahead();
  }

  $scope.cleanSearch = function() {
    $scope._cleanTypeahead();
  }

  $scope.addToHuntedList = function() {
    console.log('adding to hunted list : ' + $scope.data.search);

    HuntedListService.addToHuntedList($scope.data.search).then(
      function(response) {
        console.log('response : ' + JSON.stringify(response))
        if (response.error) {
          $scope.error = response.error;
        }
        // TODO
        $ionicLoading.hide();
      }
    )

    // Clean
    $scope._cleanTypeahead();
    $scope.cleanSearch();
  }

  $scope._cleanTypeahead = function() {
    $scope.error = undefined;
    $scope.data.onlinePlayers = undefined;
  }
})

.controller('friendListCtrl', function($scope) {

})

.controller('settingsCtrl', function($scope, $rootScope) {

  $scope._init = function() {
    $scope.settings = {};

    $scope.settings.servers = $rootScope.settings.servers;

    // Set the default server on init // TODO add local storage for saving the last serv
    $scope.settings.selectedItem = $rootScope.settings.servers[0].name;

  } // End _init method

  // Initialize controller
  $scope._init();
  $scope.updateCurrentServer = function() {
    $rootScope.settings.currentServer = {};
    $rootScope.settings.currentServer.name = $scope.settings.selectedItem;
  }
})

.controller('indexCtrl', function($scope, $rootScope, $state) {
  $scope.logout = function() {
    $rootScope.authenticated = false;
    $state.transitionTo("tabsController.news");
  }
})
