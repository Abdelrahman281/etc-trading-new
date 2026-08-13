/*
# Grant ETC application database access

1. Purpose
- Restore the table privileges required by the public ETC catalog and RFQ form.
- This migration changes permissions only; it does not change tables, rows, product data, or application behavior.

2. Modified tables
- `categories`: grant read access to the public application roles.
- `sub_categories`: grant read access to the public application roles.
- `products`: grant read access to the public application roles.
- `rfq_requests`: grant insert access to the public application roles and read/update/delete access to authenticated administrators.
- `rfq_items`: grant insert access to the public application roles and read access to authenticated administrators.

3. Security
- Existing row-level security policies remain in force.
- No service-role or secret key access is granted.
- No anonymous read access is granted to RFQ records.
*/

GRANT SELECT ON TABLE public.categories, public.sub_categories, public.products
  TO anon, authenticated;

GRANT INSERT ON TABLE public.rfq_requests, public.rfq_items
  TO anon, authenticated;

GRANT SELECT, UPDATE, DELETE ON TABLE public.rfq_requests
  TO authenticated;

GRANT SELECT ON TABLE public.rfq_items
  TO authenticated;