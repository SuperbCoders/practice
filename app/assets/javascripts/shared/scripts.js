window.menu_open = function() {
  $("html").addClass('menu_open');
};

function formatPhone(phone){
  if (typeof phone === 'string') {
    return phone.replace(/(.)(...)(...)(..)(..)/, '+$1 ($2) $3-$4-$5')
  }
}

function formatDateAppointment(date) {
  function date_format(date) {
    var monts = {
      "January": "января",
      "February": "февраля",
      "March": "марта",
      "April": "апреля",
      "May": "мая",
      "June": "июня",
      "July": "июля",
      "August": "августа",
      "September": "сентября",
      "October": "октября",
      "November": "ноября",
      "December": "декабря"
    }
    return date.format('DD') + ' ' + monts[date.locale('en').format('MMMM')]
  }

  return date_format(date) + ', в ' + date.format('HH:mm');
}

function card_color_chosen(elem) {
  $(elem).chosen({
    width: '100%',
    disable_search_threshold: 3
  }).on('chosen:showing_dropdown', function(evt, params) {
    var firedEl, niceScrollBlock;
    firedEl = $(evt.currentTarget);
    niceScrollBlock = firedEl.next('.chzn-container').find('.chzn-results');
    if (niceScrollBlock.getNiceScroll().length) {
      return niceScrollBlock.getNiceScroll().resize().show();
    } else {
      niceScrollBlock.niceScroll({
        cursorwidth: 4,
        cursorborderradius: 2,
        cursorborder: 'none',
        bouncescroll: false,
        autohidemode: false,
        horizrailenabled: false,
        railsclass: firedEl.data('rails_class'),
        railpadding: {
          top: 0,
          right: 0,
          left: 0,
          bottom: 0
        }
      });
    }
  });
}
