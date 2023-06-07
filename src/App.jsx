import React, { useState, useEffect } from 'react';

const Location = ({ location }) => {
  const { name, type, dimension, residents } = location;

  return (
    <div>
      <h2>{name}</h2>
      <p>Tipo: {type}</p>
      <p>Dimensión: {dimension}</p>
      <p>Cantidad de residentes: {residents.length}</p>
      <h3>Residentes:</h3>
      {residents.map((resident) => (
        <ResidentInfo key={resident} residentUrl={resident} />
      ))}
    </div>
  );
};

const ResidentInfo = ({ residentUrl }) => {
  const [resident, setResident] = useState(null);

  useEffect(() => {
    // Realizar la solicitud para obtener los datos del residente
    fetch(residentUrl)
      .then((response) => response.json())
      .then((data) => setResident(data));
  }, [residentUrl]);

  if (!resident) {
    return <p>Cargando información del residente...</p>;
  }

  const { name, image, status, origin, episode } = resident;

  return (
    <div>
      <h4>{name}</h4>
      <img src={image} alt={name} />
      <p>Estado: {status}</p>
      <p>Lugar de origen: {origin.name}</p>
      <p>Episodios: {episode.length}</p>
    </div>
  );
};

const App = () => {
  const [locationId, setLocationId] = useState('');
  const [location, setLocation] = useState(null);

  const handleIdChange = (event) => {
    // Actualizar el estado del ID de ubicación según lo ingresado por el usuario
    setLocationId(event.target.value);
  };

  const handleButtonClick = () => {
    if (locationId) {
      // Realizar la solicitud para obtener los datos de la ubicación
      fetch(`https://rickandmortyapi.com/api/location/${locationId}`)
        .then((response) => response.json())
        .then((data) => setLocation(data))
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <label className="block mb-4">
        Ingrese el ID de la ubicación:
        <input
          type="text"
          value={locationId}
          onChange={handleIdChange}
          className="border border-gray-300 rounded py-2 px-4 mt-2"
        />
      </label>
      <button
        onClick={handleButtonClick}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Obtener Ubicación
      </button>

      {location ? (
        <Location location={location} />
      ) : (
        <p>No hay datos de ubicación para mostrar.</p>
      )}
    </div>
  );
};

export default App;
