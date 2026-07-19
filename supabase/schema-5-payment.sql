-- ═══ FARHA — payment reference ═══
alter table orders add column if not exists ref text;
alter table orders add column if not exists method text;
