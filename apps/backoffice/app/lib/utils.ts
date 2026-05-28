import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn( ...inputs: ClassValue[] ) {
    return twMerge( clsx( inputs ) );
}

export function getRelativeTime(dateString: string) {
    const diff = (new Date(dateString).getTime() - Date.now()) / 1000;
    const absDiff = Math.abs(diff);

    if (absDiff < 60) return 'Just now';
    if (absDiff < 3600) return `${Math.round(absDiff / 60)} min ago`;
    if (absDiff < 86400) return `${Math.round(absDiff / 3600)} h ago`;
    return `${Math.round(absDiff / 86400)} d ago`;
}
