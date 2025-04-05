import { useState, useEffect } from 'react';
import axios from 'axios';

// Componente para mostrar la información de una ubicación
const Location = ({ location }) => {
  const { name, type, dimension, residents } = location;

  return (
    <div className="bg-gradient-to-b from-yellow-400 via-pink-500 to-purple-500 rounded-md p-4">
      <h4 className="text-center text-3xl font-bold mb-4">{name}</h4>
      <p>Tipo: {type}</p>
      <p>Dimensión: {dimension}</p>
      <p>Cantidad de residentes: {residents.length}</p>
    </div>
  );
};

// Componente para mostrar la información de un residente
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
    <div className="bg-gradient-to-b from-yellow-400 via-pink-500 to-purple-500 rounded-md p-4">
      <h4 className="text-center text-3xl font-bold mb-4">{name}</h4>
      <div className="w-40 h-40 mx-auto mb-4">
        <img
          src={image}
          alt={name}
          className="object-cover w-full h-full rounded-full max-w-full max-h-full"
        />
      </div>
      <p>Estado: {status}</p>
      <p>Lugar de origen: {origin.name}</p>
      <p>Episodios: {episode.length}</p>
    </div>
  );
};

// Componente principal de la aplicación
const App = () => {
  const [locationId, setLocationId] = useState('');
  const [location, setLocation] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Cantidad de cajas por página

  // Maneja el cambio del ID de ubicación en el input
  const handleIdChange = (event) => {
    setLocationId(event.target.value);
  };

  // Maneja el clic en el botón "Obtener Ubicación"
  const handleButtonClick = () => {
    if (locationId) {
      fetch(`https://rickandmortyapi.com/api/location/${locationId}`)
        .then((response) => response.json())
        .then((data) => setLocation(data))
        .catch((error) => console.log(error));
    }
  };

  // Obtiene la lista de personajes de la ubicación actual
  useEffect(() => {
    if (location) {
      const fetchCharacters = async () => {
        const promises = location.residents.map((residentUrl) =>
          axios.get(residentUrl).then((response) => response.data)
        );

        const charactersData = await Promise.all(promises);
        setCharacters(charactersData);
      };

      fetchCharacters();
    }
  }, [location]);

  // Calcula el índice inicial y final de los personajes a mostrar según la página actual
  const indexOfLastCharacter = currentPage * itemsPerPage;
  const indexOfFirstCharacter = indexOfLastCharacter - itemsPerPage;
  const currentCharacters = characters.slice(indexOfFirstCharacter, indexOfLastCharacter);

  // Calcula la cantidad total de páginas
  const totalPages = Math.ceil(characters.length / itemsPerPage);

  // Cambia a la página siguiente
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Cambia a la página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Rick and Morty</h1>
      <p className="text-center mb-4">
        ¡Ey, ey, ey! Aquí tienes la info más intrigante del universo de Rick and Morty. Ingresa el ID de una ubicación y descubre todos sus secretos. Sin complicaciones, sin problemas. ¡A explorar el cosmos!
      </p>
      <label className="block text-center mb-4">
        ¿A dónde quieres ir?
        <input
          type="text"
          value={locationId}
          onChange={handleIdChange}
          className="block mx-auto bg-gray-100 border border-gray-300 rounded-md py-2 px-4 mt-2"
        />
      </label>
      <button
        onClick={handleButtonClick}
        className="bg-blue-500 hover:bg-green-700 text-black font-bold py-2 px-4 rounded mx-auto"
      >
        ¿A Dónde Vamos Ir Rick????
      </button>

      {location ? (
        <Location location={location} />
      ) : (
        <p>Vamos Morty, ¡vamos!</p>
      )}

      {currentCharacters.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {currentCharacters.map((character) => (
            <ResidentInfo key={character.id} residentUrl={character.url} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={prevPage}
            className="bg-gradient-to-r from-green-400 to-yellow-400 text-white font-bold py-2 px-4 rounded-l"
          >
            {/* Anterior */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          {Array.from({ length: Math.min(totalPages, 3) }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`bg-gradient-to-r from-green-400 to-yellow-400 text-white font-bold py-2 px-4 rounded ${
                currentPage === page ? 'bg-opacity-100' : 'bg-opacity-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={nextPage}
            className="bg-gradient-to-r from-green-400 to-yellow-400 text-white font-bold py-2 px-4 rounded-r"
          >
            {/* Siguiente */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
