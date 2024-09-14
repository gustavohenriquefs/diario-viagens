export interface TravelDiaryResponse {
  diaryId: string;
  images: string[];
  destination: string;
  date: Date | null;
  note: string;
  createAt: Date;
}