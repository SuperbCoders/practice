var header = $('.header'), doc = $(document),
    browserWindow = $(window);
var toggleDialogs;

$(function ($) {

    header = $('.header');
    doc = $(document);
    browserWindow = $(window);

    browserWindow.on('scroll', function () {
        header.toggleClass('_white', doc.scrollTop() > header.outerHeight());
    });

    $('.scrollTo').on('click', function () {
        var firedEl = $(this);

        console.log($((firedEl).attr('href')).offset().top);
        
        docScrollTo($((firedEl).attr('href')).offset().top - header.outerHeight(), 800);

        return false;
    });

    //----------

    var inputEvents = 'keyup,keypress,focus,blur,change'.split(',');

    for (var i in inputEvents) $('.checkEmpty').on(inputEvents[i], function (e) {
        var checkBlock = $(this).closest('.checkEmptyBlock'),
            checkArr = checkBlock.find('.checkEmpty'), isReady = true;

        for (var j = 0; j < checkArr.length; j++) {
            if (!checkArr.eq(j).val().length) {
                isReady = false;
                break;
            }
        }

        if (isReady) {
            checkBlock.find('.disableEmpty').removeClass('disabled_btn_gray');
            checkBlock.find('.disableEmpty').addClass('yellow_black_btn');
        } else {
            checkBlock.find('.disableEmpty').addClass('disabled_btn_gray');
            checkBlock.find('.disableEmpty').removeClass('yellow_black_btn');
        }

    });

    //----------

    var url = window.location.href;
    var login_form = $('#login_form').dialog({
        autoOpen: false,
        modal: true,
        width: 400,
        dialogClass: "dialog_v1 no_close_mod login_form"
    });
    if (url.indexOf('#login') != -1) {
        login_form.dialog('open');
    }

    //----------

    function signIn(e) {

        function postRequest(email, password) {

            $.ajax({
                headers: {
                    'X-Transaction': 'SignIn Post',
                    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
                },
                url: "/auth/sign_in",
                type: "POST",
                dataType: "json",
                data: {
                    "doctor": { "email": email, "password": password, "remember_me": 1 }
                },
                success: function (msg) {
                    window.location.replace('/doctor');
                },
                error: function (msg) {
                    console.log(msg);
                }
            });
        }
        e.preventDefault();
        var email = $('#sign_in_email').val();
        var password = $('#sign_in_password').val();
        postRequest(email,  password);

    }
    $('#sign_in_button').on('click', signIn);

    //----------

    var recovery_form = $('#recovery_form').dialog({
        autoOpen: false,
        modal: true,
        width: 400,
        dialogClass: "dialog_v1 no_close_mod login_form",
    });

    var recovery_success_form = $('#recovery_success_form').dialog({
        autoOpen: false,
        modal: true,
        width: 400,
        dialogClass: "dialog_v1 no_close_mod login_form",
    });

    function openSignInDialog(e) {
        e.preventDefault();
        recovery_success_form.dialog('close');
        login_form.dialog('open');
    }
    $('#recovery_success_form button').on('click', openSignInDialog);

    toggleDialogs = function(e) {
        login_form.dialog('isOpen') ? login_form.dialog('close') : login_form.dialog('open');
        recovery_form.dialog('isOpen') ? recovery_form.dialog('close') : recovery_form.dialog('open');
    };

    function recoveryPassword(e) {

        function toggleRecoveryDialogs() {
            recovery_form.dialog('close');
            recovery_success_form.dialog('open');
        }

        function postRequest(email) {

            $.ajax({
                headers: {
                    'X-Transaction': 'Recovery Post',
                    'X-CSRF-Token': $('meta[name="csrf-token"]').attr('content')
                },
                url: "/auth/password",
                type: "POST",
                dataType: "json",
                data: {
                    "doctor": { "email": email }
                },
                success: function (msg) {
                    console.log(msg);
                    toggleRecoveryDialogs();
                },
                error: function (msg) {
                    console.log(msg);
                }
            });
        }

        e.preventDefault();
        var email = $('#recovery_email').val();
        postRequest(email);
    }
    $('#recovery_button').on('click', recoveryPassword);

});

function docScrollTo(pos, speed, callback) {

    $('html,body').animate({'scrollTop': pos}, speed, function () {
        if (typeof(callback) == 'function') {
            callback();
        }
    });
}
