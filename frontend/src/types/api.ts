export type ApiFetch = (
    url: string,
    options?: RequestInit
) => Promise<Response>;