export type BulkImportType =
  | 'CATEGORY'
  | 'SECTION'
  | 'TOPIC'
  | 'BLOCK'
  | 'ARTICLE'
  | 'QUESTION'
  | 'FLASHCARD'
  | 'DIAGRAM'
  | 'VIDEO';

export type BulkImportStatus =
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'COMPLETED_WITH_ERRORS'
  | 'FAILED';

export interface IBulkImportIssue {
  row: number;
  field?: string;
  message: string;
  severity: 'ERROR' | 'WARNING';
}

export interface IBulkImportValidationReport {
  type: BulkImportType;
  totalRows: number;
  validRows: number;
  rejectedRows: number;
  issues: IBulkImportIssue[];
}

export interface IBulkImportJob {
  id: number;
  type: BulkImportType;
  fileName: string;
  status: BulkImportStatus;
  totalRows: number;
  importedRows: number;
  skippedRows: number;
  issues: IBulkImportIssue[] | null;
  courseId: number;
  createdAt: string;
  updatedAt?: string;
}

export interface IBulkImportTypeOption {
  value: BulkImportType;
  label: string;
}

export const BULK_IMPORT_TYPE_OPTIONS: IBulkImportTypeOption[] = [
  { value: 'CATEGORY', label: 'Categorías' },
  { value: 'SECTION', label: 'Secciones' },
  { value: 'TOPIC', label: 'Temas' },
  { value: 'BLOCK', label: 'Bloques' },
  { value: 'ARTICLE', label: 'Artículos' },
  { value: 'QUESTION', label: 'Preguntas' },
  { value: 'FLASHCARD', label: 'Flashcards' },
  { value: 'DIAGRAM', label: 'Esquemas' },
  { value: 'VIDEO', label: 'Vídeos' },
];