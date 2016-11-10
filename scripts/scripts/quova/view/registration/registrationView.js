/*
 * RegistrationView Controller
 */
define([
     // templates
    'text!templates.registration/registrationTemplate.html',
    'text!templates.registration/reservedFieldsTemplate.html',
    'text!templates/common/modalDialogTemplate.html',
    // libs
    'jquery.activity-indicator', 'jquery.debug', 'jquery.deparam',
	'jquery.i18n', 'jquery.metadata', 'jquery.ba-postMessage',
    'jquery.ui',
    // views
	'view.common.formView' 
],function(template, reservedFieldsTemplate, modalTemplate) {
	
	quova.platform.view.registration.RegistrationView = quova.platform.view.common.FormView.extend({
        el                    : $("#app-body"),
        embeddedMode          : false,
        model                 : null,
        formContainerSelector : "#reg-form-container",
        formSelector          : "#reg-form",
        tabListSelector       : "#reg-tablist",
        productId             : null,
        selectedStep          : 0,
        allTabsFulfilled      : false,
        contextMgr            : null,

        initialize: function(options) {
            this.model        = options.model;
            this.productId    = options.productId;
            this.contextMgr   = quova.platform.app.registration.ContextMgr;
            this.loginUrl = quova.platform.app.protocol.account.Login+ '?CL=' + this.productId;
            this.resetPassUrl = quova.platform.app.protocol.account.ForgotPassword+ '?CL=' + this.productId;
        },
        events : _.extend({
            "blur #reg-form #username, #reg-form #login-email": 'loginIdCheckEvent',
            "click #submit-reg-button": 'submitRegistration',
            "focus #reg-form input[type='text']": "_clearMessage",
            "click #reg-form input[type='checkbox'], #reg-form input[type='radio']": "_clearMessage"
        },quova.platform.view.common.FormView.prototype.events),
        
        _clearMessage: function() {
            $(".ui-tooltip").qtip("hide");
        },

        render: function() {
            $(this.el).activity();
            this.viewPort = "#tab-widget-container";
            var self = this;
            // load main template
            var pageInfo = self.pageInfo = self.contextMgr.getProductPageInfo();

            this.$el.html(_.template(template, {
                pageTitle: pageInfo.pageTitle,
                pageSubTitle: pageInfo.pageSubTitle
            }));
            
            this.$userMessage = self.$el.parent().find("#user-message");

            // Handle company and product logos
            var $pageHeader =  $("#app-header");
            var $neustarLogo = $pageHeader.find("#neustar-logo");

            if(self.contextMgr.includeNeustarLogo() === true) {
                $neustarLogo.show();
            } else {
                $neustarLogo.hide();
            }

            if(pageInfo.logoSourceUrl) {
            	$.when(self.contextMgr.getUserLogoElement()).then(function(element) {
            		$pageHeader.find("#product-logo").html(element);
                });
            } else {
                $pageHeader.find("#product-logo").html('');
            }

            // Handle tab label
            if(pageInfo.tabLabel) {
                var $tablist = $(self.tabListSelector);
                $tablist.find(".tab-name").html(pageInfo.tabLabel);
                $tablist.show();
            }

            // Handle product Intro template
            var introTemplateObject = self.contextMgr.getProductIntroTemplate();
            
            if (introTemplateObject && self.embeddedMode != true) {
            	
                var isLeftAligned = introTemplateObject.placementOnLeft;
                var introTemplateContainer;
                if(isLeftAligned) {
                	introTemplateContainer = $('<div id="reg-product-intro"></div>')
											.insertBefore(self.formContainerSelector);
                } else {
                	introTemplateContainer = $('<div id="reg-product-intro"></div>')
											.insertAfter(self.formContainerSelector);
                }

                if(introTemplateObject.width) {
                	introTemplateContainer.width(introTemplateObject.width);
                }

                // var templateUrl = quova.platform.app.protocol.registration.ProductResource + self.productId +"/introTemplate.html";

                //load new dynamically generated url from s3
                if(introTemplateObject.fileName) {
                	$.when(self.contextMgr.getRegIntroTemplate()).then(function(element) {
                		//console.log("javascript cors method...;");
                        //console.log("element is :" , element);
                		// function createCORSRequest(method, url){
                        //   var xhr = new XMLHttpRequest();
                        //   if ("withCredentials" in xhr){
                        //     xhr.open(method, url, true);
                        //   } else if (typeof XDomainRequest != "undefined"){
                        //     console.log("using xdomainRequest");
                        //     xhr = new XDomainRequest();
                        //     xhr.open(method, url);
                        //   } else {
                        //     xhr = null;
                        //   }
                        //   return xhr;
                        // }

                        // console.log("getting with url", element);
                        // console.log(createCORSRequest('GET', element));
                		$.ajax({url: element,
                               // data: 'data sent to the server on ' + (new Date()).toString(),
                               // contentType: 'application/json;charset=utf-8',
                               type: 'GET',
                               dataType: 'html',
                               success : function(data) {
                            	   //console.log("success, here is the data: ");                         	   
                            	   $(introTemplateContainer).html(data);
                               },
                               error : function(jqXHR,textStatus) {
                                   	console.log("unable to load the objects from bucket!!");
                                   //console.log(jqXHR);
                                   //console.log(textStatus);
                               },
                               complete : function(){                            	   
                            	   //console.log("window.storageHostname: "+window.storageHostname);
                            	   //console.log("window.storageBucket: "+window.storageBucket);
                            	   if((window.storageHostname != null) && (window.storageBucket != null)){
                            		   //console.log('Not calling displayRegistrationIntro');
                            		   var imgLocation = "https://"+window.storageHostname+"/"+window.storageBucket+"/"+self.productId+"/images/arrow.png";
                            		   $('#imgArrow').attr('src',imgLocation);
                              	   } else{
                              		   //console.log('Calling displayRegistrationIntro');
                              		   self._displayRegistrationIntro(self.productId);
                              	   }                            	   
                               }
                         });
                    });
                }
            }

            // Handle registration form templates
            // get custom templates
            self.formTemplatesObjects = "hellolit does mamatekr what isihello.html"; 
            // self.contextMgr.getProductFormTemplates();
            self.$el.find("#reg-form-container").width(self.contextMgr.getRegFormWidth());
            // init UI widgets
            $.metadata.setType("attr", "tooltip");
            $.metadata.setType("attr", "validate");

            self.$regForm = $(this.el).find(self.formSelector);

            // fix known IE7 issue when autocomplete presents is failing onchange event capture
            if($('html').hasClass('ie7'))  {
                self.$regForm.attr("autocomplete", "off");
            }

            // site tracking
            //self.contextMgr.regViewEvent.trigger("registrationPageViewed", "registration page view event");

            if(self.embeddedMode === true) {
            	/**
                 * Handle hyperlinks
                 */
                $("#appview").on("click", "a", function(evt) {
                    self.goToParentWindow(evt);
                });

                /**
                 * Handle Popover message cancel button
                 */
                self.$userMessage.find( ".close-icon" ).button({
                	icons: {
                		primary: "ui-icon-close"
                	},
                	text: false
                }).click(function(evt){
                	evt.preventDefault();
                	$(this).parent().slideUp();
                });

                self.origin = horizon.app.Utils.getUrlVars()["orig"];

                /**
                 * Receive message from embed widget
                 */
                $.receiveMessage(function(e) {
                	var data = e.data ? $.String.deparam(e.data) : "";
                	if(data.status=="init") {
                		if(data.cookies) {
                			$.each(data.cookies, function(index, cookie) {
                				$.cookie(index, cookie);
                			});
                		}
                	}
                  }, self.origin);
                
                /**
                 * Notify parent - init is ready
                 */
                $.postMessage({status : "init"}, self.origin, parent);                
            }
        },

        setContainerType: function(cssClass) {
            this.$regForm.addClass(cssClass);
        },

        _subviewReady: function() {
        	// reserve fields validations
            this._handleValidateEvent();
            this.validator = this.$regForm.validate();
            // assign existing-member-reglink
            this.$el.find("#existing-member-reglink").attr("href", this.loginUrl);
        },
        
        handleBackStep: function() {
        	this.$tabWidgetContainer.tabs("option", "selected",this.selectedStep - 1);

        },

        handleNextStep: function() {
        	this.$tabWidgetContainer.tabs("option", "selected",this.selectedStep + 1);

        },

        enableSubmitButton: function() {
            var errors = this.validator.numberOfInvalids();
            debug.debug("Number of invalids: " + errors);

            if(!this.$regForm.valid()) {
                this.$submitButton.attr('disabled', 'disabled');
            } else {
                this.$submitButton.removeAttr('disabled');
            }
        },

        loginIdCheckEvent: function (e) {
            this._loginIdCheck($(e.currentTarget));
        },

        _loginIdCheck: function(loginField, callback) {
            var self = this;
            var isUsername = loginField.attr("name") == "username";
            var loginIdName = isUsername? "username" : "email";
            var validateMessages = {};
            //var $validatedExisting = self.$regForm.find("#validated-existing-user").hide();

            if(loginField.val().length < 4) {
                return false;
            }

            // validate single field
            self.validator.element(loginField);

            if(loginField.hasClass("invalid")) {
                return false;
            }

            if(isUsername) {
            	validateMessages.error500 = {
            			"username" : messages.registration.check_username.error500
            	};
            	validateMessages.error404 = {
            			"username" : messages.registration.validation
            							.username_taken("Username",self.loginUrl,self.resetPassUrl)
            	};
            } else {
            	validateMessages.error500 = {
            			"email" : messages.registration.check_username.error500
            	};
            	validateMessages.error404 = {
            			"email" : messages.registration.validation
            						.username_taken("Email",self.loginUrl,self.resetPassUrl)
            	};
            }
            
            var $indicator = self.$regForm.find(".field-loader");

            if(!callback) {
            	loginField.next().hide();
            	$indicator.css("display", "inline-block")
            				.activity({
            					segments : 8,
            					width : 2,
								space : 0,
								length : 3,
								speed : 1.5,
								align : "left"
            				});
            }
            
            $.ajax({
            	url : quova.platform.app.protocol.registration.IdentityRetrieval+ loginField.val()+ "?CL="+ self.productId,
                type: "GET",
                error: function(jqXHR) {
                    if(jqXHR.status == 500) {
                        if(callback) {
                            var message = validateMessages.error500[loginIdName];
                            if(self.embeddedMode == true) {
                                self.$userMessage.find(".message-content").html(message);
                                self.$userMessage.slideDown();
                            } else {
                            	horizon.app.Utils.showAlertErrorMessage(message);
                            }
                        }
                        debug.warn("Check username failed - 500 error.");
                        self.stopSubmitIndicator(self.$submitButton);
                    } else if (jqXHR.status == 404) {
                        // ok
                        if(callback) {
                            callback();
                        }
                        debug.debug("Username is available.");
                    }
                },
                success: function() {
                	setTimeout(function() {
                		self.validator.showErrors(validateMessages.error404);
                	}, 100);
                    if(callback) {
                        //quova.platform.app.CommonHelper.showAlertErrorMessage(validateMessages.error404[loginIdName]);
                    	self._displayError("invalid");
                    }
                    debug.debug("Username has been taken.");
                },
                complete: function() {
                     $indicator.activity(false);
                     loginField.next().show();
                }
            });
        },

        submitRegistration: function(e) {
            var self = this;
            //$("html, body").scrollTop(0);
            if (self.$regForm.find(".invalid").length || !self.$regForm.valid()) {
                self._displayError("invalid");
                return;
            }

            self.startSubmitIndicator(self.$submitButton);
            $(document).trigger('registrationOnSubmit');

            var submitCallback = function() {
            	self.model.set(self.$regForm.find(".reserved-template-container :input").serializeObject());
            	self.model.productModel.set(self.$regForm.find(".custom-template-container :input").serializeObject());
            	self.model.save({},{
            		
            		success : function(model,resp) {
            			if(resp.success === true ) {
            				if(self.embeddedMode === true) {
	            				var data = {
	            						status : "success",
	            						redirectUrl : resp.redirectUrl
	            				};
	            				debug.log("Horizon registration success.");
	            				$.postMessage(data,self.origin,parent);
	            			} else {
	            				window.location = resp.redirectUrl;
	            			}
            				// Go to confirmation date
            				self.contextMgr.regViewEvent.trigger("registrationSuccess","registration success event");
            				self.clear();
            			} else {
            				/*
            				debug.log("Horizon registration failure.");
            				self._displayError(resp.errorCode);
            				self._displayServerError(resp.errorString);
            				self.stopSubmitIndicator(self.$submitButton);
            				this.$el.clear();*/
            				//console.log("Horizon registration failure."+resp.errorList);
            				if(resp.errorList == null){
            					self._displayError(resp.errorCode);
                				self._displayServerError(resp.errorString);                				
                				self.clear();
            				} else{
            					$.each(resp.errorList,function(index,value){
                            		console.log(index+":"+value);
                            		if(value != ""){                        			 
                                 		$("#errMsgUL").append("<li>" + $.i18n.prop(value.errorMessage) + "</li>");                             		
                            		}
                            		
                            	});
            				}
                        	
                        	self.stopSubmitIndicator(self.$submitButton,null,true);                        	
                        	this.viewPort = "#tab-widget-container";
                        	
                        }
                        //self.stopSubmitIndicator(self.$submitButton, null, true);
                    },
                    error : function(model,resp) {
                    	self._displayError(resp.status);
                    	self.stopSubmitIndicator(self.$submitButton);
                    }
                });
                return false;
            };

            // check username before calling submit function
            setTimeout(function() {self._loginIdCheck(self.$regForm.find("input.loginId"),submitCallback);}, 100);
        },

        _displayError: function(errorCode){
            var message = "";
            var title = "";

            // 400
            if(errorCode == 400) { //bad request
            	message = $.i18n.prop("messages.registration.create.error400");
            	title = $.i18n.prop("messages.common.header.http_status_400");
            } else if(errorCode == 409) { // username already exist
                // platform server error
            	message = $.i18n.prop("messages.registration.create.error409");
            } else if(errorCode == 500) { // platform server internal server error
            	message = $.i18n.prop("messages.registration.create.error500");
            	title = $.i18n.prop("messages.common.header.http_status_500");
            } else if (errorCode == "invalid") {
            	message = $.i18n.prop("messages.common.invalid.total_invalids");
            	title = $.i18n.prop("messages.common.invalid.header.total_invalids");
            }

            if(this.embeddedMode == true) {
            	this.$userMessage.find(".message-content").html(message);
                this.$userMessage.slideDown();

                if(errorCode != "invalid") {
                	$.postMessage({status : "fail"}, this.origin, parent);
                }
            } else {
            	horizon.app.Utils.showAlertErrorMessage(message, title);
            }
        },
        //display server side validation error msgs
        _displayServerError : function(errorString) {
        	var message = "";
        	var title = "";
        	title = "Server Error";
        	message = errorString.split('.').join("<br />");
        	horizon.app.Utils.showAlertErrorMessage(message,title);
        },
        
        _selectChanged: function(e) {
            var field = $(e.currentTarget);
            var options = $("option:selected", field);
            var values;
            if(1 == options.length) {
                values = $(options[0]).val();
            } else {
                values = [];
                $.each(options, function() {
                    values.push($(this).val());
                });
            }

            var data = {};
            data[field.attr('name')] = values;
            this.model.set(data);
        },

        _checkboxChanged: function(e) {
            var field = $(e.currentTarget);
							var selectedOptions = field.closest("form").find(
									'input[name="' + field.attr("name")
											+ '"]:checked');
            var values;
            if(1 == selectedOptions.length) {
                values = $(selectedOptions[0]).val();
            } else {
                values = [];
                $.each(selectedOptions, function() {
                    values.push($(this).val());
                });
            }

            var data = {};
            data[field.attr('name')] = values;
            this.model.set(data);
        },

        _handleValidateEvent: function() {
        	var requiredFields = this.$regForm.find("input.asterisk,select.asterisk");
        	
        	$.each(requiredFields,function(index, value) {
        		var fieldType = $(this).attr("type");
        		var parentNode = $(this).parent();
        		if (fieldType == "checkbox"|| fieldType == "radio" || parentNode.hasClass("fields-group")) {
        			if (!$(this).parent().is("div")) {
        				debug.error("Any checkbox/radio or group of fields must be contained in a div container!");
                        return;
                    }
        			if (!parentNode.find(".validate-icon").length) {
        				parentNode.append('<span class="validate-icon asterisk"></span>');
                    }
                } else {
                	$('<span class="validate-icon asterisk"></span>').insertAfter($(this));
                }
        	});
        	
        	this.$regForm.find('*[tooltip]').each(function() {
                var field = $(this);
                var toolText = $(this).attr("tooltip");
                quova.platform.app.registration.Helper.createFieldTooltip({
                    invalid: false,
                    render: false,
                    element: field,
                    text: toolText
                });
            });

            if(this.embeddedMode !== true) {
                this.$regForm.find(".popover").fancybox({
                    'width'				: '75%',
                    'height'			: '75%',
                    'autoScale'     	: false,
                    'transitionIn'		: 'none',
                    'transitionOut'		: 'none',
                    'type'				: 'iframe'
                });
            }

            return requiredFields;
        },
        
        _createReservedFieldsView : function(reservedTempContainer) {
        	var reservedFieldsInfo = this.reservedFieldsInfo = this.contextMgr.getReservedFieldsInfo();
        	var compiledTemplate = _.template(reservedFieldsTemplate);
        	$(reservedTempContainer).html(compiledTemplate({
        									useEmailForUsername : (reservedFieldsInfo) ? reservedFieldsInfo.useEmailForUsername: false,
											confirmPassword : (reservedFieldsInfo) ? reservedFieldsInfo.confirmPassword: false,
											confirmEmail : (reservedFieldsInfo) ? reservedFieldsInfo.confirmEmail: false
            }));
            this._handlePlaceholders(reservedTempContainer);
        },

        _handlePlaceholders: function(formContainer) {
            if (!Modernizr.input.placeholder) {
            	formContainer.find(':input').removeAttr('placeholder');
            }
        },
        onLoad : function(){
        }

    });

    return quova.platform.view.registration.RegistrationView;

});