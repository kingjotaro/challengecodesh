import React from "react";
import { Station } from "./AudioPlayer";

interface AddToPlaylistButtonProps {
  station: Station;
}

const AddToPlaylistButton: React.FC<AddToPlaylistButtonProps> = ({ station }) => {
  const handleAddToPlaylist = () => {
    // Obtém a playlist existente ou cria uma nova lista vazia
    const savedPlaylist = JSON.parse(localStorage.getItem("playlist") || "[]");

    // Adiciona a nova estação à playlist
    const updatedPlaylist = [...savedPlaylist, station];

    // Salva a playlist atualizada no localStorage
    localStorage.setItem("playlist", JSON.stringify(updatedPlaylist));

    alert(`${station.name} foi adicionada à sua playlist!`);
  };

  return (
    <button
      onClick={handleAddToPlaylist}
      className="text-sm bg-cyan-600 hover:bg-blue-600 text-white font-bold rounded-lg p-2"
    >
      Add to Playlist
    </button>
  );
};

export default AddToPlaylistButton;
