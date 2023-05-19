"use client"; // This is a client component

import React, { useEffect, useState } from 'react';
/* import Histograma from './histograma'; */
import OperationList from './tables';

const MyComponent = () => {
  const [data, setData] = useState(null);

    async function fetchData() {
        console.log('fetching data');
        await fetch('https://tarea3-ti.onrender.com/api/get/',
        {method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }})
        .then((response) => response.json())
        .then((data) => {
            setData(data);
            console.log("Data:",data)
        });
    }


  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
        {data ? (<>
            <div>Cantidad de operaciones recibidas:{data.length}</div>              
            <OperationList operations={data} /> {/*<Histograma operaciones={data} /> */ }
            </>
        ) : (
            <p>Loading...</p>
        )}
    </div>
  );
};

export default MyComponent;
