DROP TABLE IF EXISTS unicorns;
CREATE TABLE unicorns (
	unicorn_id integer PRIMARY KEY,
	name text NOT NULL,
	age integer NOT NULL,
	color text UNIQUE NOT NULL,
	creation_date text NOT NULL DEFAULT (DATETIME('now', 'localtime'))
);

-- DELETE FROM unicorns;
-- INSERT INTO unicorns (name, age, color) VALUES 
-- ("One", 1, "pink"),
-- ("Two", 2, "white"),
-- ("Three", 3, "zebra");



