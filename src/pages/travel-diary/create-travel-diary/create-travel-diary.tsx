import debounce from 'lodash/debounce';
import { useState } from "react";
import { Search } from "../../../shared/components/search/search";
import { Carousel } from '../../../shared/components/carrosel/carrosel';
import { Button } from '../../../shared/components/buttons/button';

const GEOUSERNAME = process.env.REACT_APP_GEOUSERNAME;

interface Option {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

export interface GeoNamesResponse {
  geonames: GeoName[];
  totalResultsCount: number;
}

export interface GeoName {
  adminCode1: string;
  adminName1: string;
  countryCode: string;
  countryName: string;
  fcl: string;
  fcode: string;
  geonameId: number;
  lat: number;
  lng: number;
  name: string;
  population: number;
  timezone: string;
  toponymName: string;
}

interface UnsplashImage {
  id: string;
  description: string | null;
  alt_description: string | null;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  user: {
    name: string;
    portfolio_url: string;
  };
}

// change interface or remove
interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

export const CreateTravelDiary = () => {
  const [options, setOptions] = useState<Option[] | undefined>();
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const searchDestination = async (query: string): Promise<GeoName[] | undefined> => {
    const endpoint = `http://api.geonames.org/searchJSON?q=${query}&maxRows=25&username=${GEOUSERNAME}`;

    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      return data.geonames;
    } catch (error) {
      console.error('Error fetching destinations:', error);
    }
  };

  const handleDestinationChange = async (query: string) => {
    const destinationsResponse = await searchDestination(query);

    const newOptions = destinationsResponse?.map((destination) => ({
      id: destination.geonameId,
      name: `${destination.countryName} - ${destination.toponymName}`,
      lat: destination.lat,
      lng: destination.lng
    }));

    setOptions(newOptions);

    return query;
  };

  const handleCreateTravel = () => {
    // user data

    // submit user data
  }


  // nice
  const handleSelectedOption = async (option?: Option): Promise<void> => {
    if (!option) return;

    const minLat = option.lat - 0.05;
    const maxLat = option.lat + 0.05;
    const minLng = option.lng - 0.05;
    const maxLng = option.lng + 0.05;

    // const endpoint = `https://www.mapillary.com/connect?client_id=8585315564836512`;

    // try {
    //   const response = await fetch(endpoint, { method: 'POST' });
    //   const data: UnsplashSearchResponse = await response.json();
    //   const imageUrls = data.results.map(imageData => {
    //     return imageData.urls.full;
    //   });

    //   setImageUrls(imageUrls);
    // } catch (error) {
    //   console.error('Error fetching images:', error);
    // }
  }

  const debounceSearch = debounce(handleDestinationChange, 200);

  return (
    <>

      <Search
        onInput={(e) => debounceSearch(e.currentTarget.value)}
        setSelectedOption={handleSelectedOption}
        options={options}
      />


      <Button onClick={handleCreateTravel} label={'Criar'} />

      <div className='m-8'>
        <Carousel imageUrls={imageUrls} />
      </div>
    </>
  );
};
