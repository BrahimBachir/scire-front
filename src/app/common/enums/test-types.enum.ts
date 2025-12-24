import { ITestType } from "../models/interfaces";

export const TestTypesList: ITestType[] = [
  { code: 'REAL', name: 'Examen real' },
  { code: 'REVIEW', name: 'Repaso de temario' },
  { code: 'MOCK', name: 'Simulacro de examen' },
  { code: 'CONCEPTS', name: 'Repaso de conceptos' },
  { code: 'DEADLINES', name: 'Repaso de plazos' },
  { code: 'DEFINITIONS', name: 'Repaso de definiciones' },
]
