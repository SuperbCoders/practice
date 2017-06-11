this.application.factory('jqueryDialogService', function() {

  //constructor
  function jqueryDialogService(scope, element_id, parameters) {
    this._scope = scope;
    this._element_id = element_id;
    this._parameters = parameters;
    this._popup = null;

    this._initialize()
  }

  //wherever you'd reference the scope
  jqueryDialogService.prototype._initialize = function() {

    // Because service destroyed sooner than $on.$destroy called.
    var element_id = this._element_id;

    this._scope.$on('$destroy', function () {
      // console.log('destroy 2');
      // $('.ui-dialog ' + element_id).dialog('destroy');
      // $(element_id).dialog('destroy');
      // console.log(element_id);
      // console.log($(element_id).length);
      $(element_id).dialog('destroy').remove();
      // console.log('new_saubrecord_item ' + $('.new_saubrecord_item').length);
    });

    this._popup = $(this._element_id).dialog(this._parameters);

    // this._scope['someVar'] = 5;

  }

  jqueryDialogService.prototype.popup = function() {
    return this._popup;
  }

  return jqueryDialogService;

});
