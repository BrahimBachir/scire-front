
import {
  AppInitState,
  AuthState,
  LearningState,
  UsersState,
} from '.';
import { IAddress, ICategory, ICourse, IEmail, IGender, IPermit, IPhone, IQuestion, IRole, ISection, ITest, ITopic, IUser } from '../interfaces';

export const DEFAULT_ROLE: IRole = {
  id: 0,
  description: '',
  code: '',
  by_default: false,
};

export const DEFAULT_PERMIT: IPermit = {
  id: 0,
  description: '',
  code: ''
};

export const DEFAULT_PERMITS: IPermit[] = [
  {
    ...DEFAULT_PERMIT
  },
];

export const DEFAULT_GENDER: IGender = {
  id: 0,
  description: '',
  code: '',
  by_default: false,
};

export const DEFAULT_EMAIL: IEmail = {
  id: 0,
  code: '',
  description: '',
  value: ''
}

export const DEFAULT_EMAILS: IEmail[] = [{
  ...DEFAULT_EMAIL
}]

export const DEFAULT_PHONE: IPhone = {
  id: 0,
  code: '',
  description: '',
  number: '',
  active: false
}

export const DEFAULT_PHONES: IPhone[] = [{
  ...DEFAULT_PHONE
}]

export const DEFAULT_ADDRESS: IAddress = {
  id: 0,
  code: '',
  street: '',
  number: 0,
  other_info: '',
  postal_code: ''
}

export const DEFAULT_ADDRESSES: IAddress[] = [{
  ...DEFAULT_ADDRESS
}]


export function createDefaultUser(): IUser {
  return {
    id: 0,
    name: '',
    image: '',
    first_surname: '',
    second_surname: '',
    full_name: '',
    emails: DEFAULT_EMAILS,
    phones: DEFAULT_PHONES,
    permits: [],
    active: true,
    role: DEFAULT_ROLE,
    gender: DEFAULT_GENDER,
    isSelected: false,
    birth_date: '',
    code: '',
    addresses: DEFAULT_ADDRESSES,
  };
}

export const DEFAULT_USERS: IUser[] = [{
  ...createDefaultUser()
}]

export const DEFAULT_CATEGORY: ICategory = {
  id: 0,
  name: ''
}

export const DEFAULT_SECTION: ISection = {
  id: 0,
  name: '',
  category: DEFAULT_CATEGORY
}

export const DEFAULT_TOPIC: ITopic = {
  id: 0,
  name: '',
  description: '',
  summary: '',
  sources: [],
  mermaids: [],
  videos: [],
  scaffolder: ''
}

export const DEFAULT_QUESTION: IQuestion = {
  id: 0,
  text: '',
  answers: [],
  difficulty: 0,
  explanation: ''
}

export const DEFAULT_COURSE: ICourse = {
  id: 0,
  code: '',
  description: '',
  calling_org: undefined,
  calling_year: '',
  examDate: undefined,
  type: undefined,
  vacancies: 0
}

export function createDefaultTest(): ITest {
  return {
    id: 0,
    corrctAnswers: 0,
    wrongAnswers: 0,
    notAnswered: 0,
    questions: [],
    testQuestions: [],
    time_allowed: 0,
    original_time: 0,
    time_consumed: 0,
    date: undefined,
    score: 0,
    type: {
      code: 'REVIEW',
      name: ''
    },
    user: createDefaultUser(),
    numQuestions: 0,
  };
}



/* STATES */

export const InitialLearningState: LearningState = {
  categories: [DEFAULT_CATEGORY],
  sections: [DEFAULT_SECTION],
  topics: [DEFAULT_TOPIC],
  questions: [DEFAULT_QUESTION],
  courses: [DEFAULT_COURSE],
  selectedCourse: DEFAULT_COURSE
}

export const InitialAuthState: AuthState = {
  token: '',
  code: '',
  user: createDefaultUser(),
  logedIn: false,
  verifying: false,
  verifyingEmail: false,
};

export const InitialUsersState: UsersState = {
  users: DEFAULT_USERS,
  selected: createDefaultUser(),
  total: 0,
  loading: false,
}

export const InitialAppState: AppInitState = {
  auth: InitialAuthState,
  users: InitialUsersState,
  learning: InitialLearningState,
};
