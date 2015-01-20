/*!
 * TNotify, ios7+ style alert confirm and prompt service for angular
 * Author: Treri
 * License: MIT
 * Version: 1.0.1
 */
angular.module('TNotify', [])
  .directive('tNotify', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: true,
      template: '<div class="tnotify-overlay">' +
                  '<div class="tnotify">' +
                    '<div class="tnotify-inner" ng-class="{remind: type === \'remind\'}">' +
                      '<div class="tnotify-title" ng-if="title">{{ title }}</div>' +
                      '<div class="tnotify-text" ng-if="text">{{ text }}</div>' +
                      '<input type="{{ inputType }}" placeholder="{{ inputPlaceHolder }}" class="tnotify-text-input" ng-if="type === \'prompt\'" ng-model="form.input">' +
                    '</div>' +
                    '<div class="tnotify-buttons" ng-if="type !== \'remind\'">' +
                      '<span class="tnotify-button" ng-if="type !== \'alert\'" ng-click="onCancel()">{{ cancelText }}</span>' +
                      '<span class="tnotify-button tnotify-button-bold" ng-click="onOk(input)">{{ okText }}</span>' +
                    '</div>' +
                  '</div>' +
                '</div>'
    };
  })
  .factory('transition', ['$window', function($window){
    var transElement = $window.document.createElement("div");
    var transitionEndEventNames = {
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition': 'transitionend',
      'OTransition': 'oTransitionEnd',
      'transition': 'transitionend'
    };
    var animationEndEventNames = {
      'WebkitTransition': 'webkitAnimationEnd',
      'MozTransition': 'animationend',
      'OTransition': 'oAnimationEnd',
      'transition': 'animationend'
    };
    var findEndEventName = function(endEventNames) {
      for (var name in endEventNames){
        if (transElement.style[name] !== undefined) {
          return endEventNames[name];
        }
      }
    };
    return {
      transitionEndEventName: findEndEventName(transitionEndEventNames),
      animationEndEventName: findEndEventName(animationEndEventNames)
    };
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
      '$timeout',
      'transition',
      function($rootScope, $compile, $animate, $q, $document, $timeout, transition){

        function show(opt){
          var deferred, $scope, $element;

          var inClass = 'tnotify-in',
            outClass = 'tnotify-out',
            animateClass = 'tnotify-animate',
            tnotifyEnd = 'tnotifyEnd';

          deferred = $q.defer();
          transition.transitionEndEventName = transition.transitionEndEventName || tnotifyEnd;

          $scope = $rootScope.$new(true);
          angular.extend($scope, base, opt);

          $element = $compile('<t-notify></t-notify>')($scope);

          $scope.onCancel = function(){
            if($scope.type === 'confirm'){
              deferred.resolve(false);
            }else if($scope.type === 'prompt'){
              deferred.resolve(null);
              $scope.form.input = '';
            }
            $scope.$destroy();
          };

          $scope.onOk = function(){
            if($scope.type === 'prompt'){
              deferred.resolve($scope.form.input || '');
              $scope.form.input = '';
            }else{
              deferred.resolve(true);
            }
            $scope.$destroy();
          };

          $animate.enter(
            $element,
            angular.element($document[0].body),
            angular.element($document[0].body.lastChild)
          ).then(function(){

            $scope.$on('$destroy', function(){
              $element.one(transition.transitionEndEventName, function(){
                $element.remove();
              });
              $element.addClass(outClass);
              if(transition.transitionEndEventName === tnotifyEnd){
                // 手动触发
                $element.triggerHandler(tnotifyEnd);
              }
            });
            $element.addClass(animateClass).addClass(inClass);

            if($scope.type === 'remind'){
              if(transition.transitionEndEventName === tnotifyEnd){
                // 650 = .4s + 250ms
                $timeout($scope.onOk, 650);
              }else{
                $element.one(transition.transitionEndEventName, function(){
                  $timeout($scope.onOk, 250);
                });
              }
            }
          });

          return deferred.promise;
        }

        function objectify(opt){
          if(angular.isString(opt)){
            return {
              text: opt
            };
          }else if(angular.isObject(opt)){
            return opt;
          }else{
            throw new Error('expect a string or a object');
            return {};
          }
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
        function remind(opt){
          opt = objectify(opt);
          opt.type = 'remind';
          return show(opt);
        }
        return {
          alert: alert,
          confirm: confirm,
          prompt: prompt,
          remind: remind
        };
      }
    ];
  });
