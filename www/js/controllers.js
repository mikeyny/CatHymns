angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope,$rootScope , songAPIservice , $timeout, FavouritesService ,LanguageService) {
  $scope.getfavs = function(){
    $scope.favourites = FavouritesService.getAll();
  };
    $scope.lang = "ndebele";
   $scope.loading = true;
   $rootScope.$on("UpdateSongs", function(){
        $scope.getSongs();
        console.log("updated")
       });

       $scope.getSongs = function() {
         songAPIservice.getSongs(LanguageService.getlang()).success(function(data){
                  $scope.getfavs();
                  $scope.songs = data ;
                  $timeout(function(){
                    $scope.loading = false;
                  }, 5000);
           });
       };

       $scope.getSongs();



    $scope.toggleSelect = function(letter) {
   if ($scope.isLetterShown(letter)) {
     $scope.shownLetter = null;
   } else {
     $scope.shownLetter = letter;
   }
 };
  $scope.isLetterShown = function(letter) {
   return $scope.shownLetter === letter;
 };
  $scope.isSongLiked = function(song){
   return FavouritesService.find(song);
 };


  $scope.addToFavs = function (song) {
   $scope.isSongLiked(song) ?   FavouritesService.remove(song): FavouritesService.add(song);
   $scope.getfavs();
 };
})

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
  $rootScope.$on("UpdateSongs", function(){
       $scope.changeSongs();
       console.log("yep")
      });
  $scope.changeSongs = function(){
    songAPIservice.getSongs(LanguageService.getlang()).success(function(data){
        $scope.title = $stateParams.title ;
        console.log($scope.title);
        var songs = data[$scope.title[0].toUpperCase()] ;
        $scope.song = songs.filter(item=>item.title==$scope.title)[0] ;
          console.log($scope.song);

      });
  }
$scope.changeSongs();

})
.controller('VersesCtrl', function($scope,$stateParams, songAPIservice) {
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
.controller('searchCtrl', function($scope, songAPIservice ,FavouritesService ) {



  songAPIservice.getSearchableSongs().success(function(data){
      $scope.hymns = data ;


    });


  $scope.searchText = "";


});
