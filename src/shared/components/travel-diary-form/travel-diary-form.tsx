import { zodResolver } from '@hookform/resolvers/zod';
import debounce from 'lodash/debounce';
import { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, useForm, UseFormReset } from 'react-hook-form';
import { z } from 'zod';
import { travelDiaryToast } from '../../../contexts/message.context';
import { ButtonPrimary } from '../../../shared/components/buttons/button-primary';
import { Search } from "../../../shared/components/search/search";
import { UploadFile } from '../../../shared/components/upload-file/upload-file';
import { SearchOption } from '../search/interfaces/search-options';
import { GeoName } from './interfaces/GeoNames';
import { TravelDiaryFormInputs } from './interfaces/TravelDiaryFormInputs';
import { DateRangeForm } from '../datapicker/datapicker';

const GEOUSERNAME = process.env.REACT_APP_GEOUSERNAME;

interface TravelDiaryFormProps {
  travelDiaryFormData?: TravelDiaryFormInputs;
  handleSubmitTravelDiary: (data: TravelDiaryFormInputs) => Promise<void>;
  schema: z.ZodObject<z.ZodRawShape>;
  setResetForm?: (reset: UseFormReset<TravelDiaryFormInputs>) => void;
}

export const TravelDiaryForm = ({ travelDiaryFormData = undefined, handleSubmitTravelDiary, schema, setResetForm }: TravelDiaryFormProps) => {
  const [options, setOptions] = useState<SearchOption[] | undefined>();
  const { showToast } = travelDiaryToast();

  const { register, handleSubmit, setValue, control, reset, formState: { errors } } = useForm<TravelDiaryFormInputs>({
    defaultValues: travelDiaryFormData,
    resolver: zodResolver(schema),
  });

  const convertDateRange = (date: { start: Date | null, end: Date | null }) => {
    const start = date.start ? new Date(date.start) : null;
    const end = date.end ? new Date(date.end) : null;

    return { start, end };
  }

  useEffect(() => {
    if (travelDiaryFormData) {
      setValue('date', convertDateRange(travelDiaryFormData.date));
      setValue('destination', travelDiaryFormData.destination || '');
      setValue('note', travelDiaryFormData.note || '');
      setValue('images', travelDiaryFormData.images || []);
      setValue('diaryId', travelDiaryFormData.diaryId || '');
    }
  }, [travelDiaryFormData, setValue]);

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
  
  const onSubmit = async (data: TravelDiaryFormInputs) => {
    setResetForm?.(reset);
  
    await handleSubmitTravelDiary(data);
  }

  const debounceSearch = debounce(handleDestinationChange, 200);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full m-auto mt-16 mb-6 max-w-lg px-2">
      {travelDiaryFormData?.diaryId ? <div className="flex flex-wrap -mx-2 mb-6">
        <label htmlFor="diaryId" className="block text-gray-700 text-xs font-bold mb-2">
          ID
        </label>
        <input
          {...register("diaryId")}
          type="text"
          id="diaryId"
          className="block px-3 py-2 w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          placeholder="ID"
          readOnly
        />
      </div> : null}

      <div className="flex flex-wrap -mx-3 mb-6 px-4">
        <label htmlFor='fotos' className="block text-gray-700 text-xs font-bold mb-2">
        
        </label>

        <Controller
          name="images"
          control={control}
          render={({ field }) => (
            <UploadFile
              files={field.value}
              onFilesChange={(files) => {
                field.onChange(files);
              }}
            />
          )}
        />

        {errors.images && (
          <p className="text-red-500 text-xs italic">
            {errors.images.message}
          </p>
        )}
      </div>

      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full px-3">
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-destination">
            Destino
          </label>
          <Controller
            name="destination"
            control={control}
            render={({ field }) => (
              <Search
                onInput={(e) => {
                  debounceSearch(e.currentTarget.value);
                  field.onChange(e.currentTarget.value);
                }}
                initialValue={field.value}
                options={options}
                resetValue={field.value}
                setSelectedOption={(option) => {
                  field.onChange(option?.name);
                }}
                onSelect={(option) => {
                  field.onChange(option?.currentTarget.value);
                }}
              />
            )}
          />
          {errors.destination && (
            <p className="text-red-500 text-xs italic">
              {errors.destination.message}
            </p>
          )}
        </div>

        <div className='flex flex-wrap px-3 my-2'>
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-destination">
            Data
          </label>
          <div className="relative w-full">

            <DateRangeForm control={control} />

            {errors.date && (
              <p className="text-red-500 text-xs italic">
                {errors.date.message}
              </p>
            )}
          </div>
        </div>

        <div className="w-full px-3">
          <label htmlFor="note" className="block mb-2 text-sm font-medium text-gray-900">
            Notas
          </label>
          <textarea
            id="note"
            {...register("note")}
            rows={4}
            className="block px-3 py-2 w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Escreva suas notas de viagem"
          ></textarea>
          {errors.note && (
            <p className="text-red-500 text-xs italic">
              {errors.note.message}
            </p>
          )}
        </div>
      </div>
      <ButtonPrimary type="submit" label={'Criar'} />
      <script src="./node_modules/lodash/lodash.min.js"></script>
      <script src="./node_modules/dropzone/dist/dropzone-min.js"></script>
    </form>
  );
};
