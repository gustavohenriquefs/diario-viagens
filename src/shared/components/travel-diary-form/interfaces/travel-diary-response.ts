export interface TravelDiaryResponse {
  diaryId: string;
  images: string[];
  destination: string;
  date: {
    start: Date | null;
    end: Date | null;
  };
  note: string;
  createAt: Date;
}