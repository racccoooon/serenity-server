create table messages
(
    id         uuid primary key,
    channel_id uuid        not null references channels (id),
    user_id    uuid        not null references users (id),
    type       text        not null,
    details    jsonb       not null,
    created_at timestamptz not null,
    updated_at timestamptz
);

create index idx_messages_channels on messages(channel_id);

create trigger trg_messages_set_created_at
    before insert
    on messages
    for each row
    execute function set_created_at();

create trigger trg_messages_set_updated_at
    before update
    on messages
    for each row
    execute function set_updated_at();