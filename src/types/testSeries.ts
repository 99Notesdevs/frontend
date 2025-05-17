export interface TestSeriesData {
  name: string;
  correctAttempted: number;
  wrongAttempted: number;
  notAttempted: number;
  partialAttempted: number;
  partialNotAttempted: number;
  partialWrongAttempted: number;
  timeTaken: number;
  questionsSingle: number;
  questionsMultiple: number;
  questionIds: number[];
  id?: number;
  questions?: any[]; // Optional since it might not be needed in all contexts
}
