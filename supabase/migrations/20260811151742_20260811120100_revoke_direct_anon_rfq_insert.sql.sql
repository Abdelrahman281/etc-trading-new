-- Revoke table-level INSERT on rfq_requests/rfq_items from anon.
-- Public submission now goes through the submit_rfq() SECURITY DEFINER
-- function, so direct table INSERT is no longer needed for anon.
-- authenticated retains INSERT for potential admin use.

REVOKE INSERT ON TABLE public.rfq_requests FROM anon;
REVOKE INSERT ON TABLE public.rfq_items FROM anon;
