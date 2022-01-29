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
WITH fromCategory AS (
	SELECT `order`
		FROM goods_categories_shop_order
			WHERE category = 'Backware'
			AND shop_id = 1
),
toCategory AS (
	SELECT `order`
		FROM goods_categories_shop_order
			WHERE category = 'Gemüse'
			AND shop_id = 1
)
UPDATE goods_categories_shop_order
	SET `order` = 
	IIF(
		category = 'Backware',
		(SELECT `order` - 1 FROM toCategory),
		`order` - 1
	)
		WHERE `order` BETWEEN (SELECT `order` FROM fromCategory) AND (SELECT `order` - 1 FROM toCategory)
		AND shop_id = 1



/*
works currently only when moving from bottom to top
*/
WITH fromCategory AS (
	SELECT `order`
		FROM goods_categories_shop_order
			WHERE category = 'Gemüse'
			AND shop_id = 1
),
toCategory AS (
	SELECT `order`
		FROM goods_categories_shop_order
			WHERE category = 'Backware'
			AND shop_id = 1
)
UPDATE goods_categories_shop_order
	SET `order` = 
	IIF(
		category = 'Gemüse',
		(SELECT `order` FROM toCategory),
		`order` + 1
	)
		WHERE `order` BETWEEN (SELECT `order` FROM toCategory) AND (SELECT `order` FROM fromCategory) 
		AND shop_id = 1