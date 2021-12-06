export function fullDateCheck(targetDate: Date, refDate: Date): boolean {
    const dayCheck: boolean = targetDate.getUTCDate() === refDate.getUTCDate();
    const monthCheck: boolean = targetDate.getUTCMonth() === refDate.getUTCMonth();
    const yearCheck: boolean = targetDate.getUTCFullYear() === refDate.getUTCFullYear();
    return (dayCheck && monthCheck && yearCheck) ? true : false
}
