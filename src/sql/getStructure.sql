
/*
This query can be used to get the current structure of the database.
The structure selected by this query can be inserted into the file
`structure.sql`.
*/
SELECT sql || ';' || char(13) AS sql
	FROM sqlite_schema
		WHERE sql IS NOT NULL