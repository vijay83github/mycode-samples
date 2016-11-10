
var app = angular.module('angledHorizonApp', [
  'ngResource',
  'ngRoute',
  'ui.bootstrap',
  'ngAnimate',
  'ui.utils'
  // 'pageslide-directive'
]);

/*===============================
=            Routing            =
===============================*/

app.config(function ($routeProvider) {

  $routeProvider

    .when('/productSelection', {
      templateUrl: 'views/productSelection.html',
      controller: 'ProductListController'
    })

    .when('/productSelection/:productId', {
      templateUrl: 'views/configurationWizard.html',
      controller: 'ConfigWizardController'
    })

    .when('/productSelection/:productId/configRegistration', {
      templateUrl: 'views/registrationConfiguration.html',
      controller: 'ConfigWizardController'
    })

    .when('/productSelection/:productId/configLogin', {
      templateUrl: 'views/loginConfiguration.html',
      controller: 'ConfigWizardController'
    })

    .otherwise({
      redirectTo: '/productSelection'
    });

});

/*=======================================================
=            Bootstrap Tooltip Configuration            =
=======================================================*/

app.value('uiJqConfig',{
  tooltip:{
    placement: 'right'
  }
});

/*=======================================================
=            Run                                        =
=======================================================*/

app.run(["$rootScope", function($rootScope){

  console.log("in the running");

  if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    console.log("detecting that your browser does not support window.location.origin. It is now set to: ", window.location.origin)
  }

  $rootScope.$on("$routeChangeSuccess", function(e,current,pre){

      $rootScope.routingFromSelectionPage = false;

      try{

        if (pre !== undefined){
          if (pre.$$route.originalPath === "/productSelection"){
            $rootScope.routingFromSelectionPage = true;
          }
        }
      }
      catch(e){
        console.log("No original path");
      }

  });

}]);

/*===================================================
=          Wizard Service (REST interfacer)         =
====================================================*/

app.service("WizardService", ['$resource', 'RestEndpointUrl', 

  function($resource, RestEndpointUrl){

    //set isArray to false so that service knows to expect object
    //query is used when getting list of products and so is cached 
    //(prevents needless network requests when returning to product selection page)
    var options = {
            'query'  :  { method:'GET', isArray:false, cache: true } ,
            'get'    :  { method:'GET', isArray:false } ,
            'update' :  { method:'PUT'}
          };

    return $resource( RestEndpointUrl + '/config/:productID', {}, options);

}]);

/*=========================================
=            REST endpoint URL            =
=========================================*/
/*
app.value("RestEndpointUrl",   // "http://localhost:8080/apps/admin" 
		window.location.origin + "/apps/admin"
  // "http://knolas.dev.quova.com:8080/apps/admin"
);*/
app.value("RestEndpointUrl",!window.location.origin ? window.location.protocol+"//"+window.location.hostname +":"+window.location.port+"/apps/admin" : window.location.origin+"/apps/admin");
/*
if (!window.location.origin) {
	  window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
	}
	*/
/*=========================================================
=            Data Model Factory (Stores Models)           =
==========================================================*/

app.factory("DataModelsFactory", function(WizardService, $q){

  var productsDataModel     = {};
  var registrationDataModel = {};
  var loginDataModel        = {};

  return{

    getProductsModel: function(productID){

      var deferred = $q.defer();

      WizardService.query({productID:productID}, function(data){

           productsDataModel.productID          = data.category;
           productsDataModel.logoLink           = data.logoHref;
           productsDataModel.logoOnHoverTooltip = data.logoTooltip;
           productsDataModel.includeNeustarLogo = data.includeNeustarLogo === 'true';
           productsDataModel.API_Key            = data.apiKey;
           productsDataModel.API_SharedSecret   = data.secret;
           productsDataModel.logoName           = data.logoSourceUrl;

           productsDataModel.permissions = data.permissions.selections;
           productsDataModel.roles       = data.roles.selections;

           productsDataModel.enableMarketo  = data.enableMarketo;
           
           productsDataModel.productName  = data.productName;
           productsDataModel.productBuyUrl  = data.productBuyUrl;
           productsDataModel.productServiceUrl  = data.productServiceUrl;
           
           deferred.resolve(productsDataModel);

      });
    
      return deferred.promise;
    },

    getRegistrationModel: function(productID){

      var deferred = $q.defer();

      WizardService.query( {productID:productID}, function(data){

          //intro words---------------------------------------------------------------------
          registrationDataModel.tabLabel            = data.registrationTabLabel;
          registrationDataModel.pageTitle           = data.registrationPageTitle;
          registrationDataModel.pageSubtitle        = data.registrationPageSubTitle;
          //intro templates-----------------------------------------------------------------
          registrationDataModel.placeFormOnLeft       = data.introTemplatePlaceOnLeft === 'true';
          registrationDataModel.introTemplateWidth    = data.introTemplateWidth;
          registrationDataModel.introTemplateFilename = data.introTemplateFilename;
          //form templates------------------------------------------------------------------
          registrationDataModel.formTemplateWidth   = data.formTemplatesWidth;
          registrationDataModel.useEmailForUsername = data.registrationUseEmailForUsername === 'true';
          registrationDataModel.formTemplatesFiles  = data.formTemplatesFiles;
          //go to ? after registration------------------------------------------------------
          registrationDataModel.finishGoToUrl        = data.registrationTargetUrl;
          registrationDataModel.sendActivationEmail  = data.registrationSendActivationEmail;

          deferred.resolve(registrationDataModel);

      });

      return deferred.promise;
    },

    getLoginModel: function(productID){

      var deferred = $q.defer();

      WizardService.query( {productID:productID}, function(data){

          loginDataModel.useDefaultTemplate     = "this should toggle upload clickability";
          loginDataModel.showRegistrationLink   = data.loginShowRegistrationLink === 'true';
          loginDataModel.embedLogin             = data.loginEmbeddedLogin === 'true';                         
          loginDataModel.loginButtonDirectsTo   = data.loginTargetUrl;
          loginDataModel.passwordResetDirectsTo = data.passwordResetTargetUrl;
          loginDataModel.loginTemplate          = data.loginLeftPaneTemplate;
          loginDataModel.loginDefaultTemplate   = data.loginDefaultTemplate;
          loginDataModel.supportEmail           = data.supportEmail;

          deferred.resolve(loginDataModel);

      });

      return deferred.promise;
    }

  };

});

/*=========================================================
=                    File Upload Service                  =
==========================================================*/

app.service('FileUpload', ['$http', function ($http) {

    this.uploadFileToUrl = function(file, uploadUrl, paramName, promise){

        var fd = new FormData();
        fd.append(paramName, file);

        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined} //undefined sets multipart up for you
        })
        .success(function(){
            promise.resolve("promise resolved from service");
        })
        .error(function(){
            console.log("file upload failed, but at least you got an error!");
        });

    };
}]);

/*=========================================================
=                    Temp Data Service                    =
==========================================================*/

app.service('TempDataStorage', function(){

  this.tempStorage = {};

  this.clearTempStorage = function(){
    this.tempStorage                      = {};
    this.tempStorage.tempProductData      = {};
    this.tempStorage.tempRegistrationData = {};
    this.tempStorage.tempLoginData        = {};
  };

});











