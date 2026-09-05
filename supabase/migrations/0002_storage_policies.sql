-- Storage RLS for the product-images bucket.
--
-- 0001_init.sql set up RLS for the database tables, but storage buckets
-- carry their own separate RLS on storage.objects — that table was never
-- given a policy, so it fell back to deny-all and blocked every upload from
-- the admin panel with "new row violates row-level security policy", even
-- though the bucket itself is marked public (public only governs reads).
--
-- Same boundary as the tables: anyone can view/download, only an
-- authenticated (admin) session can write.

create policy "public read product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "admin write product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "admin update product-images"
  on storage.objects for update
  using (bucket_id = 'product-images' and auth.role() = 'authenticated')
  with check (bucket_id = 'product-images' and auth.role() = 'authenticated');

create policy "admin delete product-images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and auth.role() = 'authenticated');
