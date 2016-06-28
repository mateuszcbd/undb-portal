define([ 'filters/trunc','directives/map/zoom-map'], function() {
    'use strict';
    return ['$scope', 'locale', '$http', '$location', '$route', '$sce',
        function($scope, locale, $http, $location, $route, $sce) {
            $scope.partner = {};
            $scope.partner.identifier = $route.current.params.uid;

            //=======================================================================
            //
            //=======================================================================

            var queryParameters = {
                'q': 'schema_s:undbPartner  AND identifier_s:' + $scope.partner.identifier, //AND _state_s:public removed for test
                'wt': 'json',
                'start': 0,
                'rows': 1000000,
            };
            $http.get('https://api.cbd.int/api/v2013/index/select', {
                params: queryParameters,
                cache: true
            }).success(function(data) {
                $scope.partner = data.response.docs[0];
                $scope.partner.identifier = $route.current.params.uid;
            });

            //=======================================================================
            //
            //=======================================================================
            function trustSrc() {
							var src ='https://www.google.com/maps/embed/v1/place?key=AIzaSyCyD6f0w00dLyl1iU39Pd9MpVVMOtfEuNI';
                return $sce.trustAsResourceUrl(src+'&&q='+$scope.action.lat_d+','+$scope.action.lng_d);
            }
            $scope.trustSrc = trustSrc;

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

        }
    ];
});