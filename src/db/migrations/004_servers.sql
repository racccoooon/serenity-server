create table servers
(
    id          uuid primary key,
    owner_id    uuid not null,
    name        text not null,
    description text,
    created_at    timestamptz not null,
    updated_at    timestamptz
);

create trigger trg_servers_set_created_at
    before insert on servers
    for each row
    execute function set_created_at();

create trigger trg_servers_set_updated_at
    before update on servers
    for each row
    execute function set_updated_at();