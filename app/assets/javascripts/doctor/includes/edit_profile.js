var profile_tabs,
    open_chzn,
    tabHeaderSpacer,
    tabHeader;

$(function ($) {

    var tabBlock = $('.tabBlock');

    tabHeader = $('.tabHeader');
    tabHeaderSpacer = $('.tabHeaderSpacer');

    // throw('swiper need to initialize on live basis too?');
    console.log('swiper need to initialize on live basis too?');

    new Swiper('.tabListScroller', {
        setWrapperSize: true,
        slidesPerView: 'auto',
        paginationClickable: true,
        spaceBetween: 0,
        freeMode: true,
        wrapperClass: 'tab_list',
        slideClass: 'tab_item',
        onInit: function (swiper) {
            console.log('swiper onInit');
            profile_tabs = tabBlock.tabs({
                active: 0,
                tabContext: tabBlock.data('tab-context'),
                activate: function (e, u) {

                    var tab = u.newTab, tabs = tab.parents('.tab_list'),
                        tabCursor = tabs.find('.tab_active_cursor');

                    tabCursor.css({
                        width: tab.find('.tab_link').width(),
                        left: tab.offset().left - tabs.offset().left
                    });
                },
                create: function (event, ui) {
                    var tab = ui.tab, tabs = tab.parents('.tab_list'),
                        tabCursor = $('<li class="tab_active_cursor" />');

                    tabCursor.css({
                        width: tab.find('.tab_link').width(),
                        left: tab.offset().left - tabs.offset().left
                    });

                    tabs.append(tabCursor);

                }
            });
        }
    });

    // one time bc it like live

    body_var.delegate('.rmRowBtn', 'click', function () {
        console.log('edit_profile delegate .rmRowBtn');
        $(this).closest('.form_row').remove();
        return false;
    });

    // one time bc it like live

    body_var.delegate('.cloneRowBtn', 'click', function () {
        console.log('edit_profile delegate .cloneRowBtn');
        var row = $(this).closest('.form_row'), clone = row.clone();

        row.after(clone);

        clone.find('input').val('');
        clone.find('label').text('');
        clone.find('.add_row_btn').removeClass('cloneRowBtn add_row_btn').addClass('rmRowBtn rm_row_btn');
        clone.find('.chzn-container').remove();

        init_chosen();

        return false;
    });

    var inputEvents = 'keyup,keypress,focus,blur,change'.split(',');

    // wtf i this

    //
    // console.log(".socPrefix doesn't work reliably?");

    // for (var i in inputEvents) $('.socPrefix').on(inputEvents[i], function (e) {

    //     //console.log(e.shiftKey, e.metaKey, e.altKey, e.ctrlKey, e);

    //     if (!(e.shiftKey || e.altKey || e.ctrlKey)) {
    //         var inp = $(this), inp_val = inp.val(), inp_prefix = inp.attr('data-prefix');
    //         var expr = new RegExp('^' + inp_prefix, 'ig');

    //         inp_val = inp_val.replace(expr, '');
    //         inp_val = inp_val.replace(/ /g, '');

    //         inp.val(inp_prefix + inp_val);
    //     }
    // });

    init_chosen();

    fix_tab_header();

});

function init_chosen() {

    console.log('init_chosen2');

    if ($('.chosen-select').length) {

        // one time?

        body_var
            .delegate('.chosen_multiple_v1 .extra_control', 'click', function (e) {
                console.log('chosen_extra_control_click');
                var firedEl = $(this);

                e.preventDefault();

                var chzn_container = firedEl.closest('.chzn-container '),
                    option_ind = firedEl.parents('.chzn_item').attr('data-option-array-index') * 1;

                firedEl.closest('.chzn-container').prev('.chosen-select')
                    .find('option[value=' + option_ind + ']').removeAttr('selected');

                updateDaysRow(chzn_container.prev('.chosen-select').trigger('chosen:updated'));

                return false;

            });

        // one time bc selector before 'on' ?

        $('.chosen-select')
            .on('chosen:ready', function (evt, params) {

                if (params.chosen.is_multiple) {
                    $(params.chosen.container).find('.chzn-choices').append($('<li class="chzn-choices-arrow" />'));
                }

            })
            .on('chosen:showing_dropdown', function (evt, params) {

                open_chzn = params.chosen;

                var firedEl = $(evt.currentTarget);

                var niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results');

                if (niceScrollBlock.getNiceScroll().length) {
                    niceScrollBlock.getNiceScroll().resize().show();
                } else {
                    niceScrollBlock.niceScroll({
                        //cursorcolor : "#5c9942",
                        cursorwidth: 4,
                        cursorborderradius: 2,
                        cursorborder: 'none',
                        bouncescroll: false,
                        autohidemode: false,
                        horizrailenabled: false,
                        railsclass: firedEl.data('rails_class'),
                        railpadding: {top: 0, right: 0, left: 0, bottom: 0}
                    });
                }

            })
            .on('chosen:hiding_dropdown', function (evt, params) {

                open_chzn = null;

                var firedEl = $(evt.currentTarget);

                var niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results');

                niceScrollBlock.getNiceScroll().hide();

                //if (firedEl.parents('.form_validate').length) firedEl.validationEngine('validate');

            })
            .change(function (e) {
                updateDaysRow($(e.target));
            }).chosen({
                autohide_results_multiple: false,
                allow_single_deselect: true,
                width: "100%",
                className: "form_o_b_item form_o_b_value_edit_mode"
            });

    }
}

function updateDaysRow(slct) {
    var slct_val = slct.val(), chzn_container = slct.next('.chzn-container').find('.chzn-choices'), days = '';

    if (slct_val) {
        for (var i = 0; i < slct_val.length; i++) {
            days += ',' + slct.find('option[value=' + slct_val[i] + ']').attr('data-short')
        }

        days = days.replace(/^,/i, '');

        if (chzn_container.find('.chzn_rzlts').length) {
            chzn_container.find('.chzn_rzlts').text(days);
        } else {
            chzn_container.prepend($('<li class="chzn_rzlts" />').text(days));
        }
    } else {
        chzn_container.find('.chzn_rzlts').remove();
    }

}

function fix_tab_header() {

    // console.log('fix_tab_header');
    if (doc.scrollTop() > 0) {
        tabHeaderSpacer.css('height', tabHeader.height());
        tabHeader.addClass('tab_header_fixed');
    } else {
        tabHeader.removeClass('tab_header_fixed');
        tabHeaderSpacer.css('height', tabHeader.height());
    }

}

// one time bc window is still here

$(window).on('scroll', function () {
    fix_tab_header();
}).on('resize', function () {
    fix_tab_header();
});
