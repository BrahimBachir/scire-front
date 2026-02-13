
export function capitalizeFirstLetter(str: string) {
    str = str.toLowerCase();
    return String(str).charAt(0).toUpperCase() + String(str).slice(1);
}