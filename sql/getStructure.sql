SELECT sql || ';' || char(13) AS sql
	FROM sqlite_schema
		WHERE sql IS NOT NULL