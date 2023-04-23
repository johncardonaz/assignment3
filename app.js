(function () {
  'use strict';

  angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController);
    .service('MenuSearchService',MenuSearchService);
    .constant('ApiBasePath',"https://coursera-jhu-default-rtdb.firebaseio.com");
    .directive('foundItems', foundItems);

    foundItems function() {
      var directive = {
        templateUrl: 'foundItems.html',
        scope: {
          items: '<',
          onRemove: '&'
        },
        controller: FoundItemsDirectiveController,
        controllerAs: 'foundItems',
        bindToController: true
      };

      return directive;
    });

    function FoundItemsDirectiveController() {
      var foundItems = this;

      foundItems.remove = function(index) {
        foundItems.onRemove({index: index});
      };
    }


    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
      var ctrl = this;
      ctrl.searchTerm = "";
      ctrl.found = [];

      ctrl.getMatchedMenuItems = function () {
        var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);
        promise.then(function (response) {
          ctrl.found = response;
        })
        .catch(function (error) {
          console.log(error);
        });
      };
    }

    MenuSearchService.$inject = ['$http','ApiBasePath'];
    function MenuSearchService($http,ApiBasePath) {
      var service = this;

      service.getMatchedMenuItems = function (searchTerm) {
        return $http({
          method: 'GET',
          url: (ApiBasePath +"/menu_items.json')
        })
        .then(function (result) {
          var foundItems = [];

          if (searchTerm !== "") {
            for (var i = 0; i < result.data.menu_items.length; i++) {
              var description = result.data.menu_items[i].description;
              if (description.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
                foundItems.push(result.data.menu_items[i]);
              }
            }
          }
          console.log(foundItems);
          return foundItems;
        })
        .catch(function (error) {
          console.log(error);
        });
      };
    }


})();
