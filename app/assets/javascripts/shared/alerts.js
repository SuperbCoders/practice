this.application.factory('Alerts', [
  'Notification', function(Notification) {
    var Alerts;
    Alerts = (function() {
      var alerts;

      function Alerts() {}

      alerts = [];

      Alerts.prototype.alerts = function() {
        return alerts;
      };

      Alerts.prototype.clear_all_alerts = function() {
        return alerts.length = 0;
      };

      Alerts.prototype.delete_alert = function(alert) {
        alerts.splice(alerts.indexOf(alert), 1);
        return true;
      };

      Alerts.prototype.file_deleted = function(base64_file) {
        var alert;
        alert = {
          message: "Файл " + base64_file.filename + " удален",
          file: base64_file,
          alert_type: 'file',
          action: 'add'
        };
        alerts.push(alert);
        return this.show_success(alert.message);
      };

      Alerts.prototype.file_loaded = function(base64_file) {
        var alert;
        alert = {
          message: "Файл " + base64_file.filename + " загружен",
          file: base64_file,
          alert_type: 'file',
          action: 'add'
        };
        alerts.push(alert);
        return this.show_success(alert.message);
      };

      Alerts.prototype.show_success = function(message) {
        return Notification.success(message, {
          positionY: 'top',
          positionX: 'right'
        });
      };

      Alerts.prototype.show_error = function(message) {
        return Notification.error(message, {
          positionY: 'top',
          positionX: 'right'
        });
      };

      Alerts.prototype.success = function(message) {
        var alert;
        alert = {
          message: message,
          alert_type: 'success'
        };
        alerts.push(alert);
        return Notification.success(message, {
          positionY: 'top',
          positionX: 'right'
        });
      };

      Alerts.prototype.error = function(message) {
        var alert;
        alert = {
          message: message,
          alert_type: 'error'
        };
        alerts.push(alert);
        return Notification.error(message, {
          positionY: 'top',
          positionX: 'right'
        });
      };

      Alerts.prototype.server_error = function() {
        return this.error('Не удалось отправить запрос!');
      };

      Alerts.prototype.messages = function(messages) {
        var alert, i, len, results;
        if (messages) {
          results = [];
          for (i = 0, len = messages.length; i < len; i++) {
            alert = messages[i];
            results.push(this.success(alert));
          }
          return results;
        }
      };

      Alerts.prototype.errors = function(errors) {
        var alert, i, len, results;
        if (errors) {
          results = [];
          for (i = 0, len = errors.length; i < len; i++) {
            alert = errors[i];
            results.push(this.error(alert));
          }
          return results;
        }
      };

      return Alerts;

    })();
    return new Alerts();
  }
]);
