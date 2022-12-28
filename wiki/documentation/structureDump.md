
# Structure Dumps for sqlite
To create the content for the structure.sql automatically, use the following query:
```sql
SELECT sql || ';' || char(13) AS sql
	FROM sqlite_schema
		WHERE sql IS NOT NULL
```
