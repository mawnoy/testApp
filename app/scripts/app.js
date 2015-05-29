// Ionic Starter App
'use strict';
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('testApp', ['ionic'])

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
          date: projectTitle.date,
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
      templateUrl: 'menu.html',
      // templateUrl: 'main.html'
      // views: {
      // //   'navvv': {
      // //     templateUrl: 'menu.html'
      // //   }
      // 'menuContent': {
      //     templateUrl: 'main.html',
      //     controller: 'ClassRoomCtrl'
      //   }
    })

    .state('app.main', {
      url: '/main',
      views: {
        // 'navvv': {
        //   templateUrl: 'menu.html'
        // },
        'menuContent': {
          templateUrl: 'main.html',
          controller: 'ClassRoomCtrl'
        }
      }
    })

    .state('app.schedule', {
      url: '/schedule',
      views: {
        'menuContent': {
          templateUrl: 'schedule.html'
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

    .state('app.tabs', {
      url:'/tabs{id:[0-9]{1,8}}',
      views: {
        'menuContent': {
          templateUrl: 'tabs.html',
          controller: 'TabCtrl'
        }
      }
    })

    .state('app.tabs.student', {
      url:'/student',
      views: {
        'info-tab': {
          templateUrl: 'studentList.html'
        }
      }
    })

    .state('app.tabs.attendance', {
      url:'/attendance',
      views: {
        'attendance-tab': {
          templateUrl: 'attendance.html'
        }
      }
    })

    .state('app.tabs.score', {
      url:'/score',
      views: {
        'score-tab': {
          templateUrl: 'score.html'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/main');

  // make back-button title false.
  $ionicConfigProvider.backButton.text('').previousTitleText(false);
})

.controller('ClassRoomCtrl', function($scope, $ionicModal, $ionicSideMenuDelegate, Projects) {

  // Create new Class Object from factory.
  var createProject = function(projectTitle) {
    var newProject = Projects.newProject(projectTitle);
    $scope.classLists.push(newProject);
    Projects.save($scope.classLists);
    $scope.selectProject(newProject, $scope.classLists.length - 1);
  };

  // Load all Class from localstorage.
  $scope.classLists = Projects.all();
  $scope.activeProject = $scope.classLists[Projects.getLastActiveIndex()];

  // Get information of class from Model.
  $scope.createClass = function(classRoom) {
    
    var classId = $scope.classLists.length; 

    var classObj = {
      idNum: classId,
      sec: classRoom.sec,
      sub: classRoom.subject,
      date: classRoom.date,
      img: '/images/subject-icon.png' 
    };

    createProject(classObj);

    $scope.classModal.hide();
    
    classRoom.sec = '';
    classRoom.subject = '';
    classRoom.date = '';

  };

  $scope.newClass = function() {
    $scope.classModal.show();
  };

  $scope.closeNewClass = function() {
    $scope.classModal.hide();
  };

  // Called to select the given project
  $scope.selectProject = function(project, index) {
    $scope.activeProject = project;
    Projects.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };


  $ionicModal.fromTemplateUrl('addClass-modal.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.classModal = modal;
  });


  // $scope.title = $scope.classLists[0].title + ' - Info';

  // $scope.onTabSelected = function(title) {
  //   $scope.title = $scope.classLists[0].title + ' - ' + title;
  // };

})

.controller('TabCtrl', function($scope, Projects, $stateParams) {
  
  $scope.classLists = Projects.all();

  $scope.title = $scope.classLists[$stateParams.id].title + ' - Info';

  $scope.onTabSelected = function(title) {
    $scope.title = $scope.classLists[$stateParams.id].title + ' - ' + title;
  };

});