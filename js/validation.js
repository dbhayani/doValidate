/*
| Author: Danish Bhayani
| Email: mdbhayani.90@gmail.com
|
|---------------------------------------------------------------------------------------
| doValidate Library
|---------------------------------------------------------------------------------------
|
| The usage of this library is very simple. First, we need to set the validation
| for the fields. This is done by simply adding the attribute "data-validate" and
| defining the validation type. For example, "data-validate=required|valid_email"
|
| Then we need to trigger the function "doValidate" so that we can prepare the
| validation. For example, $(my-form).doValidate();
|
*/

(function($){
    // default formValidationOptions for validation
    var defaults = {
        // the outer div class
        wrapperClass: 'form-validation-box',
        
        // apply class on the fields with error(s)
        showFieldErrorClass: true,
        
        // the class to be applied if formValidationOptions.showFieldErrorClass is true
        fieldErrorClass: 'field-error',
        
        // apply class on the fields with success
        showFieldSuccessClass: true,
        
        // the class to be applied if formValidationOptions.showFieldSuccessClass is true
        fieldSuccessClass: 'field-success',
        
        // the form will be validated if set to true otherwise on document.ready
        validateOnSubmit: true,
        
        // show form errors popup style one by one
        showPopupErrorOneByOne: true,
        
        // show form errors popup style all
        showPopupErrorAll: false,
        
        // namespace id for popup error(s) if options.showPopupErrorAll is enabled
        showPopupErrorAllId: 'dovalidate-error-',
        
        // all error(s) wrapper class, will show only if formValidationOptions.showPopupErrorOneByOne is set to false
        allErrorsClass: 'validation-errors',
        
        // append all error(s) to element, will work only if formValidationOptions.showPopupErrorOneByOne = false
        appendAllErrorsTo: null,
        
        // prepend all error(s) to element, will work only if formValidationOptions.showPopupErrorOneByOne = false
        prependAllErrorsTo: null,
        
        // html all error(s) to element, will work only if formValidationOptions.showPopupErrorOneByOne = false
        htmlAllErrorsTo: null,
        
        // if set to true, additional text will be displayed on top of error(s) listing
        enableAdditionalTextForErrors: true,
        
        // additional text to be displayed on top of errors, will work only if formValidationOptions.enableAdditionalTextForErrors is set to true
        additionalTextForErrors: validationLanguage.additional_text,
        
        // enable switching to next field if validation fails on current field
        enableSwitchingToNext: false,
        
        // if window is resized, then errors are re-adjusted according to window size
        enableAutoResize: true,
        
        // if error(s) are displayed, window will scroll to the first error visible, will only work if formValidationOptions.showPopupErrorOneByOne is set to true
        scrollToFirstError: true,
        
        // this is the custom message for the field with a particular validation type.
        // usage: customMessage: { field-name: { required: your-message } }
        customMessage: {},
        
        // this is the success function. when the field has been successfully validated and no error(s)
        // this function will be loaded.
        //usage: onSuccess: { your-field: function(){} }
        onSuccess: {}
    }
    
    var regexObj = {
        required:                           /[^\d]/,
        valid_email:                        /^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i,
        integer:                            /^[\-+]?[0-9]+$/,
        valid_ip:                           /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$|^(([a-zA-Z]|[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z]|[A-Za-z][A-Za-z0-9\-]*[A-Za-z0-9])$|^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,
        valid_url:                          /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
        alpha:                              /^[A-Za-z]+$/,
        alpha_numeric:                      /^[A-Za-z0-9]+$/,
        alpha_numeric_with_space:           /^[A-Za-z0-9 ]+$/,
        alpha_numeric_with_chars:           /^[A-Za-z0-9_.-]+$/,
        alpha_numeric_with_chars_space:     /^[A-Za-z0-9 _.-]+$/,
    }
    
    /***********************************************************************************************/
    // This is our main doValidate function. Here we go !
    /***********************************************************************************************/
    $.fn.doValidate = function(formValidationOptions){
        // the form which is to be validated
        var $this = this;
        
        if(! $this.is("form"))
        {
            alert("Selector is not a form. Please fix the error in order to use doValidate");
            $('html').hide();
            return;
        }
        
        // namespace for storing validation messages
        var validationObject = {};
        
        // namespace for validation message, we use this globally throughout the plugin
        var $validationMessage = "";
        
        // merge user-supplied formValidationOptions with the defaults
        var formValidationOptions = $.extend({}, defaults, formValidationOptions);
        
        // get the first visible element of the form so that we can focus on it !
        var $firstElement = $this.find('input[type=text],input[type=password],textarea,select').filter(':visible:first');
        
        // focus on the first element
        if($firstElement.length)
        {
            $firstElement.focus();
        }
        
        if(formValidationOptions.validateOnSubmit)
        {
            $this.bind('submit', function(e){
                e.preventDefault();
                $.fn.applyValidation();
            });
        }
        else
        {
            $(document).bind('ready', function(){
                $.fn.applyValidation();
            });
        }
        
        // enable auto resize of error(s) only if options.showPopupErrorOneByOne is enabled
        if((formValidationOptions.showPopupErrorOneByOne || formValidationOptions.showPopupErrorAll) && formValidationOptions.enableAutoResize)
        {
            $(window).bind('resize', function(){
                $.fn.autoResizeValidation();
            });
        }
        
        /***********************************************************************************************/
        // This is the main validation function that we use for binding event
        /***********************************************************************************************/
        $.fn.applyValidation = function(){
            // we remove all the field errors class
            if(formValidationOptions.showFieldErrorClass)
            {
                $this.find('*').removeClass(formValidationOptions.fieldErrorClass);
            }
            
            // we remove all the field success class
            if(formValidationOptions.showFieldSuccessClass)
            {
                $this.find('*').removeClass(formValidationOptions.fieldSuccessClass);
            }
            
            // find all "data-validate" attributes
            var $dataValidationFields = $this.find("*[data-validate]");
            
            // reset validationObject to prepare the validation process
            validationObject = {};
            
            $dataValidationFields.each(function(){
                var $field = $(this);
                var $name = $field.attr("name");
                var $value = $.trim($field.val());
                var $splitDataValidate = $field.attr('data-validate').split('|');
                var $fieldSuccessfullyValidated = false;
                
                for(var i = 0; i < $splitDataValidate.length; i++)
                {
                    var $validationType = $.trim($splitDataValidate[i]);
                    // clean the validation type so that we only get the validation
                    // for eg min_length[2] becomes min_length
                    var $cleanValidationType = $validationType.replace(/\[(.+?)\]/g, '');
                    // get the string between []
                    var $parameters = /\[(.*?)\]/g;
                    var $parametersToFunction = $parameters.exec($validationType);
                    var $addToValidationObject = false;
                    $fieldSuccessfullyValidated = false;
                    
                    // throw an error if validation type is not proper or undefined
                    if(! regexObj.hasOwnProperty($cleanValidationType) && ! $.isFunction($.fn[$cleanValidationType]))
                    {
                        console.error($validationType + " is undefined");
                    }
                    
                    // now we load the validation messages based on validation type
                    // we check whether the validation type is present in regex object
                    // else we locate the function with the same name as validation type
                    if(! validationObject.hasOwnProperty($name))
                    {
                        if(regexObj.hasOwnProperty($validationType))
                        {
                            var $regexForValidationType = regexObj[$validationType];
                                                    
                            if(! $value.match($regexForValidationType))
                            {
                                $addToValidationObject = true;
                                
                                // check if custom message option is present for this field
                                if(formValidationOptions.customMessage.hasOwnProperty($name))
                                {
                                    // now we check if validation type is present in this custom message
                                    var customMessageForField = formValidationOptions.customMessage[$name];
                                    
                                    if(customMessageForField.hasOwnProperty($validationType))
                                    {
                                        $validationMessage = customMessageForField[$validationType];
                                    }
                                    else
                                    {
                                        $validationMessage = validationLanguage[$validationType];
                                    }
                                }
                                else
                                {
                                    $validationMessage = validationLanguage[$validationType];
                                }
                            }
                            else
                            {
                                $fieldSuccessfullyValidated = true;
                            }
                        }
                        else if($.isFunction($.fn[$cleanValidationType]))
                        {
                            if($parametersToFunction != undefined)
                            {
                                // we split the parameters with comma(,) so that we can pass it to our function and convert to array
                                var $splitParametersToFunction = $parametersToFunction[1].replace("[","").replace("]","").split(',');
                                var $callFunction = $.fn[$cleanValidationType].call(this, $splitParametersToFunction);
                                
                                if(! $callFunction)
                                {
                                    $addToValidationObject = true;
                                    
                                    // now we check whether the validationMessage has been defined in the function or not.
                                    // If yes, we load it here else we load the message from our language object
                                    if($validationMessage == "")
                                    {
                                        $validationMessage = validationLanguage[$cleanValidationType];
                                    
                                        for($i = 0; $i < $splitParametersToFunction.length; $i++)
                                        {
                                            $validationMessage = $validationMessage.replace('{param}', $splitParametersToFunction[$i]);
                                        }
                                    }
                                }
                                else
                                {
                                    $fieldSuccessfullyValidated = true;
                                }
                            }
                            else
                            {
                                if(! $.fn[$cleanValidationType].call(this))
                                {
                                    $addToValidationObject = true;
                                    $validationMessage = validationLanguage[$cleanValidationType];
                                }
                                else
                                {
                                    $fieldSuccessfullyValidated = true;
                                }
                            }
                        }
                    }
                    
                    // if error has been found, we added it to the validation object to use further.
                    if($addToValidationObject)
                    {
                        if($validationMessage != "")
                        {
                            if(typeof $field.attr('data-label') !== typeof undefined && $field.attr('data-label') !== false)
                            {
                                $validationMessage = $validationMessage.replace('{field}', $field.attr('data-label'));
                            }
                            
                            validationObject[$name] = $validationMessage;
                        }
                    }
                }
                
                // if no errors found in the field, we load the success callback
                if($fieldSuccessfullyValidated)
                {
                    if(formValidationOptions.onSuccess.hasOwnProperty($name))
                    {
                        formValidationOptions.onSuccess[$name].call(this);
                    }
                }
                
                // disable switching on to next field if current field is not validated
                if(! formValidationOptions.enableSwitchingToNext)
                {
                    $field.keydown(function(e){
                        var keycode = (e.keyCode ? e.keyCode : e.which);
                        
                        // if switching to next field, we validate. If not valid, we stop and force the user to fill valid data
                        if(keycode == '9')
                        {
                            if(! e.shiftKey)
                            {
                                $.fn.applyValidation();
                                return false;
                            }
                        }
                    });
                }
                else
                {
                    $field.keydown(function(e){
                        var keycode = (e.keyCode ? e.keyCode : e.which);
                        
                        // if switching to next field, we remove the class error.
                        if(keycode == '9')
                        {
                            if(formValidationOptions.showFieldErrorClass && $field.hasClass(formValidationOptions.fieldErrorClass))
                            {
                                $field.removeClass(formValidationOptions.fieldErrorClass);
                            }
                        }
                    });
                }
                
                // we set the field success
                if(! validationObject.hasOwnProperty($name) && formValidationOptions.showFieldSuccessClass)
                {
                    $field.addClass(formValidationOptions.fieldSuccessClass);
                }
            });
            
            if(Object.keys(validationObject).length)
            {
                var validationHTML = "";
                
                if(formValidationOptions.showPopupErrorOneByOne)
                {
                    // we set the left and top property to the div according to size of elements.
                    var $field = $('*[name='+Object.keys(validationObject)[0]+']');
                    var setLeft = 0;
                    var setTop = 0;
                    
                    if($("."+formValidationOptions.wrapperClass).is(":visible"))
                    {
                        $("."+formValidationOptions.wrapperClass).remove();
                    }
                    
                    validationHTML = '<div class="'+formValidationOptions.wrapperClass+'" style="display:none;left:'+setLeft+'px;top:'+setTop+'px;">';
                    
                    if($field.attr('type') == 'checkbox' || $field.attr('type') == 'radio')
                    {
                        validationHTML += '<span class="centered"></span>';
                    }
                    else
                    {
                        validationHTML += '<span></span>';
                    }
                    
                    validationHTML += '<p>'+validationObject[Object.keys(validationObject)[0]]+'</p>';
                    validationHTML += '</div>';
                    
                    if(formValidationOptions.showFieldErrorClass)
                    {
                        $field.addClass(formValidationOptions.fieldErrorClass);
                        $field.focus();
                    }
                    
                    $('body').append(validationHTML);
                    $('.'+formValidationOptions.wrapperClass).fadeIn();
                    
                    if($field.attr('type') == 'checkbox' || $field.attr('type') == 'radio')
                    {
                        setLeft = $field.offset().left - ($('.'+formValidationOptions.wrapperClass).width() / 2) - 2;
                        setTop = $field.offset().top - ($('.'+formValidationOptions.wrapperClass).height()*2.2);
                    }
                    else
                    {
                        setLeft = $field.offset().left + $field.outerWidth() - 31;
                        setTop = $field.offset().top - ($('.'+formValidationOptions.wrapperClass).height()*0.75);
                    }
                    
                    $('.'+formValidationOptions.wrapperClass).css({
                        "left" : setLeft,
                        "top" : setTop
                    });
                    
                    $('.'+formValidationOptions.wrapperClass+" span.centered").css({
                        "left" : $('.'+formValidationOptions.wrapperClass).width()/2
                    });
                    
                    // scroll till the first error visible
                    if(formValidationOptions.scrollToFirstError)
                    {
                        $('html,body').animate({
                            scrollTop: $('.'+formValidationOptions.wrapperClass).offset().top
                        });
                    }
                }
                else if(formValidationOptions.showPopupErrorAll)
                {
                    for(var $i = 0; $i < Object.keys(validationObject).length; $i++)
                    {
                        // we set the left and top property to the div according to size of elements.
                        var $field = $('*[name='+Object.keys(validationObject)[$i]+']');
                        var setLeft = 0;
                        var setTop = 0;
                        
                        if($("#"+formValidationOptions.showPopupErrorAllId+$i).is(":visible"))
                        {
                            $("#"+formValidationOptions.showPopupErrorAllId+$i).remove();
                        }
                        
                        validationHTML = '<div class="'+formValidationOptions.wrapperClass+'" id="'+formValidationOptions.showPopupErrorAllId+$i+'" style="display:none;left:'+setLeft+'px;top:'+setTop+'px;">';
                    
                        if($field.attr('type') == 'checkbox' || $field.attr('type') == 'radio')
                        {
                            validationHTML += '<span class="centered"></span>';
                        }
                        else
                        {
                            validationHTML += '<span></span>';
                        }
                        
                        validationHTML += '<p>'+validationObject[Object.keys(validationObject)[$i]]+'</p>';
                        validationHTML += '</div>';
                        
                        if(formValidationOptions.showFieldErrorClass)
                        {
                            $field.addClass(formValidationOptions.fieldErrorClass);
                            $field.focus();
                        }
                        
                        $('body').append(validationHTML);
                        $("#"+formValidationOptions.showPopupErrorAllId+$i).fadeIn();
                        
                        if($field.attr('type') == 'checkbox' || $field.attr('type') == 'radio')
                        {
                            setLeft = $field.offset().left - ($('.'+formValidationOptions.wrapperClass).width() / 2) - 2;
                            setTop = $field.offset().top - ($('.'+formValidationOptions.wrapperClass).height()*2.2);
                        }
                        else
                        {
                            setLeft = $field.offset().left + $field.outerWidth() - 31;
                            setTop = $field.offset().top - ($('.'+formValidationOptions.wrapperClass).height()*0.75);
                        }
                        
                        $("#"+formValidationOptions.showPopupErrorAllId+$i).css({
                            "left" : setLeft,
                            "top" : setTop
                        });
                        
                        $("#"+formValidationOptions.showPopupErrorAllId+$i+" span.centered").css({
                            "left" : $('.'+formValidationOptions.wrapperClass).width()/2
                        });
                        
                        // scroll till the first error visible
                        if(formValidationOptions.scrollToFirstError)
                        {
                            $('html,body').animate({
                                scrollTop: $("#"+formValidationOptions.showPopupErrorAllId+$i).offset().top
                            });
                        }
                    }
                }
                else
                {
                    if($("."+formValidationOptions.allErrorsClass).is(":visible"))
                    {
                        $("."+formValidationOptions.allErrorsClass).remove();
                    }
                    
                    validationHTML += '<div class="'+formValidationOptions.allErrorsClass+'">';
                    
                    if(formValidationOptions.enableAdditionalTextForErrors)
                    {
                        validationHTML += '<p>'+formValidationOptions.additionalTextForErrors+'</p>';
                    }
                    
                    validationHTML += '<ol>';
                    
                    for(var i = 0; i < Object.keys(validationObject).length; i++)
                    {
                        validationHTML += '<li>';
                        validationHTML += validationObject[Object.keys(validationObject)[i]];
                        validationHTML += '</li>';
                    }
                    
                    validationHTML += '</ol>';
                    validationHTML += '</div>';
                    
                    if(formValidationOptions.appendAllErrorsTo != null)
                    {
                        if($("."+formValidationOptions.appendAllErrorsTo).length)
                        {
                            $("."+formValidationOptions.appendAllErrorsTo).append(validationHTML);
                        }
                        else
                        {
                            // throw error if element not found
                            console.error("class '"+formValidationOptions.appendAllErrorsTo+"' not found");
                        }
                    }
                    else if(formValidationOptions.prependAllErrorsTo != null)
                    {
                        if($("."+formValidationOptions.prependAllErrorsTo).length)
                        {
                            $("."+formValidationOptions.prependAllErrorsTo).prepend(validationHTML);
                        }
                        else
                        {
                            // throw error if element not found
                            console.error("class '"+formValidationOptions.prependAllErrorsTo+"' not found");
                        }
                    }
                    else if(formValidationOptions.htmlAllErrorsTo != null)
                    {
                        if($("."+formValidationOptions.htmlAllErrorsTo).length)
                        {
                            $("."+formValidationOptions.htmlAllErrorsTo).html(validationHTML);
                        }
                        else
                        {
                            // throw error if element not found
                            console.error("class '"+formValidationOptions.htmlAllErrorsTo+"' not found");
                        }
                    }
                    else
                    {
                        $this.prepend(validationHTML);
                    }
                }
            }
            else
            {
                $this.unbind('submit');
                $this.submit();
            }
        }
        
        /***********************************************************************************************/
        // This is the auto resize function, the errors will be readjusted according to window resize
        /***********************************************************************************************/
        $.fn.autoResizeValidation = function(){
            // if formValidationOptions.showPopupErrorOneByOne is enabled
            if(formValidationOptions.showPopupErrorOneByOne)
            {
                // if error box is visible
                if($('.'+formValidationOptions.wrapperClass).is(":visible"))
                {
                    // we have the find the field with the error.
                    // we can find this with the validationObject. The first key is the field with error
                    if(Object.keys(validationObject).length)
                    {
                        // we set the left and top property to the div according to size of elements.
                        var $field = $('*[name='+Object.keys(validationObject)[0]+']');
                        var setLeft = 0;
                        var setTop = 0;
                        
                        if($field.attr('type') == 'checkbox' || $field.attr('type') == 'radio')
                        {
                            setLeft = $field.offset().left - ($('.'+formValidationOptions.wrapperClass).width() / 2) - 2;
                            setTop = $field.offset().top - ($('.'+formValidationOptions.wrapperClass).height()*2.2);
                        }
                        else
                        {
                            setLeft = $field.offset().left + $field.outerWidth() - 31;
                            setTop = $field.offset().top - ($('.'+formValidationOptions.wrapperClass).height()*0.75);
                        }
                        
                        $('.'+formValidationOptions.wrapperClass).css({
                            "left" : setLeft,
                            "top" : setTop
                        });
                        
                        $('.'+formValidationOptions.wrapperClass+" span.centered").css({
                            "left" : $('.'+formValidationOptions.wrapperClass).width()/2
                        });
                        
                        // scroll till the first error visible
                        if(formValidationOptions.scrollToFirstError)
                        {
                            $('html,body').animate({
                                scrollTop: $('.'+formValidationOptions.wrapperClass).offset().top
                            });
                        }
                    }
                }
            }
            else if(formValidationOptions.showPopupErrorAll)
            {
                for(var $i = 0; $i < Object.keys(validationObject).length; $i++)
                {
                    // we set the left and top property to the div according to size of elements.
                    var $field = $('*[name='+Object.keys(validationObject)[$i]+']');
                    var setLeft = 0;
                    var setTop = 0;
                    
                    if($field.attr('type') == 'checkbox' || $field.attr('type') == 'radio')
                    {
                        setLeft = $field.offset().left - ($('.'+formValidationOptions.wrapperClass).width() / 2) - 2;
                        setTop = $field.offset().top - ($('.'+formValidationOptions.wrapperClass).height()*2.2);
                    }
                    else
                    {
                        setLeft = $field.offset().left + $field.outerWidth() - 31;
                        setTop = $field.offset().top - ($('.'+formValidationOptions.wrapperClass).height()*0.75);
                    }
                    
                    $("#"+formValidationOptions.showPopupErrorAllId+$i).css({
                        "left" : setLeft,
                        "top" : setTop
                    });
                    
                    $("#"+formValidationOptions.showPopupErrorAllId+$i+" span.centered").css({
                        "left" : $('.'+formValidationOptions.wrapperClass).width()/2
                    });
                    
                    // scroll till the first error visible
                    if(formValidationOptions.scrollToFirstError)
                    {
                        $('html,body').animate({
                            scrollTop: $("#"+formValidationOptions.showPopupErrorAllId+$i).offset().top
                        });
                    }
                }
            }
        }
        
        /*******************************************************************************************************************/
        /*
        |
        | Here we load the validation type functions that cannot be loaded via regex object
        |
        */
        
        /*
         * function name: is_checked
         * description: to check whether the element is checked or not
         * return: bool
        */
        $.fn.is_checked = function(){
            return (! $(this).is(":checked")) ? false : true;
        }
        
        /*
         * function name: min_length
         * param: $min_length (provide a length to match with)
         * description: to check whether value length is at least the provided $min_length
         * return: bool
        */
        $.fn.min_length = function($min_length){
            return ($(this).val().length < $min_length) ? false : true;
        }
        
        /*
         * function name: max_length
         * param: $max_length (provide a length to match with)
         * description: to check whether value length exceeds the provided $max_length
         * return: bool
        */
        $.fn.max_length = function($max_length){
            return ($(this).val().length > $max_length) ? false : true;
        }
        
        /*
         * function name: exact_length
         * param: $exact_length (provide a length to match with)
         * description: to check whether value length is exactly the same as $exact_length
         * return: bool
        */
        $.fn.exact_length = function($exact_length){
            return ($(this).val().length != $exact_length) ? false : true;
        }
        
        /*
         * function name: matches
         * param: $field_name (name of the field to match with)
         * description: to check whether value exactly matches the $field_name value
         * return: bool
        */
        $.fn.matches = function($field_name){
            $field_name = $("input[name="+$field_name+"]");
            
            if($(this).val() != $($field_name).val())
            {
                $validationMessage = validationLanguage.matches;
                
                if($($field_name).attr("data-label") != undefined)
                {
                    $validationMessage = $validationMessage.replace("{param}", $($field_name).attr("data-label"));
                }
                else
                {
                    $validationMessage = $validationMessage.replace("{param}", $field_name);
                }
                
                return false;
            }
            
            return true;
        }
        
        /*
         * function name: differs
         * param: $field_name (name of the field to match with)
         * description: to check whether value differs from the $field_name value
         * return: bool
        */
        $.fn.differs = function($field_name){
            $field_name = $("input[name="+$field_name+"]");
            
            if($(this).val() == $($field_name).val())
            {
                $validationMessage = validationLanguage.differs;
                
                if($($field_name).attr("data-label") != undefined)
                {
                    $validationMessage = $validationMessage.replace("{param}", $($field_name).attr("data-label"));
                }
                else
                {
                    $validationMessage = $validationMessage.replace("{param}", $field_name);
                }
                
                return false;
            }
            
            return true;
        }
    }
})(jQuery);