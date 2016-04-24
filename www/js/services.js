var serverUrl = 'http://spring-rest-template.duckdns.org/';
angular.module('app.services', ['ngCookies'])

  .factory('BlankFactory',
    ['$http', '$rootScope',
      function($http, $rootScope, $scope) {
        var service = {

        };

        return service;
      }

    ]
  )

  .factory('InitService',
    ['$http', '$rootScope',
      function($http, $rootScope, $scope) {
        var service = {};

        // Initialize the global variables for the app
        service.init = function() {
          $rootScope.settings = {};

          // Set the list of servers on init
          $rootScope.settings.servers = [
            {'name' : 'Oldera'},
            {'name' : 'Thronia'}
          ];

          $rootScope.settings.currentServer = {};

          // Set the default rootScope.settings.currentServer on init
          $rootScope.settings.currentServer.name = $rootScope.settings.servers[0].name;
        }

        return service;
      }

    ]
  )


  .factory('AutocompleteOnlinePlayersService',
    ['$http', '$rootScope', '$q', '$timeout',
      function($http, $rootScope, $q, $scope, $timeout) {
        var service =  {}

          service._getOnlineUsers = function() {

            /* obtain the json obj*/
            // TODO in case of two word server names, figure out a new strategy for the http link
            $http.get(serverUrl + $rootScope.settings.currentServer.name.toLowerCase() + '/onlinePlayers', {})
              .success(function (response) {
                $rootScope.settings.currentServer.onlinePlayers = response;
                console.log('response : ' + JSON.stringify(response));
              }).error(function (error, status) {
              alert('error');
              errorResponse = {
                error: '',
                status: 0
              };
            }) // End error

          }

          service.autoComplete = function(searchFilter) {

            var deferred = $q.defer();

            // At least 3 chars
            if (searchFilter.length < 3) {
              // Clear the typeahead suggestion (i.e. resolve a null value)
              deferred.resolve(undefined);
            }

            console.log('Searching players for ' + searchFilter);

            console.log('Search filter = ' + searchFilter)

            // updateDelay 1 min (to stop getting online list so often)
            var updateDelay = 60000;
            var currentTimeInMs = new Date().getTime();
            var updateOnlineList = ((currentTimeInMs >= $rootScope.settings.currentServer.nextOnlineListUpdateTime) || ($rootScope.settings.currentServer.nextOnlineListUpdateTime == undefined)) ? true : false;
            console.log($rootScope.settings.currentServer)
            if (updateOnlineList /*|| $rootScope.settings.currentServer.onlinePlayers == undefined || $rootScope.settings.currentServer.onlinePlayers.name == undefined*/ /*|| lastUpdateTime < 3minutes*/) { // TODO
              $rootScope.settings.currentServer.nextOnlineListUpdateTime = currentTimeInMs + updateDelay;
              service._getOnlineUsers(); // to populate the $rootScope.settings.currentServer.onlinePlayers
            }
            // var onlinePlayers = $rootScope.settings.currentServer.onlinePlayers;
            //alert(JSON.stringify($rootScope.settings.currentServer.onlinePlayers));
            console.log($rootScope.settings.currentServer.onlinePlayers);
            if ($rootScope.settings.currentServer.onlinePlayers) { // dont bother going in if the GET has not yet finished
              var matches = $rootScope.settings.currentServer.onlinePlayers.filter(function (player) {
                if (player.name.toLowerCase().indexOf(searchFilter.toLowerCase()) !== -1) {
                  console.log(player.name + "," + searchFilter);
                  return true;
                }
              })

              deferred.resolve(matches);
            }

            /*$timeout(function () {

              deferred.resolve(matches);

            }, 100);*/

            return deferred.promise;
          } // End autoComplete method

        /* TODO decouple the getting of onlinePlayers from the above method, and put it in separate one such that it
        * sets a global variable to the $rootScope.settings.currentServer.onlinePlayers along with $rootScope.lastOnlinePlayersUpdateTime */

        return service;
      }

    ]
  )


  .factory('AccountActivationService',
    ['$http', '$rootScope',
      function($http, $rootScope, $scope) {
        var service = {};

        service.ResendActivationMail = function(email, callback) {
          var credentials = {
            email : email
          }
          $http.post(serverUrl + 'resendConfirmationEmail', credentials)
            .success(function (response) {
              callback(response);
            }).error(function (error, status) {
            errorResponse = {
              error: '',
              status: 0
            };

            switch (status) {
              case 404:
              {
                errorResponse.error = 'Page Not Found';
                errorResponse.status = status;
                callback(errorResponse);
                return;
              }
              case 406:
              {
                if (error.error)
                  errorResponse.error = error.error;
                else if (error.emailError)
                  errorResponse.error = error.emailError;
                errorResponse.status = status;
                callback(errorResponse);
                return;
              }
              default:
              {
                // server probably down
                errorResponse.error = 'No connection with server';
                errorResponse.status = 0;
                callback(errorResponse);
                return;
              }
            }
          })
        }

        service.ActivateAccount = function(token, callback) {
          $http.get(serverUrl + 'registrationConfirm', {
            params: {token: token}

          }).success(function (response) {
            callback(response);
          }).error(function (error, status) {
            errorResponse = {
              error: '',
              status: 0
            };

            switch (status) {
              case 404:
              {
                errorResponse.error = 'Page Not Found';
                errorResponse.status = status;
                callback(errorResponse);
                return;
              }
              case 406:
              {
                if (error.error)
                  errorResponse.error = error.error;
                errorResponse.status = status;
                callback(errorResponse);
                return;
              }
              default:
              {
                // server probably down
                errorResponse.error = 'No connection with server';
                errorResponse.status = 0;
                callback(errorResponse);
                return;
              }
            }
          })

        }

        return service;
      }

    ]
  )

  .factory('ResetPasswordService',
    ['$http', '$rootScope',
      function($http, $rootScope, $scope) {
        var service = {};

        service.RequestResetPassword = function(email, callback) {
          var credentials = {
            email : email
          }

          $http.post(serverUrl + 'requestResetPassword', credentials)
            .success(function (response) {
              callback(response);
            }).error(function (error, status) {
            errorResponse = {
              error: '',
              status: 0
            };

            switch (status) {
              case 404:
              {
                errorResponse.error = 'Page Not Found';
                errorResponse.status = status;
                callback(errorResponse);
                return;
              }
              case 406:
              {
                if (error.error)
                  errorResponse.error = error.error;
                errorResponse.status = status;
                callback(errorResponse);
                return;
              }
              default:
              {
                // server probably down
                errorResponse.error = 'No connection with server';
                errorResponse.status = 0;
                callback(errorResponse);
                return;
              }
            }
            })
        }

        service.ResetPassword = function(token, password, confirmPassword, callback) {
          var credentials = {
            token: token,
            password: password,
            confirmPassword: confirmPassword
          }

          $http.post(serverUrl + 'resetPassword', credentials)
            .success(function (response) {
              callback(response);
            }).error(function (error, status) {
            errorResponse = {
              error: '',
              status: 0
            };

            switch (status) {
              case 404:
              {
                errorResponse.error = 'Page Not Found';
                errorResponse.status = status;
                callback(errorResponse);
                return;
              }
              case 406:
              {
                if (error.error)
                  errorResponse.error = error.error;
                else if (error.passwordError)
                  errorResponse.error = error.passwordError;
                else if (error.confirmPasswordError)
                  errorResponse.error = error.confirmPasswordError;
                errorResponse.status = status;
                callback(errorResponse);
                return;
              }
              default:
              {
                // server probably down
                errorResponse.error = 'No connection with server';
                errorResponse.status = 0;
                callback(errorResponse);
                return;
              }
            }
          })

        }

        return service;
      }

    ]
  )


  .factory('RegistrationService',
    ['$http', '$rootScope',
      function($http, $rootScope, $scope) {
        var service = {};

        service.Register = function(email, password, confirmPassword, callback) {
          var credentials = {
            email : email,
            password: password,
            confirmPassword: confirmPassword
          }
          $http.post(serverUrl + 'register', credentials)
            .success(function (response) {
              callback(response);
            }).error(function(error,status) {
              errorResponse = {
                error: '',
                status: 0
              };

              switch (status) {
                case 404:
                {
                  errorResponse.error = 'Page Not Found';
                  errorResponse.status = status;
                  callback(errorResponse);
                  return;
                }
                case 406:
                {
                  if (error.emailError)
                    errorResponse.error = error.emailError;
                  else if (error.passwordError)
                    errorResponse.error = error.passwordError;
                  else if (error.confirmPasswordError)
                    errorResponse.error = error.confirmPasswordError;
                  errorResponse.status = status;
                  callback(errorResponse);
                  return;
                }
                default:
                {
                  // server probably down
                  errorResponse.error = 'No connection with server';
                  errorResponse.status = 0;
                  callback(errorResponse);
                  return;
                }
              }
            })
        }

        return service;
      }

    ]
  )

  .factory('AuthenticationService',
    ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout',
      function (Base64, $http, $cookieStore, $rootScope, $scope, $timeout) {
        var service = {};

        service.Login = function (username, password, callback) {

          /* Use this for real authentication
           ----------------------------------------------*/
          $http.defaults.headers.common['Authorization'] = 'Basic ' + Base64.encode(username + ':' + password);
          $http.get(serverUrl + 'api/user', {})
            .success(function (response) {
              callback(response);
            }).error(function(error, status) {
            errorResponse = {
              error: '',
              status: 0
            };
            switch (status) {
              case 404:
              {
                errorResponse.error = 'Page Not Found';
                errorResponse.status = status;
                callback(errorResponse);
                return;
              }
              case 401:
              {
                errorResponse.error = "Not authorized, please make sure your email is activated.";
                errorResponse.status = 401;
                callback(errorResponse);
                return;
              }
              default:
              {
                // server probably down
                errorResponse.error = 'No connection with server';
                errorResponse.status = 0;
                callback(errorResponse);
                return;
              }
            }


           /* window.alert('status ' + status);

              if (status == 404) {
                response.error = 'Page Not Found';
                response.status = status;
                callback(errorResponse);
              }


              callback(errorResponse);
            */
            });

        };

        service.SetCredentials = function (username, password) {
          var authdata = Base64.encode(username + ':' + password);

          $rootScope.globals = {
            currentUser: {
              username: username,
              authdata: authdata
            }
          };

          $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
          $cookieStore.put('globals', $rootScope.globals);
        };

        service.ClearCredentials = function () {
          $rootScope.globals = {};
          $cookieStore.remove('globals');
          $http.defaults.headers.common.Authorization = 'Basic ';
        };

        return service;
      }])

  .factory('Base64', function () {
    /* jshint ignore:start */

    var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

    return {
      encode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        do {
          chr1 = input.charCodeAt(i++);
          chr2 = input.charCodeAt(i++);
          chr3 = input.charCodeAt(i++);

          enc1 = chr1 >> 2;
          enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
          enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
          enc4 = chr3 & 63;

          if (isNaN(chr2)) {
            enc3 = enc4 = 64;
          } else if (isNaN(chr3)) {
            enc4 = 64;
          }

          output = output +
            keyStr.charAt(enc1) +
            keyStr.charAt(enc2) +
            keyStr.charAt(enc3) +
            keyStr.charAt(enc4);
          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";
        } while (i < input.length);

        return output;
      },

      decode: function (input) {
        var output = "";
        var chr1, chr2, chr3 = "";
        var enc1, enc2, enc3, enc4 = "";
        var i = 0;

        // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(input)) {
          window.alert("There were invalid base64 characters in the input text.\n" +
            "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
            "Expect errors in decoding.");
        }
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

        do {
          enc1 = keyStr.indexOf(input.charAt(i++));
          enc2 = keyStr.indexOf(input.charAt(i++));
          enc3 = keyStr.indexOf(input.charAt(i++));
          enc4 = keyStr.indexOf(input.charAt(i++));

          chr1 = (enc1 << 2) | (enc2 >> 4);
          chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
          chr3 = ((enc3 & 3) << 6) | enc4;

          output = output + String.fromCharCode(chr1);

          if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
          }
          if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
          }

          chr1 = chr2 = chr3 = "";
          enc1 = enc2 = enc3 = enc4 = "";

        } while (i < input.length);

        return output;
      }
    };

    /* jshint ignore:end */
  })
.service('BlankService', [function(){

}]);

