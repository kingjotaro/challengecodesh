import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

interface Station {
  stationuuid: string;
  name: string;
  country: string;
  codec: string;
  url_resolved: string;
}

export default function RadioSearchAutocomplete() {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<readonly Station[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Função para buscar estações de rádio na API
  const fetchStations = async (searchTerm: string): Promise<Station[]> => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://de1.api.radio-browser.info/json/stations/search?name=${encodeURIComponent(searchTerm)}&limit=10`
      );
      const data: Station[] = await response.json();
      return data;
    } catch (error) {
      console.error("Erro ao buscar estações de rádio:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Debounce para limitar a quantidade de requisições
  const debouncedFetch = React.useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm) {
        const result = await fetchStations(searchTerm);
        setOptions(result);
      } else {
        setOptions([]); // Limpar as opções quando o campo estiver vazio
      }
    }, 300),
    []
  );

  // Handler para quando o usuário digitar algo
  const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
    debouncedFetch(value);
  };

  return (
    <Autocomplete
      sx={{ width: 300 }}
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      filterOptions={(x) => x} // Desativa o filtro padrão
      onInputChange={handleInputChange} // Busca ao alterar o texto
      getOptionLabel={(option) => option.name} // Exibe o nome da estação
      options={options} // Define as opções com base na busca
      loading={loading} // Mostra o estado de carregamento
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Radio Stations"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props} key={option.stationuuid}>
          <div>
            <strong>{option.name}</strong> - {option.country} ({option.codec})
            <br />
            <audio controls style={{ width: "100%" }}>
              <source src={option.url_resolved} type={`audio/${option.codec}`} />
              Seu navegador não suporta o elemento de áudio.
            </audio>
          </div>
        </li>
      )}
    />
  );
}

// Debounce utility
function debounce(func: (...args: any[]) => void, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(null, args), wait);
  };
}
