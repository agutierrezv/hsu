/* --- Made by justgoscha and licensed under MIT license --- */
// base from: https://github.com/JustGoscha/allmighty-autocomplete
/* Adaptation to <key,value> pairs by Pedro J. Molina 2015.02.26 */

var app = angular.module('autocomplete', []);

app.directive('autocomplete', function() {
  var index = -1;

  return {
    restrict: 'E',
    scope: {
      searchKey: '=ngModel',
      searchLabel: '=selectedLabel',
      dataProvider: '=dataprovider',
      onSelect: '=onSelect',
      autocompleteRequired: '=',
      readonly: '=ngReadonly'
    },
    controller: ['$scope', function($scope){
      // the index of the suggestions that's currently selected
      $scope.selectedIndex = -1;

      $scope.flagFirstKeyBind = true; 

      $scope.initLock = true;

      $scope.suggestions = []; //internalized

      // set new index
      $scope.setIndex = function(i){
        $scope.selectedIndex = parseInt(i);
      };

      this.setIndex = function(i){
        $scope.setIndex(i);
        $scope.$apply();
      };

      $scope.getIndex = function(i){
        return $scope.selectedIndex;
      };

      // watches if the parameter filter should be changed
      var watching = true;

      // autocompleting drop down on/off
      $scope.completing = false;

      // starts autocompleting on typing in something
      $scope.$watch('searchParam', function(newValue, oldValue){

        if (oldValue === newValue || (!oldValue && $scope.initLock)) {
          return;
        }

        if(watching && typeof $scope.searchParam !== 'undefined' && $scope.searchParam !== null) {
            $scope.completing = true;
            $scope.searchFilter = $scope.searchParam;
            $scope.selectedIndex = -1;
        }

        // function thats passed to on-type attribute gets executed
        if($scope.dataProvider) {
            $scope.dataProvider($scope.searchParam, null, setDataCallBack);
        }
      });

      function setDataCallBack(data) {
          $scope.suggestions = localeSortByLabel(data);
      }
      function localeSortByLabel(array) {
          if (array) {
            return array.sort(localeCompareByLabel);
          }
          return [];
      }
      function localeCompareByLabel(a, b) {
          return a.label.localeCompare(b.label, 'es');
      }

      //somthing else missing for initial setup of searchKey
      $scope.$watch('searchKey', function(newValue, oldValue) {
            if ($scope.dataProvider && 
                !$scope.flagUserFiltering &&
                ($scope.suggestions == null || $scope.suggestions.length===0) 
                ) {
                if ($scope.searchKey != null && $scope.searchKey!=="") {
                    if (!$scope.flagFirstKeyBind) {
                        return;
                    }
                    $scope.flagFirstKeyBind = false;
                    $scope.flagGettingValueByKey = true;
                    $scope.dataProvider(null, $scope.searchKey, setDataCallBack);
                }
            }
      });

      $scope.$watch('suggestions', function(newValue, oldValue) {
            if (!$scope.flagGettingValueByKey) {
                return;
            }
            $scope.flagGettingValueByKey = false;                
            if ($scope.suggestions != null && $scope.suggestions.length == 1) {
                $scope.select($scope.suggestions[0]);
            }
      });

      // for hovering over suggestions
      this.preSelect = function(suggestion){

        watching = false;

        // this line determines if it is shown
        // in the input field before it's selected:
        //$scope.searchParam = suggestion;

        $scope.$apply();
        watching = true;

      };

      $scope.preSelect = this.preSelect;

      this.preSelectOff = function(){
        watching = true;
      };

      $scope.preSelectOff = this.preSelectOff;

      // selecting a suggestion with RIGHT ARROW or ENTER
      $scope.select = function(suggestion){
        if(suggestion) {
          $scope.searchParam = suggestion.label;
          $scope.flagUserFiltering = true;
          $scope.searchKey = suggestion.key;
          $scope.flagUserFiltering = false;
          $scope.searchFilter = suggestion.label;
          if($scope.onSelect) {
              $scope.onSelect(suggestion);
          }
        }
        watching = false;
        $scope.completing = false;
        setTimeout(function(){ watching = true; }, 1000);
        $scope.setIndex(-1);
      };


    }],
    link: function(scope, element, attrs){

      setTimeout(function() {
        scope.initLock = false;
        scope.$apply();
      }, 250);

      var attr = '';

      // Default atts
      scope.attrs = {
        "placeholder": "start typing...",
        "class": "",
        "id": "",
        "inputclass": "",
        "inputid": ""
      };

      for (var a in attrs) {
        attr = a.replace('attr', '').toLowerCase();
        // add attribute overriding defaults
        // and preventing duplication
        if (a.indexOf('attr') === 0) {
          scope.attrs[attr] = attrs[a];
        }
      }

      if (attrs.clickActivation) {
        element[0].onclick = function(e){
          if(!scope.searchParam){
            setTimeout(function() {
              scope.completing = true;
              scope.$apply();
            }, 200);
          }
        };
      }

      var key = {left: 37, up: 38, right: 39, down: 40 , enter: 13, esc: 27, tab: 9};

      document.addEventListener("keydown", function(e){
        var keycode = e.keyCode || e.which;

        switch (keycode){
          case key.esc:
            // disable suggestions on escape
            scope.select();
            scope.setIndex(-1);
            scope.$apply();
            e.preventDefault();
        }
      }, true);

      document.addEventListener("blur", function(e){
        // disable suggestions on blur
        // we do a timeout to prevent hiding it before a click event is registered
        setTimeout(function() {
          scope.select();
          scope.setIndex(-1);
          scope.$apply();
        }, 150);
      }, true);

      element[0].addEventListener("keydown",function (e){
        var keycode = e.keyCode || e.which;

        var l = angular.element(this).find('li').length;

        // this allows submitting forms by pressing Enter in the autocompleted field
        if (!scope.completing || l === 0) { 
            return; 
        }

        // implementation of the up and down movement in the list of suggestions
        switch (keycode){
          case key.up:

            index = scope.getIndex()-1;
            if(index<-1){
              index = l-1;
            } else if (index >= l ){
              index = -1;
              scope.setIndex(index);
              scope.preSelectOff();
              break;
            }
            scope.setIndex(index);

            if(index!==-1) {
                var elem2 = angular.element(angular.element(this).find('li')[index]);
                var suggestion2 = {
                    key : elem2.attr('val'),
                    label : elem2.text()
                };
                scope.preSelect(suggestion2);
            }

            scope.$apply();

            break;
          case key.down:
            index = scope.getIndex()+1;
            if(index<-1){
              index = l-1;
            } else if (index >= l ){
              index = -1;
              scope.setIndex(index);
              scope.preSelectOff();
              scope.$apply();
              break;
            }
            scope.setIndex(index);

            if(index!==-1) {
              var elem1 = angular.element(angular.element(this).find('li')[index]);
              var suggestion1 = {
                key : elem1.attr('val'),
                label : elem1.text()
              };
              scope.preSelect(suggestion1);
            }

            break;
          case key.left:
            break;
          case key.right:
          case key.enter:
          case key.tab:

            index = scope.getIndex();
            // scope.preSelectOff();
            if(index !== -1) {
              var elem = angular.element(angular.element(this).find('li')[index]);
              var suggestion0 = {
                key : elem.attr('val'),
                label : elem.text()
              };
              scope.select(suggestion0);
              if(keycode == key.enter) {
                e.preventDefault();
              }
            } else {
              if(keycode == key.enter ||
                 keycode == key.tab) {
                  //scope.select();
                  if (scope.suggestions != null && scope.suggestions.length > 0) {
                      scope.select(scope.suggestions[0]);
                  }

              }
            }
            scope.setIndex(-1);
            scope.$apply();

            break;
          case key.esc:
            // disable suggestions on escape
            scope.select();
            scope.setIndex(-1);
            scope.$apply();
            e.preventDefault();
            break;
          default:
            return;
        }

      });
    },
    /*jshint multistr: true */
    template: '\
        <div class="autocomplete {{ attrs.class }}" id="{{ attrs.id }}">\
          <input\
            type="text"\
            ng-model="searchParam"\
            ng-readonly="readonly"\
            placeholder="{{ attrs.placeholder }}"\
            class="{{ attrs.inputclass }}"\
            id="{{ attrs.inputid }}"\
            ng-required="{{ autocompleteRequired }}" />\
          <ul ng-show="completing && (suggestions | filter:searchFilter).length > 0">\
            <li\
              suggestion\
              ng-repeat="suggestion in suggestions | filter:searchFilter | orderBy:\'toString()\' track by $index"\
              index="{{ $index }}"\
              val="{{ suggestion.key }}"\
              ng-class="{ active: ($index === selectedIndex) }"\
              ng-click="select(suggestion)"\
              ng-bind-html="suggestion.label | highlight:searchParam"></li>\
          </ul>\
        </div>'
  };
});

app.filter('highlight', ['$sce', function ($sce) {
  return function (input, searchParam) {
    var output = input; //input.label;
    if (typeof input === 'function') {
       return '';
    }
    if (searchParam) {
      /*if (searchParam.label) {
         searchParam = searchParam.label;
      }*/
      var words = '(' +
            searchParam.split(/\ /).join(' |') + '|' +
            searchParam.split(/\ /).join('|') +
          ')',
          exp = new RegExp(words, 'gi');
      if (words.length) {
          //input = input.replace(exp, "<span class=\"highlight\">$1</span>");
          output = input.replace(exp, "<span class=\"highlight\">$1</span>");
      }
    }
    return $sce.trustAsHtml(output);
  };
}]);

app.directive('suggestion', function(){
  return {
    restrict: 'A',
    require: '^autocomplete', // ^look for controller on parents element
    link: function(scope, element, attrs, autoCtrl){
      element.bind('mouseenter', function() {
        autoCtrl.preSelect(attrs.val);
        autoCtrl.setIndex(attrs.index);
      });

      element.bind('mouseleave', function() {
        autoCtrl.preSelectOff();
      });
    }
  };
});