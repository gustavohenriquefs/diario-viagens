import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { TravelDiaryResponse } from "../../../shared/components/travel-diary-form/interfaces/travel-diary-response";
import imageLocalDefault from '../../../shared/images/no-image.svg';

export const ListTravelDiary = () => {
  const [diaries, setDiaries] = useState<TravelDiaryResponse[]>([]);

  const getDiaries = async () => {
    const id = auth.currentUser?.uid ?? '';
    const querySnapshot = await getDocs(collection(db, 'users', id, 'diaries'));

    setDiaries(querySnapshot.docs.map(doc => {
      doc.data() as TravelDiaryResponse
      return {
        ...doc.data() as TravelDiaryResponse,
        diaryId: doc.id as string,
      }
    }));

    return diaries;
  }

  useEffect(() => {
    getDiaries();
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) {
      return '';
    }

    return new Intl.DateTimeFormat('pt-BR').format(date);
  }

  const hasImages = (images: string[]) => {
    return images && images.length > 0;
  }

  return (
    <section className="px-2">
      <h1 className="text-xl">Minhas viagens</h1>

      <ul className="px-2">
        <div className="mt-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {
            diaries.map((items, key) => (
              <Link to={`/home/diary-travels/${items.diaryId}`} key={key}>
                {(items.diaryId)}
                <article className="bg-white w-full max-w-md mx-auto mt-4 shadow-lg border rounded-md duration-300 hover:shadow-sm" key={key}>

                  <img src={hasImages(items.images) ? items.images[0] : imageLocalDefault} loading="lazy" alt={`Fotos de ${items.destination}`} className="w-full h-48 rounded-t-md" />

                  <div className="pt-3 ml-4 mr-2 mb-3">
                    <h3 className="text-lg text-gray-900">
                      {items.destination}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{items.note}</p>
                  </div>

                </article>
              </Link>
            ))
          }
        </div>
      </ul>

    </section>
  )
};