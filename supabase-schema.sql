-- Run this in Supabase: SQL Editor → New query → Paste → Run

create table if not exists public.order_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  phone text not null,
  address text not null,
  plan text not null,
  diet text not null,
  message text
);

create index if not exists order_requests_created_at_idx
  on public.order_requests (created_at desc);

alter table public.order_requests enable row level security;

-- API uses the service role key (server-only); it bypasses RLS.
-- No policies: anon/authenticated clients cannot read/write via PostgREST.

comment on table public.order_requests is 'Order form submissions from DublinDabba site';
