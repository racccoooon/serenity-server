create table channels
(
    id         uuid primary key,
    server_id  uuid        not null references servers (id) on delete cascade,
    name       text        not null,
    "group"    text,
    rank       text        not null,
    created_at timestamptz not null,
    updated_at timestamptz
);

create index idx_channels_servers on channels (server_id);
create index idx_channels_in_group on channels (server_id, "group");

create trigger trg_channels_set_created_at
    before insert
    on channels
    for each row
    execute function set_created_at();

create trigger trg_channels_set_updated_at
    before update
    on channels
    for each row
    execute function set_updated_at();