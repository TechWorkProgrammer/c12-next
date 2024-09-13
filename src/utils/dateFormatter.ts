export const dateFormatter = (date: Date | string | undefined | null): string => {
    if (!date) {
        return 'Tanggal tidak ditemukan';
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }

    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(dateObj);
};
