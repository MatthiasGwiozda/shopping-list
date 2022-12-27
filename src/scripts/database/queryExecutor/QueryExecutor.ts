
export default interface QueryExecutor {
    runQuery<T>(query: string, params?: any[]): Promise<T[]>
}
