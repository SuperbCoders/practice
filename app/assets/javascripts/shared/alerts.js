this.application.factory('Alerts', [
  'Notification', 'Resource', 'Resources', function(Notification, Resource, Resources) {
    var Alerts;

    // Notifications2 = Resources('/doctor/notifications/:id', {name: "@name"});		
    // var Notification2 = [
    //   'Resources', function(Resources) {
    //     return Resources('/doctor/notifications/:id', {
    //       id: '@id'
    //     });
    //   }
    // ];

    Alerts = (function() {
      var alerts;

      alerts = [];

      function Alerts() {}

      function getNotifyMessageHtml(alert){
        // console.log(alert);
        // console.log(alert.notification_type);
        if (alert.notification_type == 'visit_created') {
          return 'Новая неподтвержденная запись на ' + (alert.visit && alert.visit.start);
        } else if (alert.notification_type == 'visit_canceled') {
          return 'Отмена';
        } else {
          return 'Неизвестное событие от ' + alert.created_at;
        }
      }

      Resources('/doctor/notifications', null, [{method: 'GET', isArray: true}]).query().$promise.then(function(response) {
        for (i = 0, len = response.length; i < len; i++) {
          var alert;
          alert = response[i];
          alert.message = getNotifyMessageHtml(alert);
          alerts.push(response[i]);
        }
      });

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

      // Alerts.prototype.getNotifyMessageHtml = function(alert) {
      //   return ' ' + alert.message + ' 1';
      // }

      Alerts.prototype.notification = function(alert) {
        // var alert;
        // alert = {
        //   message: this.get_notification_text(notification),
        //   // file: base64_file,
        //   alert_type: 'success'
        //   // action: 'add'
        // };
        // alerts.unshift(alert);
        alert.message = getNotifyMessageHtml(alert);
        alerts.unshift(alert);
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
        alerts.unshift(alert);
        return Notification.error(message, {
          positionY: 'top',
          positionX: 'right'
        });
      };

      Alerts.prototype.server_error = function() {
        return this.error('Не удалось отправить запрос!');
      };

      Alerts.prototype.messages = function(messages) {
        // console.log('messages');
        // console.trace();
        var alert, i, len, results;
        if (messages) {
          results = [];
          for (i = 0, len = messages.length; i < len; i++) {
            alert = messages[i];
            results.unshift(this.success(alert));
          }
          return results;
        }
      };

      Alerts.prototype.errors = function(errors) {
        // console.log('errors');
        var alert, i, len, results;
        if (errors) {
          results = [];
          for (i = 0, len = errors.length; i < len; i++) {
            alert = errors[i];
            results.unshift(this.error(alert));
          }
          return results;
        }
      };

      return Alerts;

    })();
    return new Alerts();
  }
]);
