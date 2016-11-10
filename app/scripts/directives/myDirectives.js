

/*======================================
=           Product Card               =
=======================================*/

app.directive("card", function(){

  return{

      restrict: "AE",
      transclude: true,
      scope: true,
      replace: true,
      templateUrl: "./ng-templates/cardTemplate.html",
      link: function(scope,elem,attr){
          elem.addClass('ng-card');

          if (!window.location.origin) {
            window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
          }

          scope.regUrl   = window.location.origin + '/apps/registration?CL=' + scope.each;
          scope.loginUrl = window.location.origin + '/apps/login?CL=' + scope.each;

          scope.showOptions = false;
          
          scope.openOptions = function() {
            
            scope.showOptions = true;
          };

          scope.closeOptions = function() {
            scope.showOptions = false;
          };
      }

  };

});
/*======================================
=         File Upload Directive        =
=======================================*/

app.directive('fileModel', ['$parse', function ($parse) {

    return {
        restrict: 'AE',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

/*======================================
=         Click to Edit Directive      =
=======================================*/

app.directive('clickToEdit', function () {

    return {
        restrict: 'AE',
        scope: {
          value: "="
        },
        template: '<input ng-show="isEditing" type="text"  ng-model="value" ng-click="toggle" />' +
                  '<span ng-show="!isEditing" ng-click="toggle()" >{{value || "UNDEFINED"}}</span>' + 
                  '<span class="btn btn-primary" ng-show="isEditing" ng-click="toggle()">Finish</span>',

        link: function(scope, element, attrs) {

          element.addClass('click-to-edit');

          var inputElement = angular.element(element.children()[0]);

          scope.isEditing = false;

          scope.toggle = function(){
            scope.isEditing= !scope.isEditing;
          };

        }
    };
});


/*======================================
=        Start/Stop Spinner            =
=======================================*/

app.directive('startStopSpinner', function () {

    return {
        restrict: 'AE',
        scope: {
          startCondition: "=",
          stopCondition: "="
        },
        template: "<i class='fa fa-spinner' ng-class='{\"fa-spin\":startCondition}' ng-hide='stopCondition'></i>" + 
                  "<span ng-show='stopCondition'>Your file was uploaded!</span>",

        link: function(scope, element, attrs) {

            element.addClass("start-stop-spinner");
        
        }
    };
});

/*======================================
=        Generic Spinner            =
=======================================*/

app.directive('genericSpinner', function () {

    return {
        restrict: 'AE',
        scope: {
          startCondition: "=",
          stopCondition: "="
        },
        template: "<i class='fa fa-spinner' ng-class='{\"fa-spin\":startCondition}' ng-hide='stopCondition'></i>" ,

        link: function(scope, element, attrs) {

            element.addClass("generic-spinner");
        
        }
    };
});

/*======================================
=        select all text in div        =
=======================================*/

app.directive('selectOnClick', function () {
    return {
      
        restrict: 'A',
        link: function (scope, element, attrs) {

          var id = attrs.id;
          element.on("click", function(e){

            if (document.selection) {
                var range = document.body.createTextRange();
                range.moveToElementText(document.getElementById(id));
                range.select();
            } else if (window.getSelection) {
                var range = document.createRange();
                range.selectNode(document.getElementById(id));
                window.getSelection().addRange(range);
            }

          });
        }

    };
});








