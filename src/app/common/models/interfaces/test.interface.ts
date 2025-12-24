import { ITestQuestion, IQuestion, ITopic, IUser, ITaskType, ITestType, IDifficulty, ISection, ICategory } from '.';

export interface ITest {
  id: number; // ID del examen
  corrctAnswers: number; // Respuestas correctas
  wrongAnswers: number; // Respuestas correctas e incorrectas
  notAnswered: number; // Respuestas correctas, incorrectas y no respondidas
  questions?: IQuestion[]; // Preguntas del examen
  testQuestions?: ITestQuestion[]; // Preguntas del examen
  numQuestions: number; // Número de preguntas del examen
  time_allowed: number; // Tiempo en segundos
  time_consumed: number; // Tiempo en segundos
  original_time: number; // Tiempo original en segundos
  date: Date | undefined; // Fecha del examen
  score: number; // Puntuación del examen (puede almacenar valores decimales)
  topic?: ITopic; // ID del tema (opcional para simulacro)
  completed?: boolean; // Indica si el examen ha sido completado
  timed?: boolean;
  user: IUser;
  category?: ICategory;
  difficulty?: IDifficulty;
  section?: ISection;
  type?: ITestType;
}

export interface IIncomingTests {
    total: number;
    rows: ITest[];
}

