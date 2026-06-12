function tokenizeName(name: string): string[] {
    return name
        .toLowerCase()
        .replace(/[^a-z\s]/g, '')
        .split(/\s+/)
        .filter(Boolean)
}

export function namesMatch(name1: string, name2: string): boolean {
    const tokens1 = tokenizeName(name1)
    const tokens2 = tokenizeName(name2)

    if (tokens1.length === 0 || tokens2.length === 0) {
        return false
    }

    const [shorter, longer] =
        tokens1.length <= tokens2.length ? [tokens1, tokens2] : [tokens2, tokens1]

    return shorter.every((shortToken) => {
        return longer.some((longToken) => {
            return longToken.startsWith(shortToken) || shortToken.startsWith(longToken)
        })
    })
}
