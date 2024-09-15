import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import "react-datepicker/dist/react-datepicker.css";
import { v4 as uuidv4 } from 'uuid';
import { z } from "zod";
import { useAuth } from '../../../contexts/auth.context';
import { travelDiaryToast } from "../../../contexts/message.context";
import { db, storage } from '../../../firebase';
import { TravelDiaryFormInputs } from "../../../shared/components/travel-diary-form/interfaces/TravelDiaryFormInputs";
import { TravelDiaryForm } from '../../../shared/components/travel-diary-form/travel-diary-form';

const dateSchema = z.object({
  start: z.date().refine((value) => value !== null, {
    message: "Data inicial é obrigatória",
  }),
  end: z.date().optional(),
});
 
const schema = z.object({
  diaryId: z.string().optional(),
  images: z.array(z.any()).min(1, { message: "Imagens são obrigatórias" }).max(10, { message: "Máximo de 10 imagens" }),
  destination: z.string().min(1, { message: "Destino é obrigatório" }),
  date:  dateSchema.nullable(),
  note: z.string().min(5, { message: "Nota deve ter no mínimo 5 caracteres" }),
});

export const CreateTravelDiary = () => {
  const { showToast } = travelDiaryToast();
  const uid = useAuth()?.user?.uid;

  const uploadImages = async (images: File[], uid: string): Promise<string[]> => {
    const uploadPromises = images.map(async (image) => {
      const storageRef = ref(storage, `users/${uid}/images/${image.name}`);
      try {
        await uploadBytes(storageRef, image);
        const url = await getDownloadURL(storageRef);
        return url;
      } catch (error) {
        showToast('Erro ao salvar imagens', 'error');
        throw error;
      }
    });

    try {
      const urls = await Promise.all(uploadPromises);
      return urls;
    } catch (error) {
      showToast('Erro ao salvar imagens', 'error');
      return [];
    }
  };

  const handleSubmitTravelDiary = async (data: TravelDiaryFormInputs) => {
    if (!uid) {
      showToast('Usuário não autenticado', 'error');
      return;
    }

    try {
      const travelDiaryRef = collection(db, `users/${uid}/diaries`);

      data.createAt = new Date();
      data.diaryId = uuidv4();

      const urls = await uploadImages(data.images, uid);

      const reqBody = {
        ...data,
        images: urls,
      };

      await addDoc(travelDiaryRef, reqBody);

      showToast('Diário de viagem criado com sucesso', 'success');
    } catch (error) {
      showToast('Não foi possível criar o diário de viagem', 'error');
    }
  };

  return (
    <TravelDiaryForm handleSubmitTravelDiary={handleSubmitTravelDiary} schema={schema} />
  );
};
