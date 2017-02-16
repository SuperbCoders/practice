angular
    .module('practice.admin')
    .factory('SystemMailersService', ['Resources', (Resources) => {

        let mailersResource = Resources('/admin/mail-templates/:mailerSlug/:emailSlug',
            {mailerSlug: '@mailerSlug', emailSlug: '@emailSlug'});

        return {
            getEmail: getEmail,
            saveEmail: saveEmail
        };

        function getEmail(mailerSlug, emailSlug) {
            return mailersResource
                .get({mailerSlug: mailerSlug, emailSlug: emailSlug})
                .$promise
        }

        function saveEmail(mailerSlug, emailSlug, email) {
            return mailersResource
                .save({mailerSlug: mailerSlug, emailSlug: emailSlug, template: email.template})
        }
}]);