define(['lodash', 'filters/trunc','directives/map/zoom-map','directives/links-display','filters/trunc','filters/hack','factories/km-utilities','filters/uri-to-link' ], function(_) {
    'use strict';
    return ['$scope', 'locale', '$http', '$location', '$route', '$sce','authentication',
        function($scope, locale, $http, $location, $route, $sce,authentication) {
            $scope.action = {};
            $scope.action.identifier = $route.current.params.uid;

            //=======================================================================
            //
            //=======================================================================
            authentication.getUser().then(function(user) {
                $scope.user = user;
            }).then(init);

            //=======================================================================
            //
            //=======================================================================
            function init() {
                var hex = Number($scope.action.identifier).toString(16);
                var id = "52000000cbd0800000000000".substr(0, 24 - hex.length) + hex;
                var queryParameters = {
                    'q': 'schema_s:undbAction  AND id:' + id, //AND _state_s:public removed for test
                    'wt': 'json',
                    'start': 0,
                    'rows': 1000000,
                };
                $http.get('https://api.cbd.int/api/v2013/index/select', {
                    params: queryParameters,
                    cache: true
                }).success(function(data) {

                    $scope.action = data.response.docs[0];

                    $http.get('https://api.cbd.int/api/v2013/documents/'+$scope.action.identifier_s, {
                        cache: true
                    }).success(function(d) {

                      Object.assign($scope.action,d);
                    });
                });
            }
            //=======================================================================
            //
            //=======================================================================
            $scope.isAdmin = function() {
                if($scope.user)
                  return _.intersection($scope.user.roles, ['Administrator', 'undb-administrator']).length > 0;
                else
                  return false;
            };

            //=======================================================================
            //
            //=======================================================================
            function trustSrc() {
							var src ='https://www.google.com/maps/embed/v1/place?key=AIzaSyCyD6f0w00dLyl1iU39Pd9MpVVMOtfEuNI';
                return $sce.trustAsResourceUrl(src+'&&q='+$scope.action.lat_d+','+$scope.action.lng_d);
            }
            $scope.trustSrc = trustSrc;

            //=======================================================================
            // ('nl2br')
            //=======================================================================
            function trusted(val) {
                return $sce.trustAsHtml(val);

            }
            $scope.trusted=trusted;
            
						//=======================================================================
            //
            //=======================================================================
            function isGooleMap() {
								if(!$scope.action.logo_s && ($scope.action.address_s || ($scope.action.lat_d && $scope.action.lng_d)))
									return true;
									else
										return false;

            }
            $scope.isGooleMap = isGooleMap;

						//=======================================================================
            //
            //=======================================================================
            function isZoomMap() {
								if(!$scope.action.logo_s && !$scope.action.address_s && !$scope.action.lat_d && !$scope.action.lng_d)
										return true;
								else
										return false;
            }
            $scope.isZoomMap = isZoomMap;

            //=======================================================================
            //
            //=======================================================================
            $scope.getCountryFlag = function(code) {
                if (code.toLowerCase() === 'eu')
                    return 'https://www.cbd.int/images/flags/48/flag-' + 'eur' + '-48.png';
                else
                    return 'https://www.cbd.int/images/flags/48/flag-' + code + '-48.png';


            };

            //=======================================================================
            //
            //=======================================================================
            $scope.actionCountryProfile = function(code) {
                $location.url('/actions/countries/' + code.toUpperCase());
            };

            //=======================================================================
            //
            //=======================================================================
            $scope.goTo = function(url, code) {
                if (code)
                    $location.url(url + code);
                else
                    $location.url(url);
            };

            //=======================================================================
            //
            //=======================================================================
            $scope.countryCode = function(code) {
                if (code.toLowerCase() === 'eu') return 'eur';
                else return code;
            };

        }
    ];
});
