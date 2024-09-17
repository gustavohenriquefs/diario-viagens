/* eslint-disable react-hooks/exhaustive-deps */
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { z } from "zod";
import { useAuth } from "../../../contexts/auth.context";
import { travelDiaryToast } from "../../../contexts/message.context";
import { db, storage } from "../../../firebase";
import { Load } from "../../../shared/components/load/load";
import { TravelDiaryFormInputs } from "../../../shared/components/travel-diary-form/interfaces/TravelDiaryFormInputs";
import { TravelDiaryForm } from "../../../shared/components/travel-diary-form/travel-diary-form";

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
  date: dateSchema.nullable(),
  note: z.string().min(5, { message: "Nota deve ter no mínimo 5 caracteres" }),
});

export const UpdateTravelDiary: React.FC = () => {
  const [diary, setDiary] = useState<TravelDiaryFormInputs | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const uid = useAuth()?.user?.uid;

  const diaryId = useParams<{ id: string }>().id;
  const { showToast } = travelDiaryToast();

  const convertURLsToFiles = async (urls: string[]): Promise<File[]> => {
    const promises = urls.map(async (url) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return new File([blob], 'image.png', { type: 'image/png' });
    });

    const files = await Promise.all(promises);
    return files;
  };

  const getTravelDiaryById = async (diaryId: string) => {
    try {
      if (!uid) {
        showToast('Usuário não autenticado', 'error');
        return;
      }

      const docRef = doc(db, 'users', uid, 'diaries', diaryId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const images = await convertURLsToFiles(data.images);
        const travelDiary: TravelDiaryFormInputs = {
          diaryId: diaryId,
          images,
          destination: data.destination,
          date: {
            start: data.date.start.toDate(),
            end: data.date.end.toDate(),
          },
          note: data.note,
        }

        setDiary(travelDiary);
      } else {
        showToast('Diário de viagem não encontrado', 'error');
        setDiary(undefined);
      }
    } catch (error) {
      showToast('Erro ao buscar diário de viagem', 'error');
    }
  }

  useEffect(() => {
    if (!diaryId) {
      showToast('Diário de viagem não encontrado', 'error');
      return;
    }

    setLoading(true);
    getTravelDiaryById(diaryId).then(() =>
      setLoading(false)
    );
  }, [diaryId]);

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
    if (!diaryId) {
      showToast('Diário de viagem não encontrado', 'error');
      return;
    }

    if (!uid) {
      showToast('Usuário não autenticado', 'error');
      return;
    }

    try {
      const travelDiaryRef = doc(db, 'users', uid, 'diaries', diaryId);

      const urls = await uploadImages(data.images, uid);

      const reqBody = {
        ...data,
        images: urls,
      };

      await setDoc(travelDiaryRef, reqBody, { merge: true });

      showToast('Diário de viagem atualizado com sucesso', 'success');

      await getTravelDiaryById(diaryId);
    } catch (error) {
      showToast('Erro ao atualizar diário de viagem', 'error');
    }
  };

  return (
    <>
      {loading ? (
        <Load />
      ) : (
        <TravelDiaryForm
          travelDiaryFormData={diary}
          handleSubmitTravelDiary={handleSubmitTravelDiary}
          schema={schema}
        />
      )}
    </>
  );
};
