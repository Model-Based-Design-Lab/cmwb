export function darkenColor(col: string): string {
    const reg = /#([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})([0-9A-Fa-f]{2})/
    const match = col.match(reg)

    const r = Math.round(parseInt(`0x${match[1]}`) / 2)
    const g = Math.round(parseInt(`0x${match[2]}`) / 2)
    const b = Math.round(parseInt(`0x${match[3]}`) / 2)

    const zeroPad = (num: number) => (num.toString(16)).padStart(2, '0')

    return `#${zeroPad(r)}${zeroPad(g)}${zeroPad(b)}`
}