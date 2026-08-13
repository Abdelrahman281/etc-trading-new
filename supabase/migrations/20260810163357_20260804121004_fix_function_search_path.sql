ALTER FUNCTION public.update_updated_at_column()
  SET search_path = public, pg_temp;

ALTER FUNCTION public.get_category_id(text)
  SET search_path = public, pg_temp;