angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, songAPIservice ,FavouritesService ,$ionicPopover ,$ionicPopup, $timeout ,ClosePopupService) {
  $scope.getfavs = function(){
    $scope.favourites = FavouritesService.getAll();
  };


  songAPIservice.getSongs().success(function(data){
      $scope.getfavs();
      $scope.songs = data ;


    });
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

  $ionicPopover.fromTemplateUrl('templates/options-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });

   $scope.showOptions = function($event){
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


};
    $scope.showCredits = function() {
      $scope.popover.hide();
      var alertPopup = $ionicPopup.alert({
    title: 'Credits',
    templateUrl: 'templates/credits-popup.html',
      cssClass: 'mypopup'
  });
      ClosePopupService.register(alertPopup);


};


})
.filter('firstLetter', function () {
    return function (input, key, letter) {
        input = input || [];
        var out = [];
        input.forEach(function (item) {
            console.log('item: ', item[key][0].toLowerCase());
            console.log('letter: ', letter);
            if (item[key][0].toLowerCase() == letter.toLowerCase()) {
                out.push(item);
            }
        });
        return out;
    }
})



// .controller('SongCtrl', function($scope, $stateParams, Chats) {
//   $scope.chat = Chats.get($stateParams.chatId);
// })
.controller('SongCtrl', function($scope, $stateParams, songAPIservice) {
  songAPIservice.getSongs().success(function(data){
      $scope.title = $stateParams.title ;
      console.log($scope.title);
      var songs = data[$scope.title[0].toUpperCase()] ;
      $scope.song = songs.filter(item=>item.title==$scope.title)[0] ;
        console.log($scope.song);

    });

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
});
// .controller('VersesCtrl', function($scope,$stateParams, songAPIservice) {
//   songAPIservice.getReading().success(function(data){
//       $scope.readings = data ;
//       $scope.month = $stateParams.month ;
//       $scope.week = $stateParams.week ;
//       $scope.weekreading = data[$scope.month][$scope.week-1];
//     });
//   $scope.monthIndex =  function(month){
//
//       return Object.keys($scope.readings).indexOf(month)+1 ;
//   }
//   $scope.weekIndex = function(month ,week){
//     return $scope.readings[month].indexOf(week)+1;
//   }
// })
