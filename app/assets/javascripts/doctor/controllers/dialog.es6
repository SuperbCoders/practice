function DialogController($scope, $timeout) {
    var vm = this;
    vm.stage = 1;

    vm.visitsByDate = visitsByDate;
    vm.createVisit = createVisit;
    vm.dayClick = dayClick;
    vm.closeDialog = closeDialog;

    vm.events = [];
    vm.doctor = {};

    vm.Doctor = $scope.Doctor || ($scope.vm && $scope.vm.Doctor);
    vm.Visits = $scope.Visits || ($scope.vm && $scope.vm.Visits);
    vm.patient = $scope.patient || ($scope.vm && $scope.vm.patient);
    vm.ngDialog = $scope.ngDialog || ($scope.vm && $scope.vm.ngDialog);

    vm.calendar_params = {
        firstDay: 1,
        height: 315,
        eventOverlap: false,
        monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'οюнь', 'οюль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
        monthNamesShort: ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'οюнь', 'οюль', 'Авг.', 'Сент.', 'Окт.', 'Ноя.', 'Дек.'],
        dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
        dayNamesShort: ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'],
        buttonText: {
            prev: ' ',
            next: ' ',
            prevYear: 'Год назад',
            nextYear: 'Год вперед',
            today: 'Сегодня',
            month: 'Месяц',
            twoweek: '2 week',
            week: 'Неделя',
            day: 'День'
        },
        header: {
            left: 'title',
            center: 'agendaDay',
            right: 'prev,next'
        },
        columnFormat: {
            month: 'ddd',
            week: 'ddd, D',
            day: 'dddd, D'
        },
        titleFormat: {
            day: 'MMMM YYYY',
            week: 'MMMM YYYY'
        },
        timezone: 'local',
        vm: vm,
        defaultView: 'agendaDay',
        weekMode: 'fixed',
        defaultDate: moment(Date["new"]),
        editable: true,
        allDaySlot: false,
        slotLabelFormat: 'H:mm',
        timeFormat: 'H:mm',
        defaultEventMinutes: 60,
        dayClick: vm.dayClick,
        events: vm.visitsByDate
    };

    function getDoctor() {
        vm.Doctor.get().$promise.then((doctor) => { vm.doctor = doctor });
    }

    getDoctor();

    function visitsByDate(start, end, timezone, callback) {
        const queryParams = {
            start: start.format(),
            end: end.format()
        };
        return vm.Visits.query(queryParams).$promise.then((events) => {
            let event, i, len;
            for (i = 0, len = events.length; i < len; i++) {
                event = events[i];
                event.editable = false;
                event.eventOverlap = false;
                event.rendering = 'background';
                event.backgroundColor = 'red';
                event.overlap = false;
            }
            return callback(events);
        });
    }

    function createVisit() {
        console.log('create_visit');
        const visit = {
            visit_data: vm.visit_data,
            completed_patient: {
                id: vm.patient.id
            }
        };
        vm.Visits.create({visit: visit}).$promise.then((visit) => {
            let a, i, len, ref, results;
            if (visit.errors.length <= 0) {
                vm.visit = visit;
                vm.stage = 2;
            } else {
                ref = visit.errors;
                results = [];
                for (i = 0, len = ref.length; i < len; i++) {
                    a = ref[i];
                    results.push(alert(a));
                }
                return results;
            }
        });
    }

    function dayClick(date, jsEvent, view) {
        let event, i, len, ref, stand_time;
        ref = vm.events;
        for (i = 0, len = ref.length; i < len; i++) {
            event = ref[i];
            vm.popup_calendar.fullCalendar('removeEvents', event._id);
        }
        vm.events = vm.popup_calendar.fullCalendar('renderEvent', {
            start: date,
            end: date,
            className: 'status_red popupAddEvent',
            eventOverlap: false,
            overlap: false,
            allDay: false
        });
        stand_time = 30;
        if (vm.doctor.stand_time > 0) {
            stand_time = vm.doctor.stand_time;
        }
        if (vm.events.length > 0) {
            event = vm.events[0];
            event.end = date.add(stand_time, 'minutes');
            vm.popup_calendar.fullCalendar('updateEvent', vm.events[0]);

            vm.visit_data = {
                start_at: event.start,
                end_at: event.end,
                duration: (event.end - event.start) / 60 / 1000
            };

            $(".appointmentTimeBtn").text("Записаться на " + (event.start.format('lll')));
        }
    }

    function initCalendar() {
        vm.popup_calendar = undefined;
        $timeout(() => {
            vm.popup_calendar = $('#popup_calendar').fullCalendar(vm.calendar_params);
            return vm.popup_calendar.fullCalendar('render');
        }, 10);
    }

    initCalendar();

    function closeDialog() {
        vm.ngDialog.closeAll();
    }

}

DialogController.$inject = ['$scope', '$timeout'];
angular
    .module('practice.doctor')
    .controller('DialogController', DialogController);
