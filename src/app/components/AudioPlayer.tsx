import React, { useRef, useState } from "react";
import AddToPlaylistButton from "./AddToPlaylistButton";

export interface Station {
  stationuuid: string;
  name: string;
  country: string;
  codec: string;
  url_resolved: string;
}

interface AudioPlayerProps {
  station: Station;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ station }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  // Função play pause
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

  // Função volume
  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className="border shadow-lg rounded-lg p-4 w-full mb-4">
      <div className="flex flex-row justify-between items-center p-1 border border-gray-300 rounded-lg shadow-md bg-white">
        <div className="text-lg font-bold text-gray-800">{station.name}</div>
        <AddToPlaylistButton station={station} />
      </div>

      <span className="block text-sm text-gray-600">
        {station.country} ({station.codec})
      </span>

      <audio ref={audioRef} className="hidden">
        <source src={station.url_resolved} type={`audio/${station.codec}`} />
        Seu navegador não suporta o elemento de áudio.
      </audio>

      <div className="mt-4 flex items-center">
        {/* Botão de Play/Pause */}
        <button
          onClick={togglePlayPause}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg mr-4"
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        {/* Controle de Volume */}
        <div className="flex items-center">
          <label className="mr-2 text-gray-700">Volume:</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={changeVolume}
            className="w-32"
          />
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
