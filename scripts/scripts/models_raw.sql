
COPY INTO <DB>.<SCHEMA>.MODELS 
FROM
 (SELECT REPLACE($1['id'], '"', ''), REPLACE($1['name'], '"', ''), '<DB>', '<SCHEMA>', $1, CURRENT_TIMESTAMP()
	FROM '@<DB>.<SCHEMA>.TEMP/'
(FILE_FORMAT => '<DB>.<SCHEMA>.json_format' ));