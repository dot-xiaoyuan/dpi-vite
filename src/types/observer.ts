export interface History {
    is_proxy: boolean
    moving_average: number[] | null
    origin_changes: Change[] | null
    value_changes: number[] | null
}

export interface Change {
    time: string
    value: number
}

export interface Result {
    ip: string
    history: History
}