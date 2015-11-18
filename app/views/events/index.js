define(['app', 'angular', 'authentication'], function() { 'use strict';

	return ['$scope', '$rootScope', '$route', '$browser', '$location', '$window', 'authentication', function ($scope, $rootScope, $route, $browser, $location, $window, authentication) {

		$scope.nextMeetings = [
			{
				name: 'Sustainable Ocean Initiative (SOI) Capacity-building Workshop for East Africa',
				days: '18-22 ', month: 'January', year: '2016',
				city: 'Nosy Be', country: 'Madagascar',
				url: 'https://www.cbd.int/doc/?meeting=SOIWS-2015-04'
			}
		];

		$scope.previousMeetings = [
			{
				name: 'Sustainable Ocean Initiative (SOI) National Capacity Development Workshop for Namibia',
				days: '13-16', month: 'October', year: '2015',
				city: 'Swakopmund', country: 'Namibia',
				url: 'https://www.cbd.int/doc/?meeting=SOIWS-2015-03'
			}, {
				name: 'Sustainable Ocean Initiative (SOI) National Capacity Development Workshop for Samoa',
				days: '28-30', month: ' September', year: '2015',
				city: 'Apia', country: 'Samoa',
				url: 'https://www.cbd.int/doc/?meeting=SOIWS-2015-05'
			}, {
				name: 'Sustainable Ocean Initiative (SOI) Training of Trainers Workshop',
				days: '11-15', month: ' September', year: '2015',
				city: 'Yeosu', country: 'Republic of Korea',
				url: 'https://www.cbd.int/doc/?meeting=SOIWS-2015-02'
			}, {
				name: 'Sustainable Ocean Initiative (SOI) Capacity-building Workshop for South America',
				days: '23-27', month: 'February', year: '2015',
				city: 'Lima', country: 'Peru',
				url: 'https://www.cbd.int/doc/?meeting=MCBWS-2015-01'
			}, {
				name: 'Sustainable Ocean Initiative (SOI) High-Level Meeting',
				days: '16', month: 'October', year: '2014',
				city: 'Pyeongchang', country: 'Republic of Korea',
				url: 'https://www.cbd.int/doc/?meeting=SOIOM-2014-02'
			}, {
				name: 'Sustainable Ocean Initiative (SOI) Global Partnership Meeting',
				days: '3 - 4', month: 'October', year: '2014',
				city: 'Seoul', country: 'Republic of Korea',
				url: 'https://www.cbd.int/doc/?meeting=SOIOM-2014-01'
			}, {
				name: 'Sustainable Ocean Initiative (SOI) Capacity-building Workshop for East, South and South-East Asia',
				days: '9 - 13', month: 'December', year: '2013',
				city: 'Guangzhou', country: 'China',
				url: 'https://www.cbd.int/doc/?meeting=CBWSOI-SEASI-01'
			}, {
				name: 'Sustainable Ocean Initiative (SOI) Capacity-Building Workshop for West Africa',
				days: '4 - 8', month: 'February', year: '2013',
				city: 'Dakar', country: 'Senegal',
				url: 'https://www.cbd.int/doc/?meeting=CBWSOI-WAFR-01'
			}
		];
    }];
});
