angular
    .module('practice.admin')
    .factory('SystemMailersService', ['Resources', (Resources) => {

        let mailersResource = Resources('/admin/mail-templates/:mailer_slug/:email_slug',
            { mailer_slug: '@mailer_slug', email_slug: '@email_slug' });

        return {
            getEmail: getEmail,
            saveEmail: saveEmail
        };

        function getEmail(mailerSlug, emailSlug) {
            return mailersResource
                .get({mailer_slug: mailerSlug, email_slug: emailSlug})
                .$promise
        }

        function saveEmail(mailerSlug, emailSlug, email) {
            return mailersResource
                .save({mailer_slug: mailerSlug, email_slug: emailSlug, template: email.template})
        }
}]);