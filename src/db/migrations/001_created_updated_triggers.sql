-- Function to set created_at timestamp
CREATE OR REPLACE FUNCTION set_created_at()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.created_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to set updated_at timestamp
CREATE OR REPLACE FUNCTION set_updated_at()
    RETURNS TRIGGER AS
$$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Example of how to use these triggers on a table:
-- CREATE TRIGGER set_timestamp_created
--     BEFORE INSERT ON your_table
--     FOR EACH ROW
--     EXECUTE FUNCTION set_created_at();
--
-- CREATE TRIGGER set_timestamp_updated
--     BEFORE UPDATE ON your_table
--     FOR EACH ROW
--     EXECUTE FUNCTION set_updated_at();