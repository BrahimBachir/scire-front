// sort
export function onSort<T>(array: T[], column: keyof T, direction: 'asc' | 'desc'): T[] {
  return [...array].sort((a, b) => {
    const valueA = a[column];
    const valueB = b[column];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return direction === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }

    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}