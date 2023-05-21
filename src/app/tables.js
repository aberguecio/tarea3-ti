import React, { useEffect, useState } from 'react';
import { parseISO, format } from 'date-fns';

const OperationList = ({ operations }) => {
  const [originBankFilter, setOriginBankFilter] = useState('');
  const [destinationBankFilter, setDestinationBankFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  // Obtener los tipos de operación únicos
  const operationTypes = [...new Set(operations.map((operation) => operation.operation_type))];



  // Calcular cantidad y monto total por tipo de operación
  const operationTotals = operationTypes.map((type) => {
    const filteredOperations = operations.filter((operation) => {
      let isOriginMatch = true;
      let isDestinationMatch = true;
      let isDateMatch = true;
  
      if (originBankFilter) {
        isOriginMatch = parseInt(operation.origin_bank_id) === parseInt(originBankFilter);
      }
  
      if (destinationBankFilter) {
        isDestinationMatch = parseInt(operation.destination_bank_id) === parseInt(destinationBankFilter);
      }
  
      if (dateFilter) {
        const operationDate = new Date(operation.publish_time);
        const filterDate = new Date(dateFilter);
        isDateMatch =
          operationDate.getFullYear() === filterDate.getFullYear() &&
          operationDate.getMonth() === filterDate.getMonth() &&
          operationDate.getDate() === filterDate.getDate();
      }
  
      return isOriginMatch && isDestinationMatch && isDateMatch;
    });
    const filteredOperationsType = filteredOperations.filter((operation) => operation.operation_type === type);
    const totalAmount = filteredOperationsType.reduce((total, operation) => total + parseInt(operation.amount), 0);
    return {
      operation_type: type,
      quantity: filteredOperationsType.length,
      totalAmount,
    };
  });

  // Obtener conciliación entre bancos
  const bankConciliation = {};
  operations.forEach((operation) => {
    const { origin_bank_id, destination_bank_id, amount } = operation;
    const originBankKey = `${origin_bank_id}_${destination_bank_id}`;
    const destinationBankKey = `${destination_bank_id}_${origin_bank_id}`;


    // Aplicar los filtros
    const isOriginMatch = !originBankFilter || parseInt(origin_bank_id) === parseInt(originBankFilter);
    const isDestinationMatch = !destinationBankFilter || parseInt(destination_bank_id) === parseInt(destinationBankFilter);
    const isDateMatch = !dateFilter || new Date(operation.publish_time).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();

    if (isOriginMatch && isDestinationMatch && isDateMatch) {
      if (operation.operation_type == 2200){
        if (bankConciliation[originBankKey]) {
          bankConciliation[originBankKey] += parseInt(amount);
        } else {
          bankConciliation[originBankKey] = parseInt(amount);
        }
      }else{
        if (bankConciliation[originBankKey]) {
          bankConciliation[originBankKey] -= parseInt(amount);
        } else {
          bankConciliation[originBankKey] = -parseInt(amount);
        }
      }

      /* if (bankConciliation[destinationBankKey]) {
        bankConciliation[destinationBankKey] += parseInt(amount);
      } else {
        bankConciliation[destinationBankKey] = parseInt(amount);
      } */
    }
  });


  // Obtener las últimas 100 transacciones
  /* const last100Transactions = operations.slice(0, 100); */
  const filteredTransactions = operations.filter((operation) => {
    const isOriginMatch = !originBankFilter || parseInt(operation.origin_bank_id) === parseInt(originBankFilter);
    const isDestinationMatch = !destinationBankFilter || parseInt(operation.destination_bank_id) === parseInt(destinationBankFilter);
    const isDateMatch = !dateFilter || new Date(operation.publish_time).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();
  
    return isOriginMatch && isDestinationMatch && isDateMatch;
  });

  //histogramas
  const calculateTransactionHistogram = () => {
    const histogram = {
      "< $10,000": 0,
      "$10,000 - $49,999": 0,
      "$50,000 - $99,999": 0,
      "$100,000 - $499,999": 0,
      "$500,000 - $999,999": 0,
      "$1,000,000 - $9,999,999": 0,
      "> $9,999,999": 0,
    };
  
    operations.forEach((operation) => {
      const amount = parseInt(operation.amount);

      const isOriginMatch = !originBankFilter || parseInt(operation.origin_bank_id) === parseInt(originBankFilter);
      const isDestinationMatch = !destinationBankFilter || parseInt(operation.destination_bank_id) === parseInt(destinationBankFilter);
      const isDateMatch = !dateFilter || new Date(operation.publish_time).toLocaleDateString() === new Date(dateFilter).toLocaleDateString();
      if (isOriginMatch && isDestinationMatch && isDateMatch){
        if (amount < 10000) {
          histogram["< $10,000"]++;
        } else if (amount >= 10000 && amount <= 49999) {
          histogram["$10,000 - $49,999"]++;
        } else if (amount >= 50000 && amount <= 99999) {
          histogram["$50,000 - $99,999"]++;
        } else if (amount >= 100000 && amount <= 499999) {
          histogram["$100,000 - $499,999"]++;
        } else if (amount >= 500000 && amount <= 999999) {
          histogram["$500,000 - $999,999"]++;
        } else if (amount >= 1000000 && amount <= 9999999) {
          histogram["$1,000,000 - $9,999,999"]++;
        } else if (amount > 9999999) {
          histogram["> $9,999,999"]++;
        }
      }
    });
  
    return histogram;
  };


  const TransactionHistogram = () => {
    return (
      <div>
        <h2>Histograma de Monto de Transacciones</h2>
        <table>
          <thead>
            <tr>
              <th>Rango de Monto</th>
              <th>Cantidad de Transacciones</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(calculateTransactionHistogram()).map(([range, count]) => (
              <tr key={range}>
                <td>{range}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
    <h2>Controles de filtro:</h2>

    {/* Controles de filtro */}
    <div>
      <label htmlFor="originBankFilter">Banco de origen:</label>
      <input
        type="text"
        id="originBankFilter"
        value={originBankFilter}
        onChange={(e) => setOriginBankFilter(e.target.value)}
      />
      <label htmlFor="destinationBankFilter">Banco de destino:</label>
      <input
        type="text"
        id="destinationBankFilter"
        value={destinationBankFilter}
        onChange={(e) => setDestinationBankFilter(e.target.value)}
      />
      <label htmlFor="dateFilter">Fecha de transacción:</label>
      <input
        type="date"
        id="dateFilter"
        value={dateFilter}
        onChange={(e) => setDateFilter(e.target.value)}
      />
    </div>
      <div>
        <h2>Desglose de cantidad y monto total de operaciones por tipo de operación:</h2>
        <table>
          <thead>
            <tr>
              <th>Tipo de Operación</th>
              <th>Cantidad</th>
              <th>Monto Total</th>
            </tr>
          </thead>
          <tbody>
            {operationTotals.map((operation) => (
              <tr key={operation.operation_type}>
                <td>{operation.operation_type}</td>
                <td>{operation.quantity}</td>
                <td>{operation.totalAmount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Conciliación entre bancos:</h2>
        <table>
          <thead>
            <tr>
              <th>Origen </th>
              <th>Destino </th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(bankConciliation).map(([bankKey, amount]) => {
              const [originBankId, destinationBankId] = bankKey.split('_');
              return (
                <tr key={bankKey}>
                  <td>{originBankId}</td>
                  <td>{destinationBankId}</td>
                  <td>{amount}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h2>100 últimas transacciones:</h2>
        <table>
          <thead>
            <tr>
              <th>Tipo de Operación</th>
              <th>ID de Mensaje</th>
              <th>Banco de Origen</th>
              <th>Cuenta de Origen</th>
              <th>Banco de Destino</th>
              <th>Cuenta de Destino</th>
              <th>Monto</th>
              <th>Tiempo de Publicación</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.slice(0, 100).map((operation) => (
              <tr key={operation.message_id}>
                <td>{operation.operation_type}</td>
                <td>{operation.message_id}</td>
                <td>{operation.origin_bank_id}</td>
                <td>{operation.origin_account_id}</td>
                <td>{operation.destination_bank_id}</td>
                <td>{operation.destination_account_id}</td>
                <td>{operation.amount}</td>
                <td>{format(parseISO(operation.publish_time),'yyyy-MM-dd')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TransactionHistogram />
    </div>
  );
};

export default OperationList;
