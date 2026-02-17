# Specification

## Summary
**Goal:** Fix the bottom navigation bar so the rightmost Profile tab is never clipped and shift the entire tab group slightly left while preserving balanced spacing and safe-area behavior.

**Planned changes:**
- Update bottom navigation bar container/layout to ensure the Profile tab (icon + label) is fully visible across screen sizes, including devices with right safe-area insets.
- Apply a small, consistent left shift to the bottom tab group (as a whole) using container-level padding/offset while keeping spacing visually balanced.
- Ensure the bottom bar remains fixed to the bottom, respects left/right/bottom safe-area insets, and does not introduce horizontal scrolling; preserve current tap target sizes.

**User-visible outcome:** The bottom navigation bar shows all five tabs fully (including Profile) on all devices without clipping, and the tabs appear slightly shifted left with consistent spacing and comfortable tap areas.
