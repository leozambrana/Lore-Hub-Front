export interface PageProps<T = Record<string, string>> {
  params: Promise<T>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}
