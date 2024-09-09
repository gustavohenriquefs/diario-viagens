export interface TravelDiaryFormInputs {
  imagens: File[];
  destination: string;
  date: Date | null;
  note: string;
  createdBy?: string;
  createAt?: Date;
}
