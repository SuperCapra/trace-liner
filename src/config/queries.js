const queries = {
    tables: "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname NOT IN ('pg_catalog', 'information_schema')",
    getQueryColumns(table) {
        return "SELECT column_name, data_type, is_nullable, character_maximum_length FROM information_schema.columns WHERE table_schema = 'public' AND table_name = '" + table + "'"
    }
}

export default queries