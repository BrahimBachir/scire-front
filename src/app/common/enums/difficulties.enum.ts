import { IDifficulty } from "../models/interfaces";

export const DifficultyList: IDifficulty[] = [
  { code: 'EXTREMELY_LOW', minValue: 0, maxValue: 3, name: 'Muy baja' },
  { code: 'LOW', minValue: 3, maxValue: 5, name: 'Baja' },
  { code: 'MIDDLE', minValue: 5, maxValue: 6, name: 'Media' },
  { code: 'HIGHT', minValue: 6, maxValue: 8, name: 'Alta' },
  { code: 'EXTREMELY_HIGHT', minValue: 8, maxValue: 10, name: 'Muy alta' },
]