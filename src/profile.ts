/**
 * Resolve the current Home Assistant profile option for a stable slot.
 *
 * A profile display label may change asynchronously after render, e.g.
 * "Profile 1" -> "XXXUSER". The numeric slot remains stable.
 */
export function profileOptionForSlot(
  options: readonly string[],
  slot: number,
): string | undefined {
  if (
    !Number.isInteger(slot) ||
    slot < 0 ||
    slot >= options.length
  ) {
    return undefined;
  }

  return options[slot];
}
