/*
SELECT category, `order`
	FROM goods_categories_shop_order
		WHERE shop_id = 1
		-- AND `order` BETWEEN 4 AND 8
			ORDER BY `order`;
*/


/*
works currently only when moving from top to bottom...
*/
WITH shopId AS (
	SELECT 1 AS id
), fromCategory AS (
	SELECT `order`, category
		FROM goods_categories_shop_order
			WHERE category = 'Backware'
			AND shop_id = (SELECT id FROM shopId)
), toCategory AS (
	SELECT `order`
		FROM goods_categories_shop_order
			WHERE category = 'Gemüse'
			AND shop_id = (SELECT id FROM shopId)
)
UPDATE goods_categories_shop_order
	SET `order` = 
	IIF(
		category = (SELECT category FROM fromCategory),
		(SELECT `order` - 1 FROM toCategory),
		`order` - 1
	)
		WHERE `order` BETWEEN (SELECT `order` FROM fromCategory) AND (SELECT `order` - 1 FROM toCategory)
		AND shop_id = (SELECT id FROM shopId);



/*
works currently only when moving from bottom to top.

Multiple queries must be used, because the "with - clause"
is reading from the database in every single row of the update.
when the with - clause would behave as a temporary table,
the update for the "fromCategory" based on the order of the
"toCategory" could be performed in a single update.
Like this the updated value of the "toCategory" is used and the order
will be the same for "toCategory" and "fromCategory" after the update.
*/
BEGIN TRANSACTION;

	
	WITH shopId AS (
		SELECT 1 AS id
	), fromCategory AS (
		SELECT `order`, category
			FROM goods_categories_shop_order
				WHERE category = 'Getränke'
				AND shop_id = (SELECT id FROM shopId)
	), toCategory AS (
		SELECT `order`
			FROM goods_categories_shop_order
				WHERE category = 'Backware'
				AND shop_id = (SELECT id FROM shopId)
	)
	UPDATE goods_categories_shop_order
		SET `order` = 
		IIF(
			category = (SELECT category FROM fromCategory),
			(SELECT `order` FROM toCategory),
			`order` + 1
		)
			WHERE `order` BETWEEN (SELECT `order` + 1 FROM toCategory) AND (SELECT `order` FROM fromCategory) 
			AND shop_id = (SELECT id FROM shopId);

	UPDATE goods_categories_shop_order
		SET `order` = `order` + 1
			WHERE category = 'Backware'
			AND shop_id = 1;
		
COMMIT;