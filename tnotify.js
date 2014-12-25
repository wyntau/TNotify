angular.module('TNotify', [])
  .directive('tNotify', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      template: '<div class="tnotify-overlay">' +
                  '<div class="tnotify">' +
                    '<div class="tnotify-inner">' +
                      '<div class="tnotify-title" ng-if="title">{{ title }}</div>' +
                      '<div class="tnotify-text" ng-if="text">{{ text }}</div>' +
                      '<input type="{{ inputType }}" placeholder="{{ inputPlaceHolder }}" class="tnotify-text-input" ng-if="type === \'prompt\'" ng-model="form.input">' +
                    '</div>' +
                    '<div class="tnotify-buttons">' +
                      '<span class="tnotify-button" ng-if="type !== \'alert\'" ng-click="onCancel()">{{ cancelText }}</span>' +
                      '<span class="tnotify-button tnotify-button-bold" ng-click="onOk(input)">{{ okText }}</span>' +
                    '</div>' +
                  '</div>' +
                '</div>'
    };
  })
  .factory('TRANSITION_END_NAME', ['$window', function($window){
    var VENDORS = ["Moz", 'webkit', 'ms', 'O'];
    var TRANSITION_END_NAMES = {
      "Moz": "transitionend",
      "webkit": "webkitTransitionEnd",
      "ms": "MSTransitionEnd",
      "O": "oTransitionEnd"
    }
    var ANIMATION_END_NAMES = {
      "Moz": "animationend",
      "webkit": "webkitAnimationEnd",
      "ms": "MSAnimationEnd",
      "O": "oAnimationEnd"
    }
    var css3Prefix, TRANSITION_END_NAME, ANIMATION_END_NAME;
    var mTestElement = $window.document.createElement("div");

    for (var i = 0, l = VENDORS.length; i < l; i++) {
      css3Prefix = VENDORS[i];
      if ((css3Prefix + "Transition") in mTestElement.style) {
        break;
      }
      css3Prefix = false;
    }
    if (css3Prefix) {
      TRANSITION_END_NAME = TRANSITION_END_NAMES[css3Prefix];
      ANIMATION_END_NAME = ANIMATION_END_NAMES[css3Prefix];
    }
    return TRANSITION_END_NAME;
  }])
  .provider('TNotify', function(){
    var base = {
      title: null,
      text: null,
      form: {
        input: ''
      },
      inputType: 'text',
      inputPlaceHolder: '',
      cancelText: '取消',
      okText: '确定'
    };
    var dicts = ['title', 'text', 'cancelText', 'okText', 'inputType', 'inputPlaceHolder'];
    this.set = function(key, value){
      var self = this;
      if(angular.isObject(key)){
        for(var name in key){
          self.set(name, key[name]);
        }
      }else{
        if(key && (dicts.indexOf(key) > -1)){
          if(value){
            base[key] = value;
          }
        }
      }
    };

    this.$get = [
      '$rootScope',
      '$compile',
      '$animate',
      '$q',
      '$document',
      'TRANSITION_END_NAME',
      function($rootScope, $compile, $animate, $q, $document, TRANSITION_END_NAME){
        function show(opt){
          var deferred = $q.defer();
          var $scope = $rootScope.$new(true);

          angular.extend($scope, base, opt);

          $scope.onCancel = function(){
            if($scope.type === 'confirm'){
              deferred.resolve(false);
            }else if($scope.type === 'prompt'){
              deferred.resolve(null);
              $scope.form.input = '';
            }
            $scope.$emit('TNotifyClose');
          };

          $scope.onOk = function(){
            if($scope.type === 'confirm'){
              deferred.resolve(true);
            }else if($scope.type === 'prompt'){
              deferred.resolve($scope.form.input || '');
              $scope.form.input = '';
            }
            $scope.$emit('TNotifyClose');
          };

          var $element = $compile('<t-notify></t-notify>')($scope);

          $animate.enter(
            $element[0],
            angular.element($document[0].body),
            angular.element($document[0].body.lastChild)
          ).then(function(){
            $element.addClass('tnotify-in');
            $scope.$on('TNotifyClose', function(){
              $element.on(TRANSITION_END_NAME, function(){
                $element.off(TRANSITION_END_NAME).remove();
                $scope.$destroy();
              });
              $element.addClass('tnotify-out');
            });
          });

          return deferred.promise;
        }

        function objectify(opt){
          var option;
          if(angular.isString(opt)){
            option = {
              text: opt
            };
          }else if(angular.isObject(opt)){
            option = opt;
          }

          if(!angular.isObject(option)){
            throw new Error('expect a string or a object');
            return;
          }
          return option;
        }

        function alert(opt){
          opt = objectify(opt);
          opt.type = 'alert';
          return show(opt);
        }
        function confirm(opt){
          opt = objectify(opt);
          opt.type = 'confirm';
          return show(opt);
        }
        function prompt(opt){
          opt = objectify(opt);
          opt.type = 'prompt';
          return show(opt);
        }
        return {
          alert: alert,
          confirm: confirm,
          prompt: prompt
        };
      }
    ];
  });
