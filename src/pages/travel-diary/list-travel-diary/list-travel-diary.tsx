import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useEffect, useState } from "react";
import { TravelDiaryFormInputs } from "../../../shared/components/travel-diary-form/interfaces/TravelDiaryFormInputs";

export const ListTravelDiary = () => {
  const [diaries, setDiaries] = useState<TravelDiaryFormInputs[]>([]);

  const getDiaries = async () => {
    const id = auth.currentUser?.uid ?? '';
    const querySnapshot = await getDocs(collection(db, 'users', id, 'diaries'));

    setDiaries(querySnapshot.docs.map(doc => (doc.data() as TravelDiaryFormInputs)));

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


  return (
    <section className="px-2">
      <h1>Minhas viagens</h1>

      {/* mostrar diarios */}
      <ul className="px-2">
        <div className="mt-12 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {
            diaries.map((items, key) => (
              <article className="bg-white w-full max-w-md mx-auto mt-4 shadow-lg border rounded-md duration-300 hover:shadow-sm" key={key}>
                <a href={''}>
                  <img src={''} loading="lazy" alt={items.destination} className="w-full h-48 rounded-t-md" />
                  <div className="flex items-center mt-2 pt-3 ml-4 mr-2">
                    {/* <div className="flex-none w-10 h-10 rounded-full">
                      <img src={items.authorLogo} className="w-full h-full rounded-full" alt={items.authorName} />
                    </div> */}
                    <div className="ml-3">
                      <span className="block text-gray-900">{items.destination}</span>
                      <span className="block text-gray-400 text-sm">{items.note}</span>
                    </div>
                  </div>
                  <div className="pt-3 ml-4 mr-2 mb-3">
                    <h3 className="text-xl text-gray-900">
                      {items.destination}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{items.note}</p>
                  </div>
                </a>
              </article>
            ))
          }
        </div>
      </ul>
    </section>
  )
};