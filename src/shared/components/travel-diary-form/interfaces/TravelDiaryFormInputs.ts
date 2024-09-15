export interface TravelDiaryFormInputs {
  diaryId?: string;
  images: File[];
  destination: string;
  date: {
    start: Date | null;
    end: Date | null;
  };
  note: string;
  createAt?: Date;
}
