angular.module('app.controllers', [])

.controller('newsCtrl', function($scope) {

})

.controller('loginCtrl', function($scope, $state, $rootScope, AuthenticationService, $ionicLoading) {
  // reset login status
  AuthenticationService.ClearCredentials();

  $scope.login = function() {
    $scope.error = undefined;
    // change first character in $scope.username to lowercase
    if ($scope.email)
      $scope.email = $scope.email.charAt(0).toLowerCase() + $scope.email.slice(1);
    AuthenticationService.Login($scope.email, $scope.password, function(response) {
      if(response.email && $scope.email && response.email == $scope.email) {
        AuthenticationService.SetCredentials($scope.email, $scope.password);
        $rootScope.authenticated = true;
        // TODO
        //$state.go("mainTabsController.main");
        window.alert("Authenticated.");
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
    if ($scope.email)
      $scope.email = $scope.email.charAt(0).toLowerCase() + $scope.email.slice(1);
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
