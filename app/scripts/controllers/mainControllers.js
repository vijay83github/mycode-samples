
app.controller("MasterController", 

    ['$scope', 'RestEndpointUrl', 

  function($scope, RestEndpointUrl){

  /*
    Helper Functions
  */

  $scope.extend = function(){

    for(var i=1; i<arguments.length; i++){
        for(var key in arguments[i]){
            if(arguments[i].hasOwnProperty(key)){
                arguments[0][key] = arguments[i][key];
              }
        }
    }
    return arguments[0];
    
  };

  /*
    Conditional Animation Class setters
  */

  $scope.goRight = function(){
    $scope.fading     = false;
    $scope.goingRight = true;
    $scope.goingLeft  = false;
  };

  $scope.goLeft = function(){
    $scope.fading     = false;
    $scope.goingRight = false;
    $scope.goingLeft  = true;
  };

  $scope.fadeIn = function(){
    $scope.fading     = true;
    $scope.goingRight = false;
    $scope.goingLeft  = false;
  };

  $scope.apiUploadUrl = RestEndpointUrl + '/upload/';

}]);

/*==========================================
=   Main Controller (List of Products)  =
===========================================*/


app.controller("ProductListController",

    ["$scope", "WizardService", "TempDataStorage", 

  function($scope, WizardService, TempDataStorage){

    $scope.productList = [];
    var productList = $scope.productList;
    $scope.loadingProducts = true;

    //pass empty string to service to get list of all products
    //using 'query' means this is cached
    WizardService.query({productID:""},function(data){

      console.log("querying data");

      for (var key in data.configs) {
        var prodData = data.configs[key];
        productList.push(prodData.category);
      }

      $scope.loadingProducts = false;

    });

    TempDataStorage.clearTempStorage();


}]);

/*===========================================================
=                Config Wizard Controller                   =
               (Parent Controller of all below)             =
===========================================================*/

app.controller("ConfigWizardController",

    ["$scope", "$rootScope", "WizardService", "$route" , "$location", 
     "DataModelsFactory", "TempDataStorage", "$q", "$cacheFactory", "RestEndpointUrl",
  
  function($scope, $rootScope, WizardService, $routeParams, $location, DataModelsFactory, TempDataStorage, $q, $cacheFactory, RestEndpointUrl){

    $scope.productID = $routeParams.current.params.productId;
    
    if (!window.location.origin) {
      window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
    }

    $scope.origin    = window.location.origin;
    $scope.paginationTotalNum = 30;
    $scope.goToPage = function(num){

      switch(num){

        case 1:
          $location.path("/productSelection/" + $scope.productID);
          break;

        case 2:
          $location.path("/productSelection/" + $scope.productID + "/configRegistration");
          break;

        case 3:
          $location.path("/productSelection/" + $scope.productID + "/configLogin");
          break;

        default:
          console.log("pagination switching just broke");

      }
     
    };

    //if coming from the selection pages, clear the cache so query knows to fetch new data
    if ($scope.routingFromSelectionPage){

      var endpointUrl = RestEndpointUrl + '/config/' + $scope.productID;

      var $httpDefaultCache = $cacheFactory.get('$http');
      $httpDefaultCache.remove(endpointUrl);

    }

    //define 3 promises
    var one   = DataModelsFactory.getProductsModel($scope.productID, "query");
    var two   = DataModelsFactory.getRegistrationModel($scope.productID, "query");
    var three = DataModelsFactory.getLoginModel($scope.productID, "query");

    //wait for all to finish 
    var all = $q.all([one, two, three]);

    all.then(function(data){

      /**
        Initialize the data w/ values from the service but then overwrite with the temporary data
        that holds user input. This allows user data to persist across page views while only submitting
        to the server on "Save & Finish"
      **/

      $scope.productData = data[0];
      $scope.productData = $scope.extend($scope.productData, TempDataStorage.tempStorage.tempProductData);

      $scope.registrationData = data[1];
      $scope.registrationData = $scope.extend($scope.registrationData, TempDataStorage.tempStorage.tempRegistrationData);

      $scope.loginData = data[2];
      $scope.loginData = $scope.extend($scope.loginData, TempDataStorage.tempStorage.tempLoginData);

      TempDataStorage.tempStorage.tempProductData      = angular.copy($scope.productData);
      TempDataStorage.tempStorage.tempRegistrationData = angular.copy($scope.registrationData);
      TempDataStorage.tempStorage.tempLoginData        = angular.copy($scope.loginData);

    }); 
    
    $scope.saveAndSubmit = function(){    	
      $scope.saving = true;

      var resource = WizardService.get( {productID:$scope.productID}, function(data) {
  
          /* Product */
          
          data.category           = $scope.productData.productID;
          data.logoHref           = $scope.productData.logoLink;
          data.logoTooltip        = $scope.productData.logoOnHoverTooltip;
          data.includeNeustarLogo = $scope.productData.includeNeustarLogo;
          data.apiKey             = $scope.productData.API_Key;
          data.secret             = $scope.productData.API_SharedSecret;
          data.logoSourceUrl      = $scope.productData.logoName;
          data.enableMarketo      = $scope.productData.enableMarketo;
          //footer details
          data.productName        = $scope.productData.productName;
          data.productBuyUrl      = $scope.productData.productBuyUrl;
          data.productServiceUrl  = $scope.productData.productServiceUrl;
         
          //save permissions
          for (var i = 0; i < $scope.productData.permissions.length; i++){
            data.permissions.selections[i].selected = $scope.productData.permissions[i].selected;
          }

          //save roles
          for (var j = 0; j < $scope.productData.roles.length; j++){
            data.roles.selections[j].selected = $scope.productData.roles[j].selected;
          }

          /* Registration */

          //intro words-----------------------------------------------------------------------------
          data.registrationTabLabel            = $scope.registrationData.tabLabel;
          data.registrationPageTitle           = $scope.registrationData.pageTitle;
          data.registrationPageSubTitle        = $scope.registrationData.pageSubtitle;
          //intro templates-------------------------------------------------------------------------
          data.introTemplatePlaceOnLeft        = $scope.registrationData.placeFormOnLeft;
          data.introTemplateWidth              = $scope.registrationData.introTemplateWidth;
          data.introTemplateFilename           = $scope.registrationData.introTemplateFilename;
          //form templates--------------------------------------------------------------------------
          data.formTemplatesWidth              = $scope.registrationData.formTemplateWidth;
          data.registrationUseEmailForUsername = $scope.registrationData.useEmailForUsername;
          data.formTemplatesFiles              = $scope.registrationData.formTemplatesFiles;
          //go to ? after registration--------------------------------------------------------------
          data.registrationTargetUrl           = $scope.registrationData.finishGoToUrl;
          data.registrationSendActivationEmail = $scope.registrationData.sendActivationEmail;

          /* Login */

          data.loginShowRegistrationLink = $scope.loginData.showRegistrationLink; 
          data.loginEmbeddedLogin        = $scope.loginData.embedLogin ;
          data.loginTargetUrl            = $scope.loginData.loginButtonDirectsTo ;
          data.passwordResetTargetUrl    = $scope.loginData.passwordResetDirectsTo;
          data.loginLeftPaneTemplate     = $scope.loginData.loginTemplate;
          data.loginDefaultTemplate      = $scope.loginData.loginDefaultTemplate;
          data.supportEmail              = $scope.loginData.supportEmail;

          //tell user that changes have been saved.
          data.$update({productID:$scope.productID}, function() {
            $scope.saving = false;
            window.location.href = '#/productSelection';
          });

      });//end saveAndSubmit();

    };

}]);

/*=================================================================
=      Product Info Controller (Registration Data)                =
=================================================================*/

app.controller("ProductInfoController",

    ["$scope", "FileUpload" , "$http", 'TempDataStorage', '$q', '$rootScope', '$modal', 

  function($scope, FileUpload, $http, TempDataStorage, $q, $rootScope, $modal){

    $scope.paginationCurrentNum = 1;

    $scope.saveTempData = function(){
      TempDataStorage.tempStorage.tempProductData = angular.copy($scope.productData);
    };

    $scope.uploadFile = function(){

      //start the spinner, initialize promise, pass to service at end
      $scope.spinning = true;
      var spinPromise = $q.defer();
      spinPromise.promise.then(function(data){
        $scope.spinning = false;
        $scope.uploaded = true;
        //pass filename to backend
        $scope.productData.logoName = $scope.myFile.name;
      });

      var file = $scope.myFile;
      var uploadUrl = $scope.apiUploadUrl + $scope.productID;
      FileUpload.uploadFileToUrl(file, uploadUrl, "userLogo", spinPromise);
    };

    $scope.openVisualExample = function() {
      
      var modalInstance = $modal.open({
        templateUrl: './ng-templates/product-visual.html',
      });

    };


}]);

/*=================================================================
=      Registration Info Controller (Registration Data)           =
=================================================================*/


app.controller("RegistrationInfoController",

    ["$scope", "TempDataStorage", "FileUpload", "$q", "$modal",

  function($scope, TempDataStorage, FileUpload, $q, $modal){

    $scope.paginationCurrentNum = 2;

    $scope.saveTempData = function(){
      TempDataStorage.tempStorage.tempRegistrationData = angular.copy($scope.registrationData);
    };

    $scope.uploadIntroTemplateFile = function(){

      //start the spinner, initialize promise, pass to service at end
      $scope.spinningIntro = true;
      var spinPromise = $q.defer();
      spinPromise.promise.then(function(data){
        $scope.spinningIntro = false;
        $scope.uploadedIntro = true;
        //pass filename to backend
        $scope.registrationData.introTemplateFilename = $scope.introTemplateFile.name;
      });

      var file = $scope.introTemplateFile;
      var uploadUrl = $scope.apiUploadUrl + $scope.productID;
      FileUpload.uploadFileToUrl(file, uploadUrl, "introTemplate", spinPromise);
    };

    $scope.uploadRegTemplateFile = function(){

      //start the spinner, initialize promise, pass to service at end
      $scope.spinningRegistration = true;
      var spinPromise = $q.defer();
      spinPromise.promise.then(function(data){
        $scope.spinningRegistration = false;
        $scope.uploadedRegistration = true;
        //pass filename to backend
        $scope.registrationData.formTemplatesFiles = $scope.regTemplateFile.name;
      });

      var file = $scope.regTemplateFile;
      var uploadUrl = $scope.apiUploadUrl + $scope.productID;
      FileUpload.uploadFileToUrl(file, uploadUrl, "registrationTemplate", spinPromise);
    };

    $scope.openModal = function() {
      
      var modalInstance = $modal.open({
        templateUrl: './ng-templates/embeddedRegistrationPartial.html',
        controller: "ConfigWizardController"
      });

    };

    $scope.openVisual_pageTitle = function() {
      
      var modalInstance = $modal.open({
        templateUrl: './ng-templates/image-templates/page-title.html'
      });

    };

    $scope.openVisual_pageSubtitle = function() {
      
      var modalInstance = $modal.open({
        templateUrl: './ng-templates/image-templates/page-subtitle.html'
      });

    };

    $scope.openVisual_tabLabel = function() {
      
      var modalInstance = $modal.open({
        templateUrl: './ng-templates/image-templates/tab-label.html'
      });

    };

    $scope.openVisual_introTemplate = function() {
      
      var modalInstance = $modal.open({
        templateUrl: './ng-templates/image-templates/intro-template.html'
      });

    };

    $scope.openVisual_registrationTemplate = function() {
      
      var modalInstance = $modal.open({
        templateUrl: './ng-templates/image-templates/registration-template.html'
      });

    };


}]);

/*=================================================================
=           Login Info Controller (Login Data)                    =
=================================================================*/


app.controller("LoginInfoController",

    ["$scope", "TempDataStorage", "FileUpload", "$q", "$modal",

  function($scope, TempDataStorage, FileUpload, $q, $modal){

    $scope.paginationCurrentNum = 3;

    $scope.saveTempData = function(){
      TempDataStorage.tempStorage.tempLoginData = angular.copy($scope.loginData);
    };

    $scope.uploadLoginTemplateFile = function(){

      //start the spinner, initialize promise, pass to service at end
      $scope.spinningLoginDefault = true;
      var spinPromise = $q.defer();
      spinPromise.promise.then(function(data){
        $scope.spinningLoginDefault = false;
        $scope.uploadedLoginDefault = true;
        //pass file to backend
        $scope.loginData.loginTemplate = $scope.loginTemplateFile.name;
      });

      var file = $scope.loginTemplateFile;
      var uploadUrl = $scope.apiUploadUrl + $scope.productID;
      FileUpload.uploadFileToUrl(file, uploadUrl, "loginTemplate", spinPromise);
    };

    $scope.openModal = function() {
      
      var modalInstance = $modal.open({
        templateUrl: './ng-templates/embeddedLoginPartial.html',
        controller: "ConfigWizardController"
      });

    };

    $scope.openVisualExample = function() {
      
      var modalInstance = $modal.open({
        templateUrl: './ng-templates/login-visual.html'
      });

    };


}]);







