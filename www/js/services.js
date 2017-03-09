angular.module('starter.services', [])

.factory('songAPIservice',['$http', function($http){
    var songAPI ={};
    songAPI.getSongs = function(){
      return $http.get("json/hymns.json");
    };
    songAPI.getReading = function(){
      return $http.get("json/reading.json");
    };
    songAPI.getSearchableSongs = function(){
      return $http.get("json/searchable.json");
    };

    return songAPI;
  }])

  .factory ('FavouritesService',['$localStorage', function ($localStorage) {
    var storage = $localStorage.$default({
        favourites: []  });
        var favAPI={};
        favAPI.getAll = function () {
          return storage.favourites;
        };
        favAPI.add = function (song) {

          storage.favourites.push(song);
        };
        favAPI.find = function(song){
          return storage.favourites.filter((item)=>item.aurthor==song.aurthor).length>0;
        };
        favAPI.remove = function (song) {
          storage.favourites.splice(storage.favourites.indexOf(song), 1);
        };
        return favAPI ;


  }])
  .factory('ClosePopupService', function($document, $ionicPopup, $timeout){
  var lastPopup;
  return {
    register: function(popup) {
      $timeout(function(){
        var element = $ionicPopup._popupStack.length>0 ? $ionicPopup._popupStack[0].element : null;
        if(!element || !popup || !popup.close) return;
        element = element && element.children ? angular.element(element.children()[0]) : null;
        lastPopup  = popup;
        var insideClickHandler = function(event){
          event.stopPropagation();
        };
        var outsideHandler = function() {
          popup.close();
        };
        element.on('click', insideClickHandler);
        $document.on('click', outsideHandler);
        popup.then(function(){
          lastPopup = null;
          element.off('click', insideClickHandler);
          $document.off('click', outsideHandler);
        });
      });
    },
    closeActivePopup: function(){
      if(lastPopup) {
        $timeout(lastPopup.close);
        return lastPopup;
      }
    }
  };
});
  // var _getAll = function () {
  //   return $localStorage.favourites
  // };
  // var _add = function (song) {
  //   $localStorage.favourites.push(song);
  // }
  // var _remove = function (song) {
  //   $localStorage.things.splice($localStorage.things.indexOf(song), 1);
  // }
  // return {
  //     getAll: _getAll,
  //     add: _add,
  //     remove: _remove
  //   };
