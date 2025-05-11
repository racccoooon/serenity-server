create table server_members
(
    id         uuid primary key,
    user_id    uuid        not null references users (id) on delete cascade,
    server_id  uuid        not null references servers (id) on delete cascade,
    created_at timestamptz not null,
    updated_at timestamptz
);

create index idx_server_members_user_id on server_members (user_id);
create index idx_server_members_server_id on server_members (server_id);

create trigger trg_server_members_set_created_at
    before insert on server_members
    for each row
    execute function set_created_at();

create trigger trg_server_members_set_updated_at
    before update on server_members
    for each row
    execute function set_updated_at();