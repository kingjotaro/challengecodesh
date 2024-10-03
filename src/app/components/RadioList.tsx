import React, { useEffect, useState } from 'react';

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
      <h2>Resultados da Pesquisa</h2>
      {loading && <div>Carregando estações...</div>}
      {!loading && stations.length === 0 && <div>Nenhuma estação encontrada.</div>}
      <ul>
        {stations.map((station) => (
          <li key={station.stationuuid}>
            <strong>{station.name}</strong> - {station.country} ({station.codec})
            <br />
            <audio controls style={{ width: '100%' }}>
              <source src={station.url_resolved} type={`audio/${station.codec}`} />
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RadioList;
