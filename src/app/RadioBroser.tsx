import React, { useEffect, useState, useCallback } from "react";

// Definindo o tipo dos dados de cada estação
interface Station {
  stationuuid: string;
  name: string;
  country: string;
  codec: string;
  url_resolved: string;
}

const RadioBrowser: React.FC = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0); // Controla a página atual
  const [loadMore, setLoadMore] = useState<boolean>(false); // Para carregar mais estações

  const fetchStations = useCallback(async (reset: boolean = false) => {
    setLoading(true);
    try {
      const limit = 10;
      const offset = page * limit; // Calcula o offset com base na página atual
      const response = await fetch(`https://de1.api.radio-browser.info/json/stations/search?limit=${limit}&offset=${offset}`);
      const data: Station[] = await response.json();

      // Se reset for true, substitui a lista de estações, senão, adiciona mais estações
      setStations((prevStations) => (reset ? data : [...prevStations, ...data]));
    } catch (error) {
      console.error("Erro ao buscar estações de rádio:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchStations(true); // Quando a página muda, resetamos as estações
  }, [page, fetchStations]);

  // Função para carregar mais estações quando o usuário clica no botão ou atinge o final da página
  const handleLoadMore = () => {
    setLoadMore(true);
    fetchStations(false).then(() => setLoadMore(false));
  };

  // Detecção de scroll para carregar mais ao atingir o final da página
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading) {
        handleLoadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  return (
    <div>
      <h1>Estações de Rádio</h1>

      {/* Lista de Estações */}
      <ul>
        {stations.map((station) => (
          <li key={station.stationuuid}>
            <strong>{station.name}</strong> - {station.country} ({station.codec})
            <br />
            <audio controls>
              <source src={station.url_resolved} type={`audio/${station.codec}`} />
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </li>
        ))}
      </ul>

      {/* Carregando */}
      {loading && <div>Carregando estações...</div>}

      {/* Botões de Paginação */}
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => setPage((prev) => Math.max(prev - 1, 0))} disabled={page === 0 || loading}>
          Anterior
        </button>
        <button onClick={() => setPage((prev) => prev + 1)} disabled={loading}>
          Próxima
        </button>
      </div>

      {/* Botão Carregar Mais */}
      {!loading && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleLoadMore} disabled={loadMore}>
            {loadMore ? "Carregando mais..." : "Carregar mais"}
          </button>
        </div>
      )}
    </div>
  );
};

export default RadioBrowser;
