alter table sessions
    add column valid_until timestamptz not null default now();

alter table sessions
    alter column valid_until
        drop default;
