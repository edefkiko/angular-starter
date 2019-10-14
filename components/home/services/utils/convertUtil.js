'use strict'
angular.module('home')
  .factory('mambuConvertUtil', function(_) {

    function monthNames(index) {
      var names = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

      return names[index];
    }

    function gender(descripcion) {
      if (_.isEqual(descripcion, 'MALE')) {
        return 'HOMBRE';
      } else if (_.isEqual(descripcion, 'FEMALE')) {
        return 'MUJER';
      } else {
        return descripcion;
      }
    }

    function parseISO8601Date(date) {
      return moment(date).utc().format();
    }

    function timePeriod(tiempoPeriodo, frecuencia) {
      if (_.isEqual(tiempoPeriodo, 'DAYS')) {
        if (frecuencia === 15) {
          return 'QUINCENAS';
        } else if (frecuencia === 30) {
          return 'MESES'
        }
      } else if (_.isEqual(tiempoPeriodo, 'WEEKS')) {
        return 'SEMANAS';
      } else if (_.isEqual(tiempoPeriodo, 'YEARS')) {
        return 'AÑOS';
      } else {
        return tiempoPeriodo;
      }
    }

    function stringToDate(_date, _format, _delimiter) {

      var formatLowerCase = _format.toLowerCase();
      var formatItems = formatLowerCase.split(_delimiter);
      var dateItems = _date.split(_delimiter);
      var monthIndex = formatItems.indexOf("mm");
      var dayIndex = formatItems.indexOf("dd");
      var yearIndex = formatItems.indexOf("yyyy");
      var month = parseInt(dateItems[monthIndex]);
      month -= 1;
      var formatedDate = new Date(dateItems[yearIndex], month, dateItems[dayIndex]);
      return formatedDate;
    }

    return {
      monthNames: monthNames,
      parseISO8601Date: parseISO8601Date,
      gender: gender,
      timePeriod: timePeriod,
      stringToDate: stringToDate
    };

  });