CREATE TABLE categories (
id int(11) unsigned NOT NULL AUTO_INCREMENT,
type varchar(255) DEFAULT NULL,
stores_id int(10) unsigned DEFAULT 5,
PRIMARY KEY (id),
FOREIGN KEY (stores_id) REFERENCES
stores (id)
ON UPDATE SET DEFAULT
ON DELETE SET DEFAULT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE 'products' (
'id' int(11) unsigned NOT NULL AUTO_INCREMENT,
'title' varchar(255) DEFAULT NULL,
'sub_title' varchar(255),
'price' varchar(255),
'description' varchar(255),
'categories_id' int(11) unsigned DEFAULT 5,
'PRIMARY KEY' ('id'),
FOREIGN KEY ('categories_id') REFERENCES
'categories' (id)
ON UPDATE SET DEFAULT
ON DELETE SET DEFAULT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE `products` (
`id` int(11) unsigned NOT NULL AUTO_INCREMENT,
'title' varchar(255) DEFAULT NULL,
'subtitle' varchar(255) DEFAULT NULL,
'price' varchar(255) DEFAULT NULL,
'description' varchar(255) DEFAULT NULL,
'categories_id' int(10) unsigned DEFAULT 5,
'PRIMARY KEY' ('id'),
FOREIGN KEY ('categories_id') REFERENCES
'categories' (id)
ON UPDATE SET DEFAULT
ON DELETE SET DEFAULT
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE transactions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);