var header = $('.header'), doc = $(document),
    browserWindow = $(window);

$(function ($) {

    header = $('.header');
    doc = $(document);
    browserWindow = $(window);

    browserWindow.on('scroll', function () {
        header.toggleClass('_white', doc.scrollTop() > header.outerHeight());
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
    if (url.indexOf('?login') != -1) {
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
                    "doctor": {"email": email, "password": password, "remember_me": 1}
                },
                success: function (msg) {
                    window.location.replace('/doctor/cabinet');
                },
                error: function (msg) {
                    console.log("msg");
                }
            });
        }
        e.preventDefault();
        var email = $('#sign_in_email').val();
        var password = $('#sign_in_password').val();
        postRequest(email,  password);

    }
    $('#sign_in_button').on('click', signIn);
});

