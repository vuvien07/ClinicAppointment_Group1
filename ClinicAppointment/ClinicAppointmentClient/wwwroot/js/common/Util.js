function numberToVietnamese(numStr) {
    const numbersMap = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
    return numStr.split('').map(d => numbersMap[parseInt(d)]).join(' ');
}

function normalizeText(text) {
    const dateRegex = /\b(\d{2})\/(\d{2})\/(\d{4})\b/g;
    text = text.replace(dateRegex, (match, dd, mm, yyyy) => {
        const dayWords = numberToVietnamese(dd);
        const monthWords = numberToVietnamese(mm);
        const yearWords = yyyy.split('').map(d => numberToVietnamese(d)).join(' ');
        return `${dayWords} tháng ${monthWords} năm ${yearWords}`;
    });

    const numberRegex = /\b\d+\b/g;
    text = text.replace(numberRegex, (match) => {
        return numberToVietnamese(match);
    });

    return text;
}