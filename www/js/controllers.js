angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope,$rootScope , songAPIservice , $timeout, FavouritesService ,LanguageService) {
  $scope.getfavs = function(){
    $scope.favourites = FavouritesService.getAll();
  };
  $scope.loading = true; // enabling the spinner
  $rootScope.$on("UpdateSongs", function(){
        $scope.getSongs();
        console.log("updated")
       });
  $scope.getSongs = function() {
        $scope.getfavs();
        $scope.songs = songAPIservice.getSongs(LanguageService.getlang()) ;
       };
  $rootScope.$on('loading:finish', function (){
    $scope.getSongs();
    $timeout(function(){
               $scope.loading = false;
             }, 5000); // turn off the spinner after all data has been rendered
  });


  $scope.toggleSelect = function(letter) {
    $scope.shownLetter = ($scope.isLetterShown(letter)) ? null:letter ; //selecting different letters on the accordion
    };
  $scope.isLetterShown = function(letter) {
    return $scope.shownLetter === letter;
  };
  $scope.isSongLiked = function(song){
   return FavouritesService.find(song);
  };
  $scope.addToFavs = function (song) {
   $scope.isSongLiked(song) ?   FavouritesService.remove(song): FavouritesService.add(song); //adding song to favourites
   $scope.getfavs();
  };
})

// most stuff that shows up when u click the option button
.controller('aboutCtrl', function($scope, $rootScope ,$ionicPopover ,$ionicPopup, $timeout ,ClosePopupService , LanguageService) {
  $ionicPopover.fromTemplateUrl('templates/options-popover.html', {
      scope: $scope
    }).then(function(popover) {
      $scope.popover = popover;
    });
    $scope.showOptions = function($event){
      console.log("clicked");
      $scope.popover.show($event);
    };
    $scope.$on('$destroy', function() {
      $scope.popover.remove();
  });
  $scope.showAbout = function() {
      $scope.popover.hide();
      var aboutPopup = $ionicPopup.alert({
        title: 'About',
        template: 'CatHymns v0.01',
        cssClass: 'mypopup'
      });

      ClosePopupService.register(aboutPopup);

    } ;
  $scope.showCredits = function() {
      $scope.popover.hide();
      var alertPopup = $ionicPopup.alert({
        title: 'Credits',
        templateUrl: 'templates/credits-popup.html',
        cssClass: 'mypopup'
      });
        ClosePopupService.register(alertPopup);
      };
  $scope.selectLang = function() {
      $scope.popover.hide();
      var langPopup = $ionicPopup.alert({
        title: 'Select Language',
        templateUrl: 'templates/lang-popup.html'
      }).then(function(){

          var e = document.getElementById("langselect");
          var lang = e.options[e.selectedIndex].value;
          console.log(lang);
          console.log(LanguageService.getlang()!=lang);
          if (LanguageService.getlang()!=lang){
              LanguageService.setlang(lang);
              $rootScope.$emit("UpdateSongs", {});};


      })
      ClosePopupService.register(langPopup);
      };

})

.controller('SongCtrl', function($scope,$rootScope , $stateParams, songAPIservice ,LanguageService) {
  // responsible for loading songs
  $rootScope.$on("UpdateSongs", function(){
       $scope.changeSongs();

      });
  $scope.changeSongs = function(){

        var data =   songAPIservice.getSongs(LanguageService.getlang()) ;
        $scope.title = $stateParams.title ;
        console.log($scope.title);
        var songs = data[$scope.title[0].toUpperCase()] ;
        $scope.song = songs.filter(item=>item.title==$scope.title)[0] ;
          console.log($scope.song);
  }
  $scope.changeSongs();

})
.controller('VersesCtrl', function($scope,$stateParams, songAPIservice) {
  // responsible for liturgical reading
  songAPIservice.getReading().success(function(data){
      $scope.readings = data ;
      var date= $stateParams.id;
      $scope.month = date.substring(0 ,date.length-1);

      $scope.week = date.substr(-1) ;
      $scope.weekreading = data[$scope.month][$scope.week-1];
    });
  $scope.monthIndex =  function(month){
      return Object.keys($scope.readings).indexOf(month)+1 ;
  }
  $scope.weekIndex = function(month ,week){
    return $scope.readings[month].indexOf(week)+1;
  }
})
.controller('ReadingCtrl', function($scope,$stateParams, songAPIservice) {
  songAPIservice.getReading().success(function(data){
      $scope.readings = data ;
    });
  $scope.monthIndex =  function(month){
      return Object.keys($scope.readings).indexOf(month)+1 ;
  }
  $scope.weekIndex = function(month ,week){
    return $scope.readings[month].indexOf(week)+1;
  }
})
.controller('searchCtrl', function($scope, songAPIservice ,FavouritesService , LanguageService , $rootScope) {
  // responsible for searching through the songs
    $scope.loading = true;
    $scope.getSearchableSongs = function(){
      songAPIservice.getSearchableSongs(LanguageService.getlang()).success(function(data){
          $scope.hymns = data ;
            $scope.loading = false;

        });
    }
    $scope.getSearchableSongs();
    $rootScope.$on("UpdateSongs", function(){
          $scope.getSearchableSongs();
          console.log("updated")
         });
  $scope.searchText = "";


});
