this.application.factory('Alerts', [
  '$rootScope', 'Notification', 'Resource', 'Resources', function($rootScope, Notification, Resource, Resources) {
    var Alerts;

    Alerts = (function() {
      var alerts;
      alerts = [];
      function Alerts() {}

      Resources('/doctor/notifications', null, [{method: 'GET', isArray: true}]).query().$promise.then(function(response) {
        for (i = 0, len = response.length; i < len; i++) {
          var alert;
          alert = response[i];
          alerts.push(response[i]);
        }
      });

      Alerts.prototype.mark_all_readed = function() {
        console.log('mark_all_readed');
        Resources('/doctor/notifications', null, [{method: 'POST', name: 'mark_all_readed', isArray: true}]).mark_all_readed().$promise.then(function(response) {
          for (i = 0, len = alerts.length; i < len; i++) {
            alerts[i].unreaded = false;
          }
        });
      }

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
        alerts.unshift(alert);
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
        alerts.unshift(alert);
        return this.show_success(alert.message);
      };

      Alerts.prototype.notification = function(alert) {
        if (!(alert.notification_type == 'visit_end')) {
          alerts.unshift(alert);
          this.show_success(alert.message);
        }
        console.log('notification');
        if (alert.notification_type == 'visit_end' || alert.notification_type == 'visit_soon') {
          console.log('broadcast ' + alert.notification_type);
          $rootScope.$broadcast('notification', alert);
        }
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
        alerts.unshift(alert);
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
            this.error(alert);
          }
          return results;
        }
      };

      return Alerts;

    })();
    return new Alerts();
  }
]);
