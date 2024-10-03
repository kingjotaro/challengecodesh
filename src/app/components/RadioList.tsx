import React, { useEffect, useState } from 'react';
import AudioPlayer from './AudioPlayer'; // Importe o player customizado

interface Station {
  stationuuid: string;
  name: string;
  country: string;
  codec: string;
  url_resolved: string;
}

interface RadioListProps {
  searchTerm: string;
}

const RadioList: React.FC<RadioListProps> = ({ searchTerm }) => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStations = async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(searchTerm)}&limit=10`
      );
      const data: Station[] = await response.json();
      setStations(data);
    } catch (error) {
      console.error("Erro ao buscar estações de rádio:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      fetchStations(searchTerm);
    } else {
      setStations([]); // Limpa as estações quando não há termo de busca
    }
  }, [searchTerm]);

  return (
    <div>
      
      {loading && <div>Carregando estações...</div>}
      {!loading && stations.length === 0 && <div>Nenhuma estação encontrada.</div>}
      
      <ul>
        {stations.map((station) => (
          <li key={station.stationuuid}>
            <AudioPlayer station={station} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RadioList;
