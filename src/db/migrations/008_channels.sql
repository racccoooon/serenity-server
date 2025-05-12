create table channel_groups
(
    id         uuid primary key,
    server_id  uuid        not null references servers (id) on delete cascade,
    name       text        not null,
    rank       text        not null,
    created_at timestamptz not null,
    updated_at timestamptz
);

create index idx_channel_groups_servers on channel_groups (server_id);
create unique index idx_channel_groups_unique_name on channel_groups (server_id, name);

create trigger trg_channel_groups_set_created_at
    before insert
    on channel_groups
    for each row
    execute function set_created_at();

create trigger trg_channel_groups_set_updated_at
    before update
    on channel_groups
    for each row
    execute function set_updated_at();

create table channels
(
    id         uuid primary key,
    group_id   uuid        not null references channel_groups (id) on delete cascade,
    name       text        not null,
    rank       text        not null,
    created_at timestamptz not null,
    updated_at timestamptz
);

create index idx_channels_servers on channels (group_id);

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