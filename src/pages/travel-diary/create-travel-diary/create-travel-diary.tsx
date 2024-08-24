import debounce from 'lodash/debounce';
import { useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import { CalendarDots } from '@phosphor-icons/react';
import { Search } from "../../../shared/components/search/search";
import { Carousel } from '../../../shared/components/carrosel/carrosel';
import { Button } from '../../../shared/components/buttons/button';
import "react-datepicker/dist/react-datepicker.css";

interface Option {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

const GEOUSERNAME = process.env.REACT_APP_GEOUSERNAME;

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


interface TravelDiaryFormInputs {
  destination: string;
  date: Date | null;
  note: string;
}

// Definindo o esquema de validação com zod
const schema = z.object({
  destination: z.string().min(1, { message: "Destino é obrigatório" }),
  date: z.date().nullable().refine((value) => value !== null, {
    message: "Data é obrigatória",
  }),
  note: z.string().min(5, { message: "Nota deve ter no mínimo 5 caracteres" }),
});

export const CreateTravelDiary = () => {
  const [options, setOptions] = useState<Option[] | undefined>();

  const { register, handleSubmit, control, formState: { errors } } = useForm<TravelDiaryFormInputs>({
    resolver: zodResolver(schema),
  });

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
  };

  const debounceSearch = debounce(handleDestinationChange, 200);

  const handleCreateTravel = (data: TravelDiaryFormInputs) => {
    console.log(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleCreateTravel)} className="w-full m-auto mt-16 max-w-lg">
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-destination">
              Destino
            </label>
            <Controller
              name="destination"
              control={control}
              render={({ field }) => (
                <Search
                  onInput={(e) => debounceSearch(e.currentTarget.value)}
                  options={options}
                  setSelectedOption={(option) => field.onChange(option?.name)}
                  onSelect={(option) => field.onChange(option)}
                />
              )}
            />
            {errors.destination && <p className="text-red-500 text-xs italic">{errors.destination.message}</p>}
          </div>

          <div className="w-full md:w-1/2 px-3">
            <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-date">
              Data
            </label>
            <div className="relative max-w-sm">
              <CalendarDots
                className="absolute m-auto z-10 inset-y-0 start-0 flex items-center pl-3 pointer-events-none"
                size={32}
              />
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    selected={field.value}
                    onChange={(date: Date | null) => field.onChange(date)}
                    className="appearance-none block w-full bg-gray-50 text-gray-700 border border-gray-200 rounded py-2 px-4 py-3 px-4 pl-10 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    placeholderText="Select date"
                    dateFormat="dd/MM/yyyy"
                  />
                )}
              />
              {errors.date && <p className="text-red-500 text-xs italic">{errors.date.message}</p>}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label htmlFor="note" className="block mb-2 text-sm font-medium text-gray-900">
              Notas
            </label>
            <textarea
              id="note"
              {...register("note")}
              rows={4}
              className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Escreva suas notas de viagem"
            ></textarea>
            {errors.note && <p className="text-red-500 text-xs italic">{errors.note.message}</p>}
          </div>
        </div>
        <Button type="submit" label={'Criar'} />
      </form>
    </>
  );
};
