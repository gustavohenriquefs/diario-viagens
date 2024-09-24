import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../../firebase";
import { TravelDiaryResponse } from "../../../shared/components/travel-diary-form/interfaces/travel-diary-response";
import imageLocalDefault from '../../../shared/images/no-image.svg';
import { Trash } from "@phosphor-icons/react/dist/ssr";
import { travelDiaryToast } from "../../../contexts/message.context";
import { Modal } from "../../../shared/components/modal/modal";
import { on } from "events";
import { Toast } from "react-toastify/dist/components";

const ModalConfirmationContent = ({ message, onConfirm, handleCloseModal }: {
  message: string,
  onConfirm: () => void,
  handleCloseModal: () => void
}) => {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="flex justify-start text-lg font-semibold">Confirmação</h1>
      <p className="text-sm">{message}</p>
      <div className="flex justify-end mt-4 gap-3">
        <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded text-sm px-5 py-2 me-2 mb-2" onClick={onConfirm}>Excluir</button>
        <button className="focus:outline-none text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded text-sm px-5 py-2 me-2 mb-2" onClick={handleCloseModal}>Cancelar</button>
      </div>
    </div>
  );
}



export const ListTravelDiary = () => {
  const [diaries, setDiaries] = useState<TravelDiaryResponse[]>([]);
  const { showToast } = travelDiaryToast();
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>();
  const [trashIsFilled, setTrashIsFilled] = useState<boolean>(false);

  useEffect(() => {
    const getDiaries = async () => {
      const id = auth.currentUser?.uid ?? '';
      const querySnapshot = await getDocs(collection(db, 'users', id, 'diaries'));

      setDiaries(querySnapshot.docs.map(doc => {
        return {
          ...doc.data() as TravelDiaryResponse,
          diaryId: doc.id,
        };
      }));
    };

    getDiaries();
  }, []);

  const hasImages = (images: string[]) => {
    return images && images.length > 0;
  }

  const onDeletedDiary = async (diaryId: string | undefined) => {
    if (!diaryId) {
      showToast('Diário inválido', 'error');
      return;
    }

    try {
      const diaryRef = doc(db, 'users', auth.currentUser?.uid ?? '', 'diaries', diaryId);
      await deleteDoc(diaryRef);

      setDiaries(diaries.filter(diary => diary.diaryId !== diaryId));

      showToast('Diário excluído com sucesso', 'success');
    } catch (error) {
      showToast('Erro ao excluir diário! Tente novamente mais tarde.', 'error');
    }

    setIsOpenPopup(false);
  }


  const handleDeleteDiary = (diaryId: string) => async (event: React.MouseEvent<SVGSVGElement>) => {
    event.preventDefault();

    setIsOpenPopup(true);
    setSelectedCardId(diaryId);
  }
  return (
    <section className="px-4 mt-4">
      <h1 className="flex justify-left text-2xl font-bold mb-4">Minhas viagens</h1>

      <ul>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {
            diaries.map((items, key) => (
              <Link to={`/home/diary-travels/${items.diaryId}`} key={items.diaryId}>
                <article className="relative bg-white w-full max-w-md mx-auto mt-4 shadow-lg border rounded-md duration-300 hover:shadow-sm" key={key}>
                  <Trash
                    weight={trashIsFilled ? 'fill' : 'bold'}
                    onMouseEnter={() => setTrashIsFilled(true)}
                    onMouseLeave={() => setTrashIsFilled(false)}
                    className="absolute top-2 right-2 text-red-500 cursor-pointer hover:text-red-700"
                    onClick={handleDeleteDiary(items.diaryId)}
                  />

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

      <Modal
        isOpen={isOpenPopup}
        content={<ModalConfirmationContent message="Deseja realmente excluir esse diário?" onConfirm={() => onDeletedDiary(selectedCardId)}
          handleCloseModal={() => setIsOpenPopup(false)} />} onClose={() => setIsOpenPopup(false)}
      />
    </section>
  )
};