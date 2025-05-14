alter table channel_groups
    add column is_default boolean not null default false;

alter table channel_groups
    alter column is_default
        drop default;
