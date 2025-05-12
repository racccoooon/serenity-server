alter table users
    add column type text not null default 'local';

alter table users
    add column instance text;

alter table users
    alter column email drop not null;

create table invites
(
    id            uuid primary key,
    invited_by_id uuid references users (id) on delete cascade,
    valid_until   timestamptz,
    created_at    timestamptz not null,
    updated_at    timestamptz
);

create trigger trg_invites_set_created_at
    before insert
    on invites
    for each row
execute function set_created_at();

create trigger trg_invites_set_updated_at
    before update
    on invites
    for each row
execute function set_updated_at();