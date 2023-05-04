export interface HistoryExerciseDTO {
  created_at: string;
  exercise_id: number;
  group: string;
  hour: string;
  id: number;
  name: string;
  user_id: number;
}

export interface HistoryDTO {
  title: string;
  data: HistoryExerciseDTO[];
}
