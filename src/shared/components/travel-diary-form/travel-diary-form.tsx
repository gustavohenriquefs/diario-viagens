import debounce from 'lodash/debounce';
import { useState } from "react";
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import { CalendarDots } from '@phosphor-icons/react';
import { Search } from "../../../shared/components/search/search";
import { ButtonPrimary } from '../../../shared/components/buttons/button-primary';
import "react-datepicker/dist/react-datepicker.css";
import { UploadFile } from '../../../shared/components/upload-file/upload-file';
import { TravelDiaryFormInputs } from './interfaces/TravelDiaryFormInputs';
import { GeoName } from './interfaces/GeoNames';
import { SearchOption } from '../search/interfaces/search-options';
import { addDoc, arrayUnion, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { app, auth, db } from '../../../firebase';
import { get } from 'lodash';
import { travelDiaryToast } from '../../../contexts/message.context';

const GEOUSERNAME = process.env.REACT_APP_GEOUSERNAME;

const schema = z.object({
  destination: z.string().min(1, { message: "Destino é obrigatório" }),
  date: z.date().nullable().refine((value) => value !== null, {
    message: "Data é obrigatória",
  }),
  note: z.string().min(5, { message: "Nota deve ter no mínimo 5 caracteres" }),
});

interface TravelDiaryFormProps {
  travelDiaryFormData?: TravelDiaryFormInputs;
}

export const TravelDiaryForm = ({ travelDiaryFormData = undefined }: TravelDiaryFormProps) => {
  const [options, setOptions] = useState<SearchOption[] | undefined>();
  const uid = auth.currentUser?.uid;
  const { showToast } = travelDiaryToast();

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<TravelDiaryFormInputs>({
    defaultValues: travelDiaryFormData,
    resolver: zodResolver(schema),
  });

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
      console.error('Error fetching destinations:', error);
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

  const debounceSearch = debounce(handleDestinationChange, 200);

  const resetForm = () => {
    reset({
      destination: '',
      date: null,
      note: '',
      createdBy: ''
    });
  };

  const handleCreateTravel = async (data: TravelDiaryFormInputs) => {
    try {
      const travelDiaryRef = collection(db, 'diarios');

      // Adiciona o diário de viagem com o userId do usuário autenticado
      await addDoc(travelDiaryRef, {
        ...data,
        userId: uid, // Inclui o userId no documento
        createdAt: new Date(),
      });

      showToast('Diário de viagem criado com sucesso', 'success');

      resetForm();
    } catch (error) {
      showToast('Não foi possível criar o diário de viagem', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCreateTravel)} className="w-full m-auto mt-16 max-w-lg">
      <div className="flex flex-wrap -mx-3 mb-6">
        <label htmlFor='fotos' className="block text-gray-700 text-xs font-bold mb-2">
          Fotos
        </label>
        <UploadFile />
      </div>

      <div className="flex flex-wrap -mx-3 mb-6">
        <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-destination">
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
          {errors.destination && (
            <p className="text-red-500 text-xs italic">
              {errors.destination.message}
            </p>
          )}
        </div>

        <div className="w-full md:w-1/2 px-3">
          <label className="block tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-date">
            Data
          </label>
          <div className="relative w-full">
            <CalendarDots
              className="absolute m-auto z-10 inset-y-0 start-0 flex items-center pl-3 pointer-events-none"
              size={32}
            />
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  calendarClassName='w-100 block'
                  selected={field.value}
                  onChange={(date: Date | null) => field.onChange(date)}
                  className="w-full bg-gray-50 text-gray-700 border border-gray-200 rounded px-3 py-2 pl-10 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                  placeholderText="Select date"
                  dateFormat="dd/MM/yyyy"
                />
              )}
            />
            {errors.date && (
              <p className="text-red-500 text-xs italic">
                {errors.date.message}
              </p>
            )}
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
