CREATE TABLE `goods` (
  `name` varchar(100) NOT NULL,
  `category` varchar(45) NOT NULL,
  PRIMARY KEY (`name`),

  CONSTRAINT `goods_category` FOREIGN KEY (`category`) REFERENCES `goods_categories` (`category`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `goods_categories` (
  `category` varchar(45) NOT NULL,
  PRIMARY KEY (`category`)
);

CREATE TABLE `meals` (
  `name` varchar(100) NOT NULL,
  `recipe` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`name`)
);

CREATE TABLE `meals_related_side_dish` (
  `meal` varchar(100) NOT NULL,
  `related_meal` varchar(100) NOT NULL,
  PRIMARY KEY (`meal`,`related_meal`),

  CONSTRAINT `meals_related_meal` FOREIGN KEY (`meal`) REFERENCES `meals` (`name`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `meals_related_side_dish` FOREIGN KEY (`related_meal`) REFERENCES `meals_side_dishes` (`name`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `meals_side_dishes` (
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`name`),
  CONSTRAINT `meals_side_dish_meal` FOREIGN KEY (`name`) REFERENCES `meals` (`name`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `meals_this_week` (
  `day` tinyint(1) NOT NULL,
  `meal` varchar(100) NOT NULL,
  PRIMARY KEY (`day`),

  CONSTRAINT `meals_this_week_meal` FOREIGN KEY (`meal`) REFERENCES `meals` (`name`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `shopping_lists` (
  `shoppingListName` varchar(255) NOT NULL,
  PRIMARY KEY (`shoppingListName`)
);

CREATE TABLE `shopping_lists_goods` (
  `shoppingListName` varchar(255) NOT NULL,
  `goodsName` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`shoppingListName`,`goodsName`),

  CONSTRAINT `shopping_lists_goods_good` FOREIGN KEY (`goodsName`) REFERENCES `goods` (`name`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `shopping_lists_goods_shoppingListName` FOREIGN KEY (`shoppingListName`) REFERENCES `shopping_lists` (`shoppingListName`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE `shops` (
  `shop_name` varchar(20) NOT NULL,
  `postal_code` varchar(5) NOT NULL,
  `street` varchar(45) NOT NULL,
  `house_number` varchar(10) NOT NULL,
  `shop_id` INTEGER PRIMARY KEY
);

CREATE UNIQUE INDEX `shop_id_UNIQUE` ON `shops`(`shop_name`, `postal_code`, `street`, `house_number`);

CREATE TABLE `goods_categories_shop_order` (
  `shop_id` int(1) NOT NULL,
  `category` varchar(45) NOT NULL,
  `order` tinyint(1) NOT NULL,
  PRIMARY KEY (`shop_id`,`category`),

  CONSTRAINT `goods_categories_shop_order_ibfk_1` FOREIGN KEY (`category`) REFERENCES `goods_categories` (`category`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `goods_categories_shop_order_ibfk_2` FOREIGN KEY (`shop_id`) REFERENCES `shops` (`shop_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `food` (
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`name`),
  CONSTRAINT `food_goods` FOREIGN KEY (`name`) REFERENCES `goods` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `meals_food` (
  `meal` varchar(100) NOT NULL,
  `food` varchar(100) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`meal`,`food`),

  CONSTRAINT `meals_food_food` FOREIGN KEY (`food`) REFERENCES `food` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `meals_food_meal` FOREIGN KEY (`meal`) REFERENCES `meals` (`name`) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "goods_shops" (
	"name"	varchar(100) NOT NULL,
	"shop_id"	int(1) NOT NULL,
	CONSTRAINT "goods_shops_good" FOREIGN KEY("name") REFERENCES "goods"("name") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "goods_shops_shop" FOREIGN KEY("shop_id") REFERENCES "shops"("shop_id") ON DELETE CASCADE ON UPDATE CASCADE,
	PRIMARY KEY("name","shop_id")
);
