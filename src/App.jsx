import React, { useState, useEffect } from 'react';
import axios from 'axios';


const Location = ({ location }) => {
  const { name, type, dimension, residents } = location;

  return (
    <div className="bg-white p-4 rounded">
      <h2 className="text-2xl font-bold mb-4">{name}</h2>
      <p>Tipo: {type}</p>
      <p>Dimensión: {dimension}</p>
      <p>Cantidad de residentes: {residents?.length || 0}</p>
      <h3 className="text-xl font-bold mt-4">Residentes:</h3>
      {residents?.map((residentUrl) => (
        <ResidentInfo key={residentUrl} residentUrl={residentUrl} />
      ))}
    </div>
  );
};

const ResidentInfo = ({ residentUrl }) => {
  const [resident, setResident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(residentUrl)
      .then((response) => response.json())
      .then((data) => {
        setResident(data);
        setIsLoading(false);
      })
      .catch((error) => console.log(error));
  }, [residentUrl]);

  if (isLoading) {
    return <p>Cargando información del residente...</p>;
  }

  const { name, image, status, origin, episode } = resident;

  return (
    <div className="bg-white p-4 rounded">
      <h4 className="text-lg font-bold mb-2">{name}</h4>
      <img src={image} alt={name} className="mb-2" />
      <p>Estado: {status}</p>
      <p>Lugar de origen: {origin.name}</p>
      <p>Episodios: {episode.length}</p>
    </div>
  );
};

const App = () => {
  const [locationId, setLocationId] = useState('');
  const [location, setLocation] = useState(null);
  const [characters, setCharacters] = useState([]);

  const handleIdChange = (event) => {
    setLocationId(event.target.value);
  };

  const handleButtonClick = () => {
    if (locationId) {
      fetch(`https://rickandmortyapi.com/api/location/${locationId}`)
        .then((response) => response.json())
        .then((data) => setLocation(data))
        .catch((error) => console.log(error));
    }
  };

  const getCharacters = async () => {
    try {
      const response = await axios.get(
        'https://rickandmortyapi.com/api/character'
      );
      return response.data.results;
    } catch (error) {
      console.error('Error al obtener los personajes:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      const characters = await getCharacters();
      setCharacters(characters);
    };

    fetchCharacters();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Rick and Morty</h1>
      <p className="mb-4">
        Aquí se muestra información sobre ubicaciones y residentes del universo
        de Rick and Morty. Ingresa el ID de una ubicación para obtener detalles
        sobre la misma.
      </p>
      <label className="block mb-4">
        !Vamos Morty, vamos!!!!
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
        <p>Vamos Morty, ¡vamos!</p>
      )}
    </div>
  );
};

export default App;
