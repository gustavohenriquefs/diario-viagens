export interface TravelDiaryFormInputs {
  diaryId?: string;
  images: File[];
  destination: string;
  date: Date | null;
  note: string;
  createAt?: Date;
}
