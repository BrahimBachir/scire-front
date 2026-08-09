export function parseDate (date: string | number): Date | undefined {
    if (!date) return undefined;
    const str = String(date);
    if (str.length === 8) {
        const year = str.substring(0, 4);
        const month = str.substring(4, 6);
        const day = str.substring(6, 8);
        return new Date(`${year}-${month}-${day}T00:00:00Z`);
    }
    return new Date(str);
};

export function formatToISODate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    return isNaN(d.getTime()) ? null : d.toISOString();
}