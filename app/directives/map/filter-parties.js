define(['text!./filter-parties.html', 'app', 'lodash'], function(template, app, _) {
  'use strict';

  app.directive('filterParties', [function() {
    return {
      restrict: 'E',
      template: template,
      replace: true,
      require: '^undbMap',
      scope: {
        title: '@title',
        active: '=active',
        message: '=message'
      },
      link: function($scope, $element, $attr,undbMap) {
          $scope.queries = {
            'parties': {
              'schema_s': ['parties'],
            }
          };

          //=======================================================================
          //
          //=======================================================================
          $scope.loadRecords = function() {
            $scope.message="With 196 Parties, the Convention on Biological Diversity has near universal participation among countries.";
            undbMap.filterActive('parties');

            undbMap.addSubQuery(_.cloneDeep($scope.queries), 'parties');
            undbMap.search();
          }; // loadRecords

        } //link
    }; // return
  }]); //app.directive('sfilterNbsap
}); // define
