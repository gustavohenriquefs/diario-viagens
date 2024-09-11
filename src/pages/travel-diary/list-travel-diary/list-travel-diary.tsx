import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../../firebase";

interface Diary {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
}

export const ListTravelDiary = () => {

  // const [diaries, setDiaries] = useState([]);

  const getMyDiariesTravels = async () => {
    const uid = auth.currentUser?.uid;
    const diariesRef = collection(db, `users/${uid}/diaries`);

    const diariesSnapshot = await getDocs(diariesRef);
    
    return diariesSnapshot.docs.map((doc) => doc.data());
  }

  return (
    <div>
      <h1>Minhas viagens</h1>


    </div>
  )
};