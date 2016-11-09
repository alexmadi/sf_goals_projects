function formValidation() {
    var isFormValid = true,
        $fieldsToEmptyValidate = $('#pTitle, #pSKU'),
        $priceField = $('#pSKU2'),
        availabilityContent = '';

    $("#add-product-form").submit(function(e) {
        e.preventDefault();
    });

    function emptyFieldValidation(objectInstance) {
        var fieldValue = $(objectInstance).val();

        if ((fieldValue.length == '') || (fieldValue.length < 2)){
            $(objectInstance).parent().next().addClass('active');
            isFormValid = false;
        } else {
            $(objectInstance).parent().next().removeClass('active');
            isFormValid = true;
        }
    }

    $fieldsToEmptyValidate.focusout(function() {
        emptyFieldValidation(this);
    });

    $fieldsToEmptyValidate.focusin(function() {
        if ($(this).parent().next().hasClass('active')) {
            $(this).parent().next().removeClass('active');
        }
    });

    function priceFieldValidation(objectInstance) {
        var priceFieldValue = $(objectInstance).val(),
            regexpression = /^\d+\.?\.[0-9][0-9]$/;

        regexpression.test(priceFieldValue);

        if (regexpression.test(priceFieldValue)) {
          isPriceFieldValid = true;
        } else {
          isPriceFieldValid = false;
        }
        if (priceFieldValue % 1 == 0) {
            isPriceFieldValid = true;
        }
        if (isPriceFieldValid == false) {
            $(objectInstance).parent().next().next().addClass('active');
            isFormValid = false;
        } else if (priceFieldValue.length == '') {
            $(objectInstance).parent().next().addClass('active');
            isFormValid = false;
        } else {
            $(objectInstance).parent().next().removeClass('active');
            $(objectInstance).parent().next().next().removeClass('active');
            isFormValid = true;
        }
    }

    $priceField.focusout(function() {
        priceFieldValidation(this);
    });

    function checkAvailability() {
        var isAvailable = false;

        if ($('.availability input').is(':checked')) {
            isAvailable = true;
            availabilityContent = 'In-stock';
        } else {
            isAvailable = false;
            availabilityContent = 'Out-of-stock';
        }
    }

    function createProductRow() {
        var pTitle = document.getElementById('pTitle').value,
            pSKU   = document.getElementById('pSKU').value,
            pSKU2  = document.getElementById('pSKU2').value,
            pDesc  = document.getElementById('pDesc').value;

         $('.table tr:last').after(
            "<tr><th>" + pSKU + "</th>" +
            "<td>" + pTitle + "</td>" +
            "<td>" + pSKU2 + "$</td>" +
            "<td>" + pDesc + "</td>" +
            "<td>" + availabilityContent + "</td></tr>"
        );
    }

    function cleanUpFields() {
        $("input, textarea").val("");
        $("input[type=checkbox]").removeAttr('checked');
        $('.required').removeClass('active');
    }

    $("#addToCart").click(function () {
        $fieldsToEmptyValidate.each(function() {
            emptyFieldValidation(this);
        });

        priceFieldValidation($priceField);

        if (isFormValid == true) {
            checkAvailability()
            createProductRow();
            cleanUpFields();
        }
    });
};

formValidation();