define([
    'text!templates.registration/singleStepTemplate.html',
    'jquery.validate',
    'app.validator',
    'app.validateRules',
    'jquery.activity-indicator',
    'jquery.passwordStrength',
    'view.reg.registrationView'
], function(singleStepTemplate) {
    quova.platform.view.registration.SingleStepView = quova.platform.view.registration.RegistrationView.extend({
        productId: null,
        selectedStep: 0,
        validUsername: false,
        contextMgr: null,

        initialize: function(options) {
            quova.platform.view.registration.RegistrationView.prototype.initialize.call(this, options);
        },

        events: _.extend({

        }, quova.platform.view.registration.RegistrationView.prototype.events),

        render: function() {
            var self = this;
            quova.platform.view.registration.RegistrationView.prototype.render.call(this);
            $(this.$regForm).activity();
            var template = _.template(singleStepTemplate);
            this.$regForm.html(template({submitLabel: self.contextMgr.getSubmitButtonLabel()}));

            self.$submitButton = $(this.el).find("#submit-reg-button");
            var $reservedTempContainer = self.$regForm.find(".reserved-template-container");
            var $customTempContainer = self.$regForm.find(".custom-template-container");

            self.setContainerType("single-step");

            // Reserved fields template
            self._createReservedFieldsView($reservedTempContainer);

            var $password = $(this.el).find("#password");
            $password.passwordStrength({targetDiv: '#password-strength', classes : ['weak','medium','strong']});

            // Custom fields template
            if(self.formTemplatesObjects && self.formTemplatesObjects.length > 0) {
                var formTemplatesObjects = self.formTemplatesObjects[0];
                var filename = formTemplatesObjects.fileName;
                
                var templateUrl = self.contextMgr.getProductTemplateUrl();
                //console.log('TemplateURL: '+templateUrl);                
                if(typeof(templateUrl) === 'undefined'){
                	$.when(templateUrl).then(function(element){

                        /* $customTempContainer.load(element, function() {
                             self._subviewReady();
                             self._handlePlaceholders($customTempContainer);
                         });*/
                     	
                     	$.ajax({url: element,
                             // data: 'data sent to the server on ' + (new Date()).toString(),
                             // contentType: 'application/json;charset=utf-8',
                             type: 'GET',
                             dataType: 'html',
                             success : function(data) {
                          	   //console.log("success, here is the data: ");                         	   
                          	   $($customTempContainer).html(data);
                          	    self._subviewReady();
                                 self._handlePlaceholders($customTempContainer);
                             },
                             error : function(jqXHR,textStatus) {
                                 console.log("wrong!!");
                                 self._subviewReady();
                                 self._handlePlaceholders($customTempContainer);
                                 //console.log(jqXHR);
                                 //console.log(textStatus);
                             },
                             complete : function(){
                             	//console.log("window.storageHostname: "+window.storageHostname);
                             	//console.log("window.storageBucket: "+window.storageBucket);
                          	   if((window.storageHostname != null) && (window.storageBucket != null)){
                          		  //console.log('Not calling displayRegistrationIntro');
                          		  var termsLocation = "https://"+window.storageHostname+"/"+window.storageBucket+"/"+self.productId+"/terms.html";
                          		  $('.custom-template-container a').attr('href',termsLocation);
                          	   } else{
                          		  //console.log('Calling displayRegistrationIntro');
                          		  self._displayRegistrationIntro(self.productId);
                          	   }
                          	   
                             }
                       });

                     });                	
                } else {
                	console.log('Template File not found');
                	self._subviewReady();
                }
                

            } else {
                self._subviewReady();
            }
        },
        
        _displayRegistrationIntro : function(productName){
        	console.log('Querying for details of S3');
        	$.ajax({
				url : "registration/getConfigDetails",
		        type: "GET",
				error: function(jqXHR) {
					console.log('Error '+jqXHR);
		         },
				success: function(data) {					
					var details = jQuery.parseJSON(data);
					// Set the location of arrow image
					window.storageHostname = details.storageHostname;
					window.storageBucket = details.storageBucket;
					var imgLocation = "https://"+window.storageHostname+"/"+window.storageBucket+"/"+productName+"/images/arrow.png";
					$('#imgArrow').attr('src',imgLocation);
					
					// Set the location of terms.html
					var termsLocation = "https://"+window.storageHostname+"/"+window.storageBucket+"/"+productName+"/terms.html";
					$('.custom-template-container a').attr('href',termsLocation);
					
				 }
			});
        }
        
    });

});