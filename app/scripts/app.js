// Ionic Starter App
'use strict';
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('testApp', ['ionic', 'ionic-timepicker'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.factory('Projects', function() {
  return {
    all: function() {
      var projectString = window.localStorage['projects'];
      if(projectString) {
        return angular.fromJson(projectString);
      }
      return [];
    },
    save: function(projects) {
      window.localStorage['projects'] = angular.toJson(projects);
    },
    newProject: function(projectTitle) {
      // Add a new Class.
      return {
        title: projectTitle.sec,
        detail: {
          id: projectTitle.idNum,
          sub: projectTitle.sub,
          dateTime: projectTitle.date,
        },
        img: projectTitle.img,
        student: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveProject']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveProject'] = index;
    }
  };
})

// .service('ListsService', function($q, Projects) {
//   var lists = Projects.all();

// })

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'menu.html'
    })

    .state('app.classes', {
      url: '/classes',
      views: {
        'menuContent': {
          templateUrl: 'classes.html',
          controller: 'classesCtrl'
        }
      }
    })

    .state('app.schedule', {
      url: '/schedule',
      views: {
        'menuContent': {
          templateUrl: 'schedule.html',
          controller: 'scheduleCtrl'
        }
      }
    })

    .state('app.message', {
      url: '/message',
      views: {
        'menuContent': {
          templateUrl: 'message.html'
        }
      }
    })

    .state('app.setting', {
      url: '/setting',
      views: {
        'menuContent': {
          templateUrl: 'setting.html'
        }
      }
    })

    .state('class', {
      url: '/class:id',
      abstract: true,
      templateUrl: 'class.html'
    })

    .state('class.info', {
      url: '/info',
      views: {
        'info-tab': {
          templateUrl: 'info.html',
          controller: 'tabsCtrl'
        }
      }
    })

    .state('class.attendance', {
      url: '/attendance',
      views: {
        'attendance-tab': {
          templateUrl: 'attendance.html',
          controller: 'tabsCtrl'
        }
      }
    })

    .state('class.score', {
      url: '/score',
      views: {
        'score-tab': {
          templateUrl: 'score.html',
          controller: 'tabsCtrl'
        }
      }
    })

    .state('class.facts', {
      url: '/facts',
      views: {
        'info-tab': {
          templateUrl: 'facts.html'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/classes');

  // make back-button title false.
  $ionicConfigProvider.backButton.text('').previousTitleText(false);
})

.controller('classesCtrl', function($scope, $ionicModal, $ionicSideMenuDelegate, Projects, $ionicPopup) {
  
  // Set list-item can swipe.
  $scope.listCanSwipe = true;

  // Create new Class and save to localstorage.
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.classLists.push(newProject);
    Projects.save($scope.classLists);
    // $scope.selectProject(newProject, $scope.classLists.length - 1);
  };

  // Load all Class from localstorage.
  $scope.classLists = Projects.all();
  // $scope.activeProject = $scope.classLists[Projects.getLastActiveIndex()];

  $ionicModal.fromTemplateUrl('addClass-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.classModal = modal;
  });

  // Get information of class from Modal.
  $scope.createClass = function(classRoom) {
    
    var classId = $scope.classLists.length; 

    var classObj = {
      idNum: classId,
      sec: classRoom.sec,
      sub: classRoom.subject.subTitle,
      date: $scope.dayLists,
      img: '/images/subject-icon.png' 
    };

    createProject(classObj);

    $scope.classModal.hide();
    
    classRoom.sec = '';
    classRoom.subject = '';
    classRoom.date = '';
    $scope.dayLists = [];
  };

  $scope.newClass = function() {
    $scope.classModal.show();
  };

  $scope.closeNewClass = function() {
    $scope.classModal.hide();
  };

  // Called to select the given project
  // $scope.selectProject = function(project, index) {
  //   $scope.activeProject = project;
  //   Projects.setLastActiveIndex(index);
  //   $ionicSideMenuDelegate.toggleLeft(false);
  // };


  $scope.slots = {
    epochTime: 12600, 
    endsTime: 12600,
    format: 12,
    step: 15
  };

  $scope.days = ['Mon', 'Tue', 'Wen', 'Thu', 'Fri', 'Sat', 'Sun'];
  $scope.dayLists = [];
  
  $scope.openTimePicker = function(days) {

    var timePickerPopup = $ionicPopup.show({
      template: '<h3>Start</h3><ionic-timepicker etime="slots.epochTime" format="slots.format" step="slots.step"><button class="button button-block button-positive"><standard-time-meridian etime="slots.epochTime"></standard-time-meridian></button></ionic-timepicker><h3>End</h3><ionic-timepicker etime="slots.endsTime" format="slots.format" step="slots.step"><button class="button button-block button-positive"><standard-time-meridian etime="slots.endsTime"></standard-time-meridian></button></ionic-timepicker>',
      title: 'Set time',
      scope: $scope,
      buttons: [
        {text: 'Cancel'},
        {
          text: '<b>Save</b>',
          type: 'button-positive',
          onTap: function() {

            var subject = {
              day: days,
              startTime: $scope.slots.epochTime,
              endTime: $scope.slots.endsTime
            };

            $scope.dayLists.push(subject);
          }
        }
      ]
    });
  };

})

// .controller('modalCtrl', function($scope, $ionicPopup) {


// })

.controller('tabsCtrl', function($scope, Projects, $stateParams) {
  
  $scope.classLists = Projects.all();
  $scope.pageId = $scope.classLists[$stateParams.id].title + ' - ' +$scope.title;

  $scope.classTitle = $scope.pageId;

})

.controller('scheduleCtrl', function($scope) {
  $scope.slots = {epochTime: 12600, format: 12, step: 15};
});