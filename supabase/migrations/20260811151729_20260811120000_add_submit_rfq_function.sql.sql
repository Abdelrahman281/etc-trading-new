-- SECURITY DEFINER function for public RFQ submission.
-- The anon role has INSERT but not SELECT on rfq_requests, so
-- .insert(...).select('id').single() fails when called from the
-- server action using the anon-key client. This function runs as
-- its owner (bypassing RLS), inserts the request + items atomically,
-- and returns the new request id. EXECUTE is granted to anon because
-- RFQ submission is an intentionally public flow.

CREATE OR REPLACE FUNCTION public.submit_rfq(
  p_company text,
  p_contact_person text,
  p_phone text,
  p_email text,
  p_category text,
  p_message text,
  p_items jsonb DEFAULT '[]'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request_id uuid;
  v_item jsonb;
BEGIN
  INSERT INTO public.rfq_requests (company, contact_person, phone, email, category, message)
  VALUES (p_company, p_contact_person, p_phone, p_email, p_category, p_message)
  RETURNING id INTO v_request_id;

  IF p_items IS NOT NULL AND jsonb_array_length(p_items) > 0 THEN
    FOR v_item IN SELECT jsonb_array_elements(p_items) LOOP
      INSERT INTO public.rfq_items (rfq_request_id, product_name, spec, category, quantity)
      VALUES (
        v_request_id,
        v_item->>'product_name',
        NULLIF(v_item->>'spec', ''),
        v_item->>'category',
        COALESCE((v_item->>'quantity')::int, 1)
      );
    END LOOP;
  END IF;

  RETURN v_request_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.submit_rfq FROM anon, authenticated;
GRANT EXECUTE ON FUNCTION public.submit_rfq TO anon, authenticated;
