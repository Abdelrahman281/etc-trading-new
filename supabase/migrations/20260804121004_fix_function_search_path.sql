/*
# Fix mutable search_path on helper functions

## Summary
Two helper functions (`update_updated_at_column` and `get_category_id`) were created
without an explicit `search_path`, making them vulnerable to search_path hijacking.
This migration sets a fixed `search_path` on both functions to eliminate the risk.

## Changes
1. `public.update_updated_at_column` — set `search_path = public, pg_temp`
2. `public.get_category_id` — set `search_path = public, pg_temp`

## Security
- Both functions now have an immutable `search_path`, so they cannot be hijacked
  by an attacker who controls the runtime `search_path` variable.
- No data is modified; only function metadata changes.
*/

ALTER FUNCTION public.update_updated_at_column()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.get_category_id(text)
  SET search_path = public, pg_temp;
