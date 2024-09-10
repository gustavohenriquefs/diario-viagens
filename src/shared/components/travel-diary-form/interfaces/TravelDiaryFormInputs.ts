export interface TravelDiaryFormInputs {
  diaryId?: string;
  imagens: File[];
  destination: string;
  date: Date | null;
  note: string;
  createAt?: Date;
}
