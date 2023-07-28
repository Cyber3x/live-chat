const BASE_URL = "http://localhost:4000"

export const apiFetch = async (endpoint: string, options?: RequestInit) => {
  const url = `${BASE_URL}${endpoint}`
  console.log(url)
  return fetch(url, options)
}

export const apiPost = async (
  endpoint: string,
  data: object,
  options?: RequestInit
) => {
  return apiFetch(endpoint, {
    ...options,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}
