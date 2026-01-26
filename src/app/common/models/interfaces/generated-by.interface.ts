export interface IGeneratedBy {
  title: 'AI' | 'Instructor' | 'Comunidad' | 'Equipo Scire';
  icon: 'sparkles' | 'user-heart' | 'users-group' | 'building-bank';
}

export interface ICreationType {
  id: number;
  description: string;
  code: string;
  icon: string;
}