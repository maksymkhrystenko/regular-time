'use strict';

angular.module('todomvcApp')
    .controller('MainCtrl', function ($scope, $timeout, $compile, RegularTime, Employee, filterFilter, $location, ngDialog, moment, lodash, DTOptionsBuilder, DTColumnDefBuilder, DTColumnBuilder, DTInstances, $q, $filter) {
        $scope.selectedEmployee = '';
        $scope.isEditRegularTime = false;
        $scope.isEditEmployee = false;
        $scope.regularTimes = [];
        $scope.newRegularTime = {};
        $scope.employees = [];
        $scope.editedRegularTime = null;
        $scope.newRegularTime.endTime = Date.now();
        $scope.newRegularTime.startTime = Date.now();
        $scope.newRegularTime.employee = {};
        $scope.regularTimeId = '';
        $scope.employee = {selected: ""};
        $scope.dtInstance = null;
        DTInstances.getLast().then(function (instance) {
            $scope.dtInstance = instance;
        });
        Employee.query(function (response) {
            $scope.employees = response;
        });

        function localPromise() {
            var dfd = $q.defer();
            if ($scope.regularTimes.length !== 0) {
                dfd.resolve($scope.regularTimes);
            } else {
                var remotePromise = RegularTime.query().$promise;
                remotePromise.then(function (response) {
                    $scope.regularTimes = response;
                    dfd.resolve($scope.regularTimes);
                });
            }
            return dfd.promise;
        }

        $scope.dtOptions = DTOptionsBuilder.fromFnPromise(localPromise)
            .withOption('responsive', true)
            .withOption('createdRow', createdRow)
            .withPaginationType('full_numbers')
            .withDisplayLength(8);

        function compileElement(e) {
            "use strict";
            return $compile(angular.element(e).contents())($scope);
        }

        $scope.dtColumns = [
            DTColumnBuilder.newColumn(null).withTitle('№').renderWith(function (data, type, i, meta) {
                return meta.row + 1;
            }),
            DTColumnBuilder.newColumn('employee.fullName').withTitle('Сотрудник'),
            DTColumnBuilder.newColumn('startTimeOfWorkingDay').withTitle('Дата').renderWith(function (data, type) {
                return $filter('date')(data, 'dd/MM/yyyy'); //date filter
            }),
            DTColumnBuilder.newColumn('startTimeOfWorkingDay').withTitle('Начало работы').renderWith(function (data, type) {
                return $filter('date')(data, 'HH:mm'); //date filter
            }),
            DTColumnBuilder.newColumn('endTimeOfWorkingDay').withTitle('Окончание работы').renderWith(function (data, type) {
                return $filter('date')(data, 'HH:mm'); //date filter
            }),
            DTColumnBuilder.newColumn(null).withTitle('Действия').notSortable().renderWith(actionsHtml)
        ];

        function createdRow(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            $('td', nRow).find('.edit-regular-time').bind('click', function () {
                $scope.isEditRegularTime = true;
                $scope.editRegularTimeModal(aData._id);
                $scope.dtInstance.rerender();
            });
            $('td', nRow).find('.remove-regular-time').bind('click', function () {
                $scope.removeRegularTime(aData._id)
                $scope.dtInstance.rerender();
            });
            return nRow;
        }

        function actionsHtml(data, type, full, meta) {
            $scope.regularTimes[data.id] = data;
            return '<button class="btn edit-regular-time btn-warning">' +
                '   <i class="fa fa-edit"></i>' +
                '</button>&nbsp;' +
                '<button class="btn remove-regular-time btn-danger" >' +
                '   <i class="fa fa-trash-o"></i>' +
                '</button>';
        }

        $scope.submitModalRegularTime = function () {
            if ($scope.isEditRegularTime) {
                $scope.doneEditingRegularTime();
            } else {
                $scope.addRegularTime();

            }
        };

        $scope.submitModalEmployee = function () {
            if ($scope.isEditEmployee) {
                $scope.employeeTitle = 'Редактирование сотрудника';
                $scope.doneEditingEmployee();
            } else {
                $scope.employeeTitle = 'Создание сотрудника';
                $scope.addEmployee();
            }
        };


        $scope.addEmployee = function () {
            var newEmployee = new Employee({
                fullName: $scope.employee.firstName + ' ' + $scope.employee.secondName + ' ' + $scope.employee.patronymic,
                gender: $scope.employee.gender,
                contacts: $scope.employee.contacts,
                department: $scope.employee.department,
                dateOfCreation: Date.now()
            });
            newEmployee.$save();
            $scope.employee={};
            $scope.employees.unshift(newEmployee);
            ngDialog.close($scope.employeeModal);
        };

        $scope.addRegularTime = function () {
            var newRegularTime = new RegularTime({
                employee: $scope.employee.selected,
                endTimeOfWorkingDay: moment($scope.newRegularTime.endTime).toDate(),
                startTimeOfWorkingDay: moment($scope.newRegularTime.startTime).toDate(),
            });

            newRegularTime.$save(function (res) {
                $scope.regularTimes.unshift(res);
                $scope.employee.selected = null;
                ngDialog.close($scope.regularTimeModal);
                $scope.dtInstance.rerender();
            });
        };

        $scope.editRegularTime = function (id) {
            $scope.editedRegularTime = $scope.regularTimes[id];
            $scope.originalRegularTime = angular.extend({}, $scope.editedRegularTime);
        };

        $scope.doneEditingRegularTime = function () {
            $scope.editedRegularTime = null;
            var index = lodash.findIndex($scope.regularTimes, function (regularTimeItem) {
                return regularTimeItem._id == $scope.regularTimeId
            });

            $scope.regularTimes[index].employee = $scope.employee.selected._id;
            $scope.regularTimes[index].startTimeOfWorkingDay = $scope.newRegularTime.startTime;
            $scope.regularTimes[index].endTimeOfWorkingDay = $scope.newRegularTime.endTime;
            delete $scope.regularTimes[index].$resolved;
            $scope.regularTimes[index].$update().then(function (result4) {
                $scope.regularTimes[index].employee = $scope.employee.selected;
                $scope.employee.selected = null;
                ngDialog.close($scope.regularTimeModal);
                $scope.dtInstance.rerender();
                $scope.isEditRegularTime = false;
            });
            ;

        };
        $scope.doneEditingEmployee = function (id) {
            $scope.isEditEmployee = false;
        };

        $scope.revertEditingRegularTime = function (id) {
            $scope.regularTimes[id] = $scope.originalRegularTime;
            $scope.doneEditing(id);
        };

        $scope.removeRegularTime = function (id) {
            var index = lodash.findIndex($scope.regularTimes, function (regularTimeItem) {
                return regularTimeItem._id == id
            });
            $scope.regularTimes[index].$remove();
            $scope.regularTimes.splice(index, 1);
        };

        $scope.editRegularTimeModal = function (id) {
            var index = lodash.findIndex($scope.regularTimes, function (regularTimeItem) {
                return regularTimeItem._id == id
            });
            $scope.regularTimeId = id;
            $scope.employee.selected = $scope.regularTimes[index].employee;
            $scope.newRegularTime.startTime = $scope.regularTimes[index].startTimeOfWorkingDay;
            $scope.newRegularTime.endTime = $scope.regularTimes[index].endTimeOfWorkingDay;
            $scope.isEditRegularTime = true;
            $scope.regularTimeModalTitle = 'Редактирование табельного времени сотрудника';
            $scope.regularTimeModal = ngDialog.open({
                template: 'views/partials/regular-time.modal.tpl.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        };

        $scope.addRegularTimeModal = function () {
            $scope.regularTimeModalTitle = 'Добавление табельного времени сотрудника';
            $scope.regularTimeModal = ngDialog.open({
                template: 'views/partials/regular-time.modal.tpl.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        };

        $scope.addEmployeeModal = function () {
            $scope.employeeModal = ngDialog.open({
                template: 'views/partials/add-employee.modal.tpl.html',
                className: 'ngdialog-theme-default',
                scope: $scope
            });
        };

        $scope.closeRegularTimeModal = function () {
            ngDialog.close($scope.regularTimeModal);
        };

        $scope.closeEmployeeModal = function () {
            ngDialog.close($scope.employeeModal);
        };


    }).filter('propsFilter', function () {
    return function (items, props) {
        var out = [];

        if (angular.isArray(items)) {
            var keys = Object.keys(props);
            items.forEach(function (item) {
                var itemMatches = false;

                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop] && item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    };
});

