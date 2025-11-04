// src/CitasList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CitasList() {
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/citas/')
      .then(response => {
        setCitas(response.data);
      })
      .catch(error => {
        console.error('Error al obtener las citas:', error);
      });
  }, []);

  return (
    <div>
      <h1>Listado de Citas</h1>
      <ul>
        {citas.map(cita => (
          <li key={cita.id}>
            {cita.paciente_nombre} con {cita.medico_nombre} - {cita.fecha} a las {cita.hora}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CitasList;
