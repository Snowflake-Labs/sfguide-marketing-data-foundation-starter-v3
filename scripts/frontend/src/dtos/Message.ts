interface Content {
    text: string,
    sql: string,
    suggestions: string[],
}

export interface Message {
    role: string,
    content: Content,
    result: string,
    error: string
}