export default function fetchData<T>(
  url: string,
  options: RequestInit
): Promise<T> {
  return fetch(url, options)
    .then((response) => response.json())
    .then((data) => data as T);
}
