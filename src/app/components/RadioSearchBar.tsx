import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

interface RadioSearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const RadioSearchBar: React.FC<RadioSearchBarProps> = ({ onSearch }) => {
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<{}>, value: string) => {
    setLoading(true);
    onSearch(value);
    setLoading(false);
  };

  return (
    <Autocomplete
      sx={{ width: 300 }}
      filterOptions={(x) => x} // Desativa o filtro padrão do Autocomplete
      onInputChange={handleInputChange} // Chama o onSearch com o valor digitado
      freeSolo // Permite entrada livre, não apenas opções
      options={[]} // Não exibimos opções diretamente no Autocomplete
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search Radio Stations Here"
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
    />
  );
};

export default RadioSearchBar;
