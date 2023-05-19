import React from 'react';

const OperationList = ({ operations }) => {
  // Obtener los tipos de operación únicos
  const operationTypes = [...new Set(operations.map((operation) => operation.operation_type))];

  // Calcular cantidad y monto total por tipo de operación
  const operationTotals = operationTypes.map((type) => {
    const filteredOperations = operations.filter((operation) => operation.operation_type === type);
    const totalAmount = filteredOperations.reduce((total, operation) => total + parseInt(operation.amount), 0);
    return {
      operation_type: type,
      quantity: filteredOperations.length,
      totalAmount,
    };
  });

  // Obtener conciliación entre bancos
  const bankConciliation = {};
  operations.forEach((operation) => {
    const { origin_bank_id, destination_bank_id, amount } = operation;
    const originBankKey = `${origin_bank_id}_${destination_bank_id}`;
    const destinationBankKey = `${destination_bank_id}_${origin_bank_id}`;

    if (bankConciliation[originBankKey]) {
      bankConciliation[originBankKey] -= parseInt(amount);
    } else {
      bankConciliation[originBankKey] = -parseInt(amount);
    }

    if (bankConciliation[destinationBankKey]) {
      bankConciliation[destinationBankKey] += parseInt(amount);
    } else {
      bankConciliation[destinationBankKey] = parseInt(amount);
    }
  });

  // Obtener las últimas 100 transacciones
  const last100Transactions = operations.slice(0, 100);

  return (
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
            <th>Origen</th>
            <th>Destino</th>
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
          {last100Transactions.map((operation) => (
            <tr key={operation.message_id}>
              <td>{operation.operation_type}</td>
              <td>{operation.message_id}</td>
              <td>{operation.origin_bank_id}</td>
              <td>{operation.origin_account_id}</td>
              <td>{operation.destination_bank_id}</td>
              <td>{operation.destination_account_id}</td>
              <td>{operation.amount}</td>
              <td>{operation.publish_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OperationList;
