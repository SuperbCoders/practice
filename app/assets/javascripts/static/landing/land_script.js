var header = $('.header'), doc = $(document),
    browserWindow = $(window);

$(function ($) {

    header = $('.header');
    doc = $(document);
    browserWindow = $(window);

    browserWindow.on('scroll', function () {
        header.toggleClass('_white', doc.scrollTop() > header.outerHeight());
    });

});

