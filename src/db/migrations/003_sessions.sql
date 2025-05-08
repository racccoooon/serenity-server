create table sessions
(
    id            uuid primary key,
    user_id       uuid        not null references users (id) on delete cascade,
    hashed_secret bytea       not null,
    salt          bytea       not null,
    created_at    timestamptz not null,
    updated_at    timestamptz
);

create index idx_sessions_user_id on sessions(user_id);

create trigger trg_sessions_set_created_at
    before insert on sessions
    for each row
    execute function set_created_at();

create trigger trg_sessions_set_updated_at
    before update on sessions
    for each row
    execute function set_updated_at();