export function jsonFriendlyErrorReplacer (key: any, value: any) {
  if (value instanceof Error) {
    return {
      error: value.name,
      message: value.message
    }
  }
  return value
}
