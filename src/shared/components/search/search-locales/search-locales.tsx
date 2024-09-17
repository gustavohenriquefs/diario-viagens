import { forwardRef, useState } from "react";
import { Search } from "../search";
import { SearchOption } from "../interfaces/search-options";
import { GeoName } from "../../travel-diary-form/interfaces/GeoNames";
import { travelDiaryToast } from "../../../../contexts/message.context";

const GEOUSERNAME = process.env.REACT_APP_GEOUSERNAME;

// posso somente ter uma propriedade chamada ref para conseguir passar o ref para o input
// e pegar o valor do controller ou passar um valor para ele
export const SearchLocales = forwardRef<HTMLInputElement, { value: string, onChange: (value: string) => void }>(({ value, onChange }, ref) => {
  const [options, setOptions] = useState<SearchOption[] | undefined>();

  const { showToast } = travelDiaryToast();

  const handleSetLocaleValue = (value?: SearchOption) => {

  }

  const searchDestination = async (query: string): Promise<GeoName[] | undefined> => {
    const endpoint = `http://api.geonames.org/searchJSON?q=${query}&maxRows=25&username=${GEOUSERNAME}`;

    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.geonames;
    } catch (error) {
      showToast('Erro ao buscar destinos', 'error');
    }
  };

  const handleDestinationChange = async (query: string) => {
    if (!query) {
      setOptions([]);
      return;
    }
    const destinationsResponse = await searchDestination(query);

    const newOptions = destinationsResponse?.map((destination) => ({
      id: destination.geonameId,
      name: `${destination.countryName} - ${destination.toponymName}`,
      lat: destination.lat,
      lng: destination.lng
    }));

    setOptions(newOptions);
  };

  return (
    <Search 
      options={options} 
      setSelectedOption={handleSetLocaleValue} 
      initialValue={value}
      ref={ref} 
    />
  );
});