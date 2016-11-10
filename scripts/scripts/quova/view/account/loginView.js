/*!
 * LoginView Controller
 */
define([
    'text!templates.account/customContentTemplate.html',
    'jquery.ui',
    'jquery.debug',
    'jquery.i18n',
    'jquery.form',
    'jquery.ba-postMessage',
    'jquery.cookie',
    'jquery.qtip',
    'app.utils',
    'app.protocol',
    'view.common.errorView',
    'view.common.formView'
], function(leftPaneTemplate) {
    quova.platform.view.account.LoginView = quova.platform.view.common.FormView.extend({
        el: $('#appview'),
        embeddedMode: false,
        sources: [ 'registration', 'passwordReset', 'timeout', 'acctActivation', 'failed', 'cookiesDisabled', 'accountDisabled' ],
        appServiceUrl: {
           /* dev: "http://localhost:8080/apps/login/ajax",
            stage: "https://ipintelligence-stage.neustar.biz/apps/login/ajax",
            prod: "https://ipintelligence.neustar.biz/apps/login/ajax"*/
        },
        regTemplate: '<a id="reg-app-link" href="<%=url%>" class="strong action-link" title="Register with Neustar!">' +
            '<%=$.i18n.prop("messages.login.register_button")%></a>',

        forgotPassTemplate: '<a href="<%=url%>" id="forgot-password" class="level2" title="Forgot your password?"  tabindex="-1">' +
            '<%=$.i18n.prop("messages.login.forgot_password")%></a>',

        initialize: function(args) {
            // need to do some clean up when the page is changed
            $(window).unload(function() {
                $("#submit-button").attr('disabled',false);
            });

        },

        events: _.extend({
            // make anchor tags take over the parent view
            "click a": function(evt){
                if(this.embeddedMode === true) {
                    this.goToParentWindow(evt);
                }
            },
            "click #submit-button": "submitLoginForm"
        }, quova.platform.view.common.FormView.prototype.events),

        render: function() {
            var self = this;
            this.form = $('#login-form');
            this.submitButton = this.form.find('#submit-button').button().css("visibility", "visible");
            this.username = this.form.find('#usernameOrEmail');
            this.password = this.form.find('#password');
            $(this.el).find('#username').focus();
            var $regContent = $(this.el).find('#registration-content');
            var $forgotPassContent = $(this.el).find('#forgot-password-content');
            var $customContentLeft = $(this.el).find('#custom-content-left');
            // redirect source
            var source = $('#login-source').val();

            // handling custom content
            var productId = self.productId = quova.platform.app.CommonHelper.getUrlVars()["CL"];

            // handling garbage
            if(productId.indexOf('#') != -1) {
                productId = productId.substr(0, productId.indexOf('#'));
            }

            if(!productId) {
                this.showErrorView("PAGE_NOT_FOUND");
                debug.warn("Product Id not defined.");
            } else {

                var forgotPassTemplate =  _.template(self.forgotPassTemplate);
                $forgotPassContent.html(forgotPassTemplate({
                    url: quova.platform.app.protocol.account.ForgotPassword+"?CL="+productId
                }));

                $.ajaxSetup({ cache: false });
                var req = $.getJSON("/apps/admin/config/"+ productId,
                    function(data) {
                		// Set the footer details
                	//	horizon.app.Utils.addProductNameAndURLToFooter(data.productBuyUrl,data.productServiceUrl,data.productName);

                        //---- get logo url ----
                        var category    = data.category;
                        var logoHref    = data.logoHref;
                        var logoSource  = data.logoSourceUrl;
                        var deferred    = $.Deferred();

                        if (!window.location.origin) {
                           window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
                        }

                        var promise = $.get(window.location.origin + "/apps/admin/file",{category: category,filename: logoSource});

                        promise.done(function(logoUrl){
                           
                            //---- Create anchor element ----
                            var anchor  = document.createElement('a');
                            anchor.href = logoHref;

                            //---- Create image element ----
                            var img   = document.createElement('img');
                            img.src   = logoUrl;
                            img.setAttribute("style", "max-height:70px; max-width:800px");

                            //---- Combine elements ----
                            anchor.appendChild(img);

                            deferred.resolve(anchor);

                        });

                        var loginLogoPromise =  deferred.promise();

                        // //---- create the element with the user uploaded logo ----/
                        // var userLogoAWS = "https://s3-us-west-2.amazonaws.com/nexgen-horizon/" + data.category + "/images/userLogo.png";

                        // //---- Create anchor element ----
                        // var anchor  = document.createElement('a');
                        // anchor.href = data.logoHref;

                        // //---- Create image element ----
                        // var img   = document.createElement('img');
                        // img.src   = userLogoAWS;
                        // img.title = data.logoTooltip;
                        // img.alt   = data.logoTooltip;
                        // img.setAttribute("style", "width:200px");

                        // //---- Combine elements ----
                        // var userLogoElement = anchor.appendChild(img);

                        // console.log("anchor: ", userLogoElement, anchor, img);


                        // Handle company and product logos
                        var $pageHeader =  $("#app-header");
                        var $neustarLogo =  $pageHeader.find("#neustar-logo");

                        if(data.includeNeustarLogo === "true") {
                            $neustarLogo.show();
                        } else {
                            $neustarLogo.hide();
                        }

                        if(data.logoSourceUrl && data.logoSourceUrl.length) {
                            $.when( loginLogoPromise ).then(function(element){
                                $pageHeader.find("#product-logo").html(element);    
                                // $pageHeader.find("#product-logo").html(anchor);
                            });
                        } else {
                            $pageHeader.find("#product-logo").html('');
                        }

                        //get s3 url via promises
                        // var templateUrl = quova.platform.app.protocol.registration.ProductResource + productId +"/loginTemplate.html";
                        var getLoginTemplate = function(){
                            //---- get logo url ----
                            var category = data.category;
                            var filename = data.loginLeftPaneTemplate;
                            var deferred    = $.Deferred();

                            if (!window.location.origin) {
                               window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
                            }
                            
                            var promise = $.get(window.location.origin + "/apps/admin/file",
                                   {
                                    category: category,
                                    filename: filename
                                   });

                            promise.done(function(templateUrl){
                               
                                deferred.resolve(templateUrl);

                            });

                            return deferred.promise();
                        };

                        // Show registration link
                        if(data.loginShowRegistrationLink === "true") {
                            var regTemplate =  _.template(self.regTemplate);
                            $regContent.html(regTemplate({
                                url: quova.platform.app.protocol.registration.LandingPage+
                                    "?CL="+productId
                            }));
                        }


                        if(data.loginDefaultTemplate) {
                            var compiledTemp = _.template(leftPaneTemplate);
                            $customContentLeft.html(compiledTemp({
                                descText: $.i18n.prop("messages.login.left_pane_desc")
                            }));
                        } else {
                            $.ajaxSetup({cache: false});
                            $.when( getLoginTemplate() ).then(function(element){

                                $customContentLeft.load(element);
                                // $customContentLeft.load(templateUrl);
                            });
                        }

                        // check login source and update login message
                        var msgContainer = $("#login-msg");
                        if ( source ) {
                            if ( jQuery.inArray( source, self.sources) > -1 ) {
                                // set login message
                                if(source == "failed") {
                                    msgContainer.addClass("error");
                                } if(source == "accountDisabled" || source == "cookiesDisabled" || source == "timeout") {
                                    msgContainer.addClass("warning");
                                } else {
                                    msgContainer.addClass("success");
                                }

                                msgContainer.find("span").html($.i18n.prop('messages.login.source_' + source));
                                msgContainer.css("visibility", "visible");
                            }
                        }
                    });

                req.error(function(jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 404) {
                        self.showErrorView("PAGE_NOT_FOUND");
                        debug.warn("Product properties not found.");
                    }
                });

                this.form.validate($.extend(self.validator, {
                    rules: {
                        username: {
                            required: true
                        },
                        password: {
                            required: true
                        }
                    }
                }));
            }
        },

        showErrorView: function(errorType) {
            var view = new quova.platform.view.common.ErrorView();
            view.render(errorType);
        },

        // kill this, shouldn't be needed b/c of new redis database, plust contextMgr has a 
        // function with the same name...
        // getProductPageInfo: function(productObject) {
        //     var info = productObject["sharedAppProperties"];

        //     var productInfo = {
        //         pageHeader: "",
        //         logoHref: "",
        //         logoSourceUrl: "",
        //         logoTooltip: ""
        //     };

        //     if(!info) {
        //         debug.warn("pageInfo not defined.");
        //         return productInfo;
        //     }

        //     if(!info["logoHref"]) {
        //         debug.warn("Product logo Href not defined.");
        //     } else {
        //         productInfo.logoHref = info.logoHref;
        //     }

        //     if(!info.logoSourceUrl) {
        //         debug.warn("Product logo source url not defined.");
        //     } else {
        //         productInfo.logoSourceUrl = info.logoSourceUrl;
        //     }

        //     if(!info.logoTooltip) {
        //         debug.warn("Product logo image tooltip not found.");
        //     } else {
        //         productInfo.logoTooltip = info.logoTooltip;
        //     }

        //     if(typeof info.includeNeustarLogo == "undefined") {
        //         productInfo.includeNeustarLogo = true;
        //     } else {
        //         productInfo.includeNeustarLogo = info.includeNeustarLogo;
        //     }

        //     return productInfo;
        // },

        submitLoginForm: function(evt) {
            var self = this;

            // trim any leading, trailing spaces from the username
            self.username[0].value = $.trim(self.username[0].value);

            if(!this.form.valid()) {
                return;
            }

            if(this.embeddedMode === false) {
                this.form.submit(function() {
                    self.startSubmitIndicator(self.submitButton);
                });
            } else {
                evt.preventDefault();

                self.startSubmitIndicator(self.submitButton);
                debug.log(quova.platform.app.CommonHelper.getUrlVars()["orig"]);
                this.form.ajaxSubmit({
                    url: self.appServiceUrl[$.cookie("env")]+"?CL="+self.productId,
                    type: "POST",
                    clearForm: false,
                    resetForm: false,
                    beforeSubmit: function(formData, jqForm, options) {
                        return true;
                    },
                    success: function(responseText, statusText, xhr, $form) {
                        debug.log("Login response", responseText);
                        if(responseText.authenticated !== true) {
                            debug.log("Horizon login failure.");
                            // error pane slide down
                            self.$el.find("#user-message")
                                .html("<span>Invalid login information.</span>")
                                .slideDown();

                            $.postMessage({status: "fail"},
                                quova.platform.app.CommonHelper.getUrlVars()["orig"],
                                parent);
                            
                            self._resetLoginButton();
                            return;
                        }

                        var redirectUrl = responseText.redirectUrl;
                        var data = {status: "success", redirectUrl: redirectUrl};
                        debug.log("Horizon login success.");
                        $.postMessage(data,
                            quova.platform.app.CommonHelper.getUrlVars()["orig"],
                            parent);
                    },
                    error: function(resp) {
                        debug.debug("Horizon login error returned", arguments);
                        debug.log("Horizon login failed.");
                        var errorText = "";
                        if(resp.status == 404) {
                            errorText = "User not found.";
                        }

                        if(resp.status == 500) {
                            errorText = "Server is not available. Please try later.";
                        }

                        // error pane slide down
                        self.$el.find("#user-message").html("<span>"+errorText+"</span>").slideDown();

                        $.postMessage({status: "fail"},
                                quova.platform.app.CommonHelper.getUrlVars()["orig"],
                                parent);
                    },
                    complete: function(jqXHR, textStatus){
                        debug.log("getAllResponseHeaders: ", jqXHR.getAllResponseHeaders());
                        debug.log("Horizon login request completed.");
                        if(self.embeddedMode === false) {
                            self._resetLoginButton();
                        }
                    }
                });
            }
        },

        _resetLoginButton: function(){
            this.submitButton.removeAttr("disabled");
            this.submitButton.button( "option", "label", "Sign In" );
            this.submitButton.button( "option", "disabled", false );
        }
    });

    return quova.platform.view.account.LoginView;

});