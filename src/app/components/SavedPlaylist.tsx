import React, { useEffect, useRef, useState } from "react";

interface Station {
  stationuuid: string;
  name: string;
  country: string;
  codec: string;
  url_resolved: string;
}

const SavedPlaylist: React.FC = () => {
  const [playlist, setPlaylist] = useState<Station[]>([]);

  // Função para carregar a playlist do localStorage ao montar o componente
  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem("playlist") || "[]");
    setPlaylist(savedPlaylist);
  }, []);

  // Função para remover uma estação da playlist
  const removeStation = (stationuuid: string) => {
    const updatedPlaylist = playlist.filter(
      (station) => station.stationuuid !== stationuuid
    );
    setPlaylist(updatedPlaylist);
    localStorage.setItem("playlist", JSON.stringify(updatedPlaylist)); // Atualiza o localStorage
  };

  // Função para editar o nome de uma estação
  const editStationName = (stationuuid: string, newName: string) => {
    const updatedPlaylist = playlist.map((station) =>
      station.stationuuid === stationuuid
        ? { ...station, name: newName }
        : station
    );
    setPlaylist(updatedPlaylist);
    localStorage.setItem("playlist", JSON.stringify(updatedPlaylist)); // Atualiza o localStorage
  };

  return (
    <div className="border border-gray-300 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Sua Playlist</h2>

      {playlist.length === 0 ? (
        <div className="text-gray-600">
          Nenhuma estação foi adicionada à playlist ainda.
        </div>
      ) : (
        <ul>
          {playlist.map((station) => (
            <li key={station.stationuuid} className="mb-4">
              <StationPlayer
                station={station}
                onRemove={removeStation}
                onEdit={editStationName}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Novo componente para o player de cada estação
interface StationPlayerProps {
  station: Station;
  onRemove: (stationuuid: string) => void;
  onEdit: (stationuuid: string, newName: string) => void;
}

const StationPlayer: React.FC<StationPlayerProps> = ({
  station,
  onRemove,
  onEdit,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(station.name);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (!isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      // Salva o novo nome ao finalizar a edição
      onEdit(station.stationuuid, newName);
    }
    setIsEditing(!isEditing); // Alterna entre editar e visualizar
  };

  return (
    <div className="flex justify-between items-center">
      <div>
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border border-gray-300 rounded-lg p-1"
          />
        ) : (
          <strong>{station.name}</strong>
        )}{" "}
        - {station.country} ({station.codec})
      </div>

      {/* Player de áudio oculto */}
      <audio ref={audioRef} className="hidden">
        <source src={station.url_resolved} type={`audio/${station.codec}`} />
        Seu navegador não suporta o elemento de áudio.
      </audio>

      {/* Botão Play/Pause */}
      <button
        onClick={togglePlayPause}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mr-4"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>

      {/* Botão Editar */}
      <button
        onClick={handleEdit}
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded-lg mr-4"
      >
        {isEditing ? "Salvar" : "Editar"}
      </button>

      {/* Botão Remover */}
      <button
        onClick={() => onRemove(station.stationuuid)}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-lg"
      >
        Remover
      </button>
    </div>
  );
};

export default SavedPlaylist;
