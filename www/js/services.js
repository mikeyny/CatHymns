angular.module('starter.services', [])

.factory('songAPIservice',['$http', function($http){
    var songAPI ={};
    var songs ={};
    var loaded = false;
    $http.get("json/hymns.json").success(function(data){
          songs.shona = data ;}) ;
    $http.get("json/ndebelehymns.json").success(function(data){
              songs.ndebele = data ;}) ;
    songAPI.getSongs = function(lang){
      return (lang =="Shona") ? songs.shona:songs.ndebele;
    };
    songAPI.getReading = function(){
      return $http.get("json/reading.json");
    };
    songAPI.getSearchableSongs = function(lang){
      return (lang =="Shona") ? $http.get("json/searchable.json"):$http.get("json/ndebelesearchable.json");
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
          return storage.favourites.filter((item)=>(item.aurthor==song.aurthor && item.title==song.title)).length>0;
        };
        favAPI.remove = function (song) {
          storage.favourites.splice(storage.favourites.indexOf(storage.favourites.filter((item)=>(item.aurthor==song.aurthor && item.title==song.title))[0]), 1);
        };
        return favAPI ;


  }])
  .factory ('LanguageService',['$localStorage', function ($localStorage) {
    var storage = $localStorage.$default({
        language: ["Shona"]  });
        var langAPI={};
        langAPI.getlang = function () {
          return storage.language[0];
        };
        langAPI.setlang = function (lang) {
          storage.language[0]= lang ;
        };

        return langAPI ;


  }])

.factory('httpInterceptor', function ($q, $rootScope) {
          var loadingCount = 0;

          return {
              request: function (config) {
                  if(++loadingCount === 1) $rootScope.$broadcast('loading:progress');
                  return config || $q.when(config);
              },

              response: function (response) {
                  if(--loadingCount === 0) $rootScope.$broadcast('loading:finish');
                  return response || $q.when(response);
              },

              responseError: function (response) {
                  if(--loadingCount === 0) $rootScope.$broadcast('loading:finish');
                  return $q.reject(response);
              }
          };
      })

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
