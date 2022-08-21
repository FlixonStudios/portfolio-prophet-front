export function formatNumber(number) {
    if (typeof number === 'number') {
        return number.toFixed(2)
    } else if (typeof number === 'string') {
        try {
            return Number(number).toFixed(2)
        } catch (error) {
            return '-'
        }
    }
    return '-'
}
