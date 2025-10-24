// utils/updateInputValue.ts
export function updateInputValue(
  name: string,
  value: any,
  setValue: (field: string, value: any, options?: { shouldValidate?: boolean }) => void
) {
  if (value !== undefined && value !== null) {
    console.log(`Updating ${name} with value:`, value); // ✅ log for debugging
    setValue(name, value, { shouldValidate: true });
  }
}
