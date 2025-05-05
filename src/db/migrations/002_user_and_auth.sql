create table users
(
    id         uuid primary key,
    email      varchar(255) not null unique,
    username   varchar(50)  not null unique,
    created_at timestamptz  not null,
    updated_at timestamptz
);

create index idx_users_email on users (email);
create index idx_users_username on users (username);

create trigger trg_users_set_created_at
    before insert
    on users
    for each row
    execute function set_created_at();

create trigger trg_users_set_updated_at
    before update
    on users
    for each row
    execute function set_updated_at();

create table user_auth (
    id uuid primary key,
    user_id uuid not null references users(id) on delete cascade,
    "type" text not null,
    details jsonb not null default '{}'::jsonb,
    created_at timestamptz not null,
    updated_at timestamptz
);

create index idx_user_auth_user_id on user_auth(user_id);
create index idx_user_auth_type on user_auth("type");

create trigger trg_user_auth_set_created_at
    before insert on user_auth
    for each row
    execute function set_created_at();

create trigger trg_user_auth_set_updated_at
    before update on user_auth
    for each row
    execute function set_updated_at();
