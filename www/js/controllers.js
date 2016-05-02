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

        InitService.init().then(function() {
          $state.go("mainTabsController.settings");
        });

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

.controller('huntedListCtrl', function($scope, $rootScope, AutocompleteOnlinePlayersService, HuntedListService, $ionicLoading, $ionicPopup) {
  $scope.data = { "onlinePlayers" : [], "search" : '' };

  $scope.$on('$ionicView.enter', function (viewInfo, state) {
    console.log('CTRL - $ionicView.enter', viewInfo, state);
    // get the hunted list on enter
    // TODO consider adding some delay
    $scope.getHuntedList();
  });

  $scope.huntedPlayersSelection = {};
  $scope.isAllHuntedPlayersSelected = false;

  $scope.selectAllHuntedPlayers = function() {
    //check if all selected or not
    if ($scope.isAllHuntedPlayersSelected === false) {
      //set all row selected
      angular.forEach($rootScope.settings.currentServer.huntedList, function(row, index) {
        $scope.huntedPlayersSelection[index] = true;
      });
      $scope.isAllHuntedPlayersSelected = true;
    } else {
      //set all row unselected
      $scope._setAllRowUnselected();
    }
  }

  $scope._setAllRowUnselected = function() {
    angular.forEach($rootScope.settings.currentServer.huntedList, function(row, index) {
      $scope.huntedPlayersSelection[index] = false;
    });
    $scope.isAllHuntedPlayersSelected = false;
  }

  $scope.removeSelectedHuntedPlayers = function() {

    var currentServerName = $rootScope.settings.currentServer.name;

    var confirmPopup = $ionicPopup.confirm({
      title: 'Remove Hunted Players',
      template: 'Are you sure you want to remove this selection of players?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        console.log('RemovingHuntedPlayers on server : ' + currentServerName);

        // For the POST json file
        var huntedPlayers = [];

        // Index in the huntedPlayersSelection, so it can be removed on success (removeHuntedPlayers(..).then)
        var huntedPlayersIndex = [];

        //start from last index because starting from first index cause shifting
        //in the array because of array.splice()
        for (var i = $rootScope.settings.currentServer.huntedList.length; i >= 0; i--) {
          if ($scope.huntedPlayersSelection[i]) {


            huntedPlayersIndex.push(i);

            huntedPlayers.push({
              huntedPlayerName:$rootScope.settings.currentServer.huntedList[i].name,
              serverName:currentServerName
            })

            // huntedPlayersToDelete.push($rootScope.settings.currentServer.huntedList[i].id);
          }
        } // End iterating over the currentServer.huntedList

        if (huntedPlayers.length < 1) {
          console.log('Nothing to delete in huntedPlayers');
          return;
        }


        var json = { huntedPlayers: huntedPlayers}


        console.log('Passing huntedPlayers : ' + JSON.stringify(json))
        HuntedListService.removeHuntedPlayers(json).then(
          function(response) {
            console.log('RemoveHuntedPlayers response : ' + JSON.stringify(response));

            console.log('response.numberOfDeleted: ' + response.numberOfDeleted + ' huntedPlayers.length: ' + huntedPlayers.length);
            if(response && response.numberOfDeleted && response.numberOfDeleted == huntedPlayers.length) {

              console.log('Removing selection of hunted players of length: ' + huntedPlayersIndex.length);

              // Iterate through the huntedPlayersIndex and remove the players
              //start from last index because starting from first index cause shifting
              //in the array because of array.splice()
              /*for (var i = huntedPlayersIndex.length; i >= 0; i--) {
                $rootScope.settings.currentServer.huntedList.splice(huntedPlayersIndex[i], 1);
                //delete from the selection
                delete $scope.huntedPlayersSelection[huntedPlayersIndex[i]];

                // Deselect all
                $scope._setAllRowUnselected();
              }*/

              for (var i = 0; i < huntedPlayersIndex.length; i++) {
                $rootScope.settings.currentServer.huntedList.splice(huntedPlayersIndex[i], 1);
                // Delete from the selection
                delete $scope.huntedPlayersSelection[huntedPlayersIndex[i]];
              }

              console.log('Deselecting "select all" checkbox');


              $scope.isAllHuntedPlayersSelected = false;




              console.log('Removed the selection of hunted players');

            } else {
              console.log('Something went wrong when deleting the selection of hunted players');
            }

          }
        )
      } else {
        console.log('You are not sure');
      }
    });

  }

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


    var confirmPopup = $ionicPopup.confirm({
      title: 'Remove Hunted Player',
      template: 'Are you sure you want to remove this player?'
    });

    confirmPopup.then(function(res) {
      if(res) {
        console.log('RemovingHuntedPlayer with name : ' + huntedPlayerName + ", on server : " + currentServerName);

        var huntedPlayers = [{
          huntedPlayerName:huntedPlayerName,
          serverName:currentServerName
        },]

        var json = { huntedPlayers: huntedPlayers}


        console.log('Passing huntedPlayers : ' + JSON.stringify(json))
        HuntedListService.removeHuntedPlayers(json).then(
          function(response) {
            console.log('RemoveHuntedPlayer response : ' + JSON.stringify(response));
            if (response && response.numberOfDeleted && response.numberOfDeleted == 1) {

              //start from last index because starting from first index cause shifting
              //in the array because of array.splice()
              for (var i = $rootScope.settings.currentServer.huntedList.length-1; i >= 0; i--) {
                if ($rootScope.settings.currentServer.huntedList[i].name == huntedPlayerName) {
                  $rootScope.settings.currentServer.huntedList.splice(i, 1);
                  // Delete from the selection

                  delete $scope.huntedPlayersSelection[i];

                  // Set all rows unselected just in case
                  $scope._setAllRowUnselected();

                }
              } // End iterating over the currentServer.huntedList












              console.log('Removed Hunter Player: ' + huntedPlayerName);
            }
          }
        )
      } else {
        console.log('You are not sure');
      }
    });



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
        if (response && response.name) {
          console.log('response : ' + JSON.stringify(response))
          // Add to the rootscope huntedlist
          //"vocation":"Elder Druid","level":49,"name":"Sir Punxeon","isOnline":true,"id":560
          $rootScope.settings.currentServer.huntedList.push({
            vocation: response.vocation,
            level: response.level,
            name: response.name,
            isOnline: response.isOnline,
            id: response.id
          })

          // Remove from the search data
          $scope.data.search = "";
        }
        // And
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
