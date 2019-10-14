app.factory('mambuUtil', function(mambuConvertUtil, _, $filter, $log) {
  function traslateFrecuencia(value, periodo) {
    var result;
    if (_('WEEKS').isEqual(value)) {
      result = 'SEMANA';
    } else if (_('DAYS').isEqual(value)) {
      if (periodo === 15) {
        result = 'QUINCENA';
      } else if (periodo === 30) {
        result = 'MES'
      }
    } else {
      result = value;
    }

    return result;
  }

  function mapearPagosResponse(pagosResp, prestamo) {

    var totalInteres = 0;
    var totalIvaInteres = 0;

    var totalTotal = 0;

    var filteredPagos = _.filter(pagosResp, function(pago) {
      return pago.principalDue !== "0";
    });

    var saldoPrincipal = prestamo.loanAmount;
    var pagos = _.map(filteredPagos, function(pago, index) {
      var fecha = moment(pago.dueDate).utc().format("YYYY-MM-DD");
      var fechaPago;

      if (!_(pago.lastPaidDate).isEmpty()) {
        fechaPago = moment(pago.lastPaidDate).utc().format("YYYY-MM-DD");
      }
      var montoPago;
      if (!_(pago.principalPaid).isEmpty()) {
        montoPago = parseFloat(pago.principalPaid);
      }
      var abono = parseFloat(pago.principalDue) - montoPago;
      var montoIvaPagado = parseFloat(pago.taxInterestPaid);
      var ivaInteres = parseFloat(pago.taxInterestDue) - montoIvaPagado;
      
      saldoPrincipal -= abono;

      var saldo = saldoPrincipal;
      var state = pago.state;
      var montoPagado = parseFloat(pago.principalPaid);
      var montoInteresPagado = parseFloat(pago.interestPaid);
      var interes = parseFloat(pago.interestDue) - ivaInteres - montoInteresPagado;
      var total = abono + interes + ivaInteres;



      totalInteres += interes;
      totalIvaInteres += ivaInteres;
      totalTotal += total;

      return {
        num: index + 1,
        fecha: fecha,
        fechaPago: fechaPago,
        abono: abono,
        interes: interes,
        saldo: saldo,
        ivaInteres: ivaInteres,
        total: total,
        state: state,
        montoPago: montoPago,
        montoPagado: montoPagado,
        montoInteresPagado: montoInteresPagado
      }

    });

    if (prestamo.disbursementDetails) {
      pagos.unshift({
        num: 0,
        fecha: mambuConvertUtil.parseISO8601Date(prestamo.creationDate),
        saldo: prestamo.loanAmount
      }); //TODO:corroborar      
    }


    return {
      totalInteres: totalInteres,
      totalIvaInteres: totalIvaInteres,
      pagos: pagos,
      totalTotal: totalTotal
    };

  };

  function mapearPagosResponseTransactions(transaccionesResp, prestamo) {

    var filteredTransactions = _.filter(transaccionesResp, function(transaccion) {
      return transaccion.amount !== "0";
    });
    var transacciones = _.map(filteredTransactions, function(transaccion) {
      var fechaTransaccion;

      if (!_(transaccion.creationDate).isEmpty()) {
        $log.debug("============transaccion.creationDate", transaccion.creationDate);

        fechaTransaccion = moment(transaccion.creationDate).utc().format("YYYY-MM-DD");
        $log.debug("============fechaTransaccion", fechaTransaccion);
      }
      var montoTransaccion;
      if (!_(transaccion.amount).isEmpty()) {
        montoTransaccion = parseFloat(transaccion.amount);
      }

      var type = transaccion.type;
      var transactionChannelName;
      if (!_(transaccion.details).isEmpty() && !_(transaccion.details.transactionChannel).isEmpty()) {
        transactionChannelName = transaccion.details.transactionChannel.name;
      }
      var idTransaccion = transaccion.transactionId;

      var totalTransacciones = parseFloat(transaccion.amount);

      return {
        montoTransaccion: montoTransaccion,
        type: type,
        transactionChannelName: transactionChannelName,
        fechaTransaccion: fechaTransaccion,
        totalTransacciones: totalTransacciones,
        idTransaccion: idTransaccion

      }

    });

    return {
      transacciones: transacciones,
    };

  };


  function filtrarListaPorStatus(pagos, status) {
    var sumTotal = 0;

    var result = _.filter(pagos, function(pago) {
      return _.isEqual(pago.state, status);
    });
    _.each(result, function(pago) {
      sumTotal += pago.total;
    });

    return {
      pagos: result,
      sumTotal: sumTotal
    }
  }

  function filtrarListaPorType(transacciones, type) {
    var sumTotal = 0;

    var result = _.filter(transacciones, function(transaccion) {
      return _.isEqual(transaccion.type, type);
    });
    _.each(result, function(transaccion) {
      sumTotal += transaccion.totalTransacciones;
    });

    return {
      transacciones: result,
      sumTotal: sumTotal
    }
  }

  function obtenerProximoPago(pagos, today) {
    var proximoPago =
      _.find(pagos, function(pago) {
        if (moment(pago.fecha).isSameOrAfter(moment(today).utc()) && pago.num > 0) {
          pago.restante = pago.total;
          return pago;
        }

      });

    return proximoPago;
  }

  function mapearSaldosMoratorios(pagosResp, ivaProducto, tasaProducto, penaltyPaid) {

    var totalAmortTotal = 0;
    var pagos = _.map(pagosResp.pagos, function(pago) {
      $log.info('pagos :)', pago);
      var diasTranscurridos = moment().diff(moment(pago.fecha), "days");
      var amortVencida = pago.total;
      var interesMoratorio = pago.abono * (tasaProducto / 100) * diasTranscurridos;
      $log.info('interesMoratorio: ', interesMoratorio);
      var ivaInteresMoratorio = interesMoratorio * (ivaProducto / 100);
      var totalAmort = amortVencida + interesMoratorio + ivaInteresMoratorio;
      var diasVencimiento = diasTranscurridos;

      totalAmortTotal += totalAmort;
      $log.log('mapearSaldosMoratorios ->, diasTranscurridos', pago, diasTranscurridos);

      var moratorioFields = {
        amortVencida: amortVencida,
        interesMoratorio: interesMoratorio,
        ivaInteresMoratorio: ivaInteresMoratorio,
        totalAmort: totalAmort,
        diasVencimiento: diasVencimiento
      };

      _(pago).extend(moratorioFields);

      return pago;

    });
    pagosResp.totalAmortTotal = totalAmortTotal;
    pagosResp.pagos = pagos;

    return pagosResp;
  }

  function mapearPrestamoResponse(prestamoResp, pagosResp) {
    $log.info('prestamoResp :-', prestamoResp);
    var today = new Date();
    var dd = today.getDate();
    var mm = (today.getMonth()); //January is 0!
    var yyyy = today.getFullYear();
    var penaltyDue = parseFloat(prestamoResp.penaltyDue);
    var penaltyPaid = parseFloat(prestamoResp.penaltyPaid);
    $log.info('penaltyDue: ', penaltyDue);
    $log.info('penaltyPaid: ', penaltyPaid);
    var pagos = mapearPagosResponse(pagosResp, prestamoResp);
    var pagosRealizados = filtrarListaPorStatus(pagos.pagos, 'PAID');
    var pagosPendientes = filtrarListaPorStatus(pagos.pagos, 'PENDING');
    var pagosParciales = filtrarListaPorStatus(pagos.pagos, 'PARTIALLY_PAID');
    var pagosTardios = filtrarListaPorStatus(pagos.pagos, 'LATE');
    $log.info('pagosTardios: ', pagosTardios);
    var proximoPago;
    if (_.size(pagosParciales.pagos) > 0) {
      proximoPago = obtenerProximoPago(pagosParciales.pagos, today);
    } else {
      proximoPago = obtenerProximoPago(pagosPendientes.pagos, today);
    }

    if (proximoPago) {
      var fecha = moment(proximoPago.fecha);
      proximoPago.proximoPagoFecha = {
        dia: proximoPago ? fecha.date() : 0,
        mes: proximoPago ? mambuConvertUtil.monthNames(fecha.month()) : 0,
        agno: proximoPago ? fecha.year() : 0
      }
    }
    var ivaProducto = parseFloat(prestamoResp.taxRate);
    var tasaProducto = parseFloat(prestamoResp.penaltyRate);


    return {
      producto: {
        prestamo: prestamoResp.loanAmount,
        interes: pagos.totalInteres,
        ivaInteres: pagos.totalIvaInteres,
        total: pagos.totalTotal,
        plazo: prestamoResp.repaymentInstallments,
        frecuencia: traslateFrecuencia(prestamoResp.repaymentPeriodUnit, prestamoResp.repaymentPeriodCount),
        tasa: prestamoResp.interestRate,
        restaPorPagar: pagos.totalTotal + penaltyDue
      },
      hoy: {
        dia: dd,
        mes: mambuConvertUtil.monthNames(mm),
        agno: yyyy
      },
      pagosTest: pagos.pagos,
      pagosRealizados: pagosRealizados.pagos,
      pagosPendientes: pagosPendientes.pagos,
      pagosPendientesSuma: pagosPendientes.sumTotal,
      pagosParciales: pagosParciales.pagos,
      proximoPago: proximoPago,
      saldoPagosHoy: pagos.totalTotal - (pagosPendientes.sumTotal + pagosTardios.sumTotal),
      saldoPendientesHoy: pagosPendientes.sumTotal + pagosTardios.sumTotal,
      pagos: pagos.pagos,
      pagosVencidos: mapearSaldosMoratorios(pagosTardios, ivaProducto, tasaProducto, penaltyPaid) || []
    }
  }

  function mapearPrestamoResponseTransactions(prestamoResp, transaccionesResp) {

    var transacciones = mapearPagosResponseTransactions(transaccionesResp, prestamoResp);
    var transaccionesRealizadas = filtrarListaPorType(transacciones.transacciones, 'REPAYMENT');

    return {
      transaccionesRealizadas: transaccionesRealizadas.transacciones,
      sumaTransacciones: transaccionesRealizadas.sumTotal
    }
  }


  function mapearCreditos(creditos) {
    var objetosCredito = [];
    _.each(creditos, function(credito) {
      var creditoId = credito.id
      var nombreCredito = credito.loanName + "     (     " + credito.id + "     )     "
      var detalles = 'Monto:' + $filter('currency')(credito.loanAmount, '$', 0) + "     |     " + 'Plazo:' + credito.repaymentInstallments + " " +
        mambuConvertUtil.timePeriod(credito.repaymentPeriodUnit, credito.repaymentPeriodCount) + "     |     " + 'Frecuencia de pagos:' + " " +
        mambuConvertUtil.timePeriod(credito.repaymentPeriodUnit, credito.repaymentPeriodCount) + "     |     " + 'Fecha de Contratación:' + $filter('date')(credito.creationDate, "dd/MM/yyyy")
      var monto = $filter('currency')(credito.loanAmount, '$', 0)
      var plazo = credito.repaymentInstallments + " " +
        mambuConvertUtil.timePeriod(credito.repaymentPeriodUnit, credito.repaymentPeriodCount)
      var frecuencia = mambuConvertUtil.timePeriod(credito.repaymentPeriodUnit, credito.repaymentPeriodCount);
      var fechaContratacion = $filter('date')(credito.creationDate, "dd/MM/yyyy")
      if (_.isEqual(credito.accountState, "CLOSED")) {
        objetosCredito.push({
          objetoCredito: {
            creditoId: creditoId,
            nombreCredito: nombreCredito,
            detalles: detalles,
            monto: monto,
            plazo: plazo,
            frecuencia: frecuencia,
            fechaContratacion: fechaContratacion
          }
        });
      }
    });

    return objetosCredito;
  }


  ;
  return {
    mapearPrestamoResponse: mapearPrestamoResponse,
    mapearPrestamoResponseTransactions: mapearPrestamoResponseTransactions,
    mapearPagosResponse: mapearPagosResponse,
    mapearCreditos: mapearCreditos
  };

});