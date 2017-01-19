window.menu_open = function() {
  // console.log('menu_open');
  $("html").addClass('menu_open');
};

function formatPhone(phone){
  if (typeof phone === 'string') {
    return phone.replace(/(.)(...)(...)(..)(..)/, '+$1 ($2) $3-$4-$5')
  }
}

