export default function prepareUrl(url: string): string {
  const parsed = new URL(url)
  parsed.hash = ''
  return parsed.toString()
}
