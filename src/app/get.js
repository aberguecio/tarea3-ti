"use client"; // This is a client component

import React, { useEffect, useState } from 'react';

const MyComponent = () => {
  const [data, setData] = useState(null);

    async function fetchData() {
        console.log('fetching data');
        const response = await fetch('https://tarea3-ti.onrender.com/api/get/',
        {method: "GET",
        headers: {
            'Host': 'tarea3-ti.onrender.com',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Origin': 'https://tarea3-ti.onrender.com',
        }})
        .then((response) => response.json())
        .then((data) => {
            setData(data);
            console.log("Modalrev:",data)
        });
    }


  useEffect(() => {
    fetchData();
    console.log('useEffect');
  }, []);

  return (
    <div>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MyComponent;
