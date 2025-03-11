import sys
from snowflake.snowpark import Session
import services.process as process
import pytest

sys.path.append('../backend')


def test_get_preview(mocker):
    
    session = Session.builder.config('local_testing', True).create()
    process_limit_1 = {'source': {'alias': 'OBJ1', 'object': 'db.schema.table'}, 'columns': ['col1'], 'limit': 1}
    process_no_limit= {'source': {'alias': 'OBJ1', 'object': 'db.schema.table'}, 'columns': ['col1']}

    template = """
SELECT
    {{ columns[0] | sqlsafe}} 
{% for column in columns[1:] %}
    ,{{ column | sqlsafe}}
{% endfor %}
{% if source["object"] %}
FROM (
    SELECT * FROM
    {{ source["object"] | sqlsafe }}
    {% if source['where']  %}
        WHERE {{ source['where']  | sqlsafe }}
    {% endif %}
    {% if source['qualify']  %}
        QUALIFY {{ source['qualify'] | sqlsafe }}
    {% endif %}
    ) {{ source["alias"] | sqlsafe }}
{% endif %}
{% for j in join %}
{{ j["type"] | sqlsafe }} JOIN (
    SELECT * FROM
    {{ j["object"] | sqlsafe }}
    {% if j['where']  %}
        WHERE {{ j['where']  | sqlsafe }}
    {% endif %}
    {% if j['qualify']  %}
        QUALIFY {{ j['qualify'] | sqlsafe }}
    {% endif %}
    ) {{ j["alias"] | sqlsafe }} ON {{ j["on"] | sqlsafe }}
{% endfor %}
{% if group_by  %}
GROUP BY 
    {{ group_by[0] | sqlsafe }}
{% for gb in group_by[1:] %}
    ,{{ gb | sqlsafe }}
{% endfor %}
{% endif %}
{% if order_by %}
ORDER BY 
    {{ order_by[0] | sqlsafe }}
{% for ob in order_by[1:] %}
    ,{{ ob | sqlsafe }}
{% endfor %}
{% endif %}
""" 
    sql_command = """
SELECT col1
FROM (
    SELECT * FROM
    db.schema.table
) OBJ1
LIMIT 1
"""
    df = session.create_dataframe([[1,2]],['a','b'])
    mocker.patch("model_manager.model_manager.get_template", return_value = template)
    mocker.patch("model_manager.model_manager.get_sql_jinja", return_value = sql_command)
    mocker.patch("model_manager.model_manager.test_query", return_value = df)
    result_limit = process.get_preview(process_limit_1)
    process.get_preview(process_no_limit)
    assert result_limit["total_row_count"] == 1


def test_compare_types():
    from exceptions.length_mismatch import LengthMissmatch
    from exceptions.invalid_sql import InvalidSql
    sources = ["VARCHAR", "NULL", "NULL"]
    targets = ["VARCHAR", "VARCHAR", "DATE"]
    empty_targets = []
    missmatch_targets = ["INTEGER", "VARCHAR", "DATE"]
    expected = [True, True, True]
    result = process.compare_types(sources, targets)
    assert result == expected
    with pytest.raises(LengthMissmatch):
        process.compare_types(sources, empty_targets)
    with pytest.raises(InvalidSql):
        process.compare_types(sources, missmatch_targets)


def test_source_validation(mocker):
    process_ = {'targets': 
                [{'target': 
                  {'alias': 'OBJ3', 'key': 'null', 'object': 'table2', 'columns': 
                   [{'name': 'ID', 'type': 'INTEGER'} 
                    ]
                   }, 
                   'definitions': 
                   [{'columns': ['ID'
                                 ], 
                     'source_columns': ['ID'
                                        ], 
                     'source': {'alias': 't1', 'object': 'table1'}}]}]}
    template = ""
    sql_command = ""
    session = Session.builder.config('local_testing', True).create()
    df = session.create_dataframe([["INTEGER"]],['COL1'])
    mocker.patch("model_manager.model_manager.get_template", return_value = template)
    mocker.patch("model_manager.model_manager.get_sql_jinja", return_value = sql_command)
    mocker.patch("model_manager.model_manager.test_query", return_value = df)
    process.source_validation(process_)


def test_replace_placeholder_db_schema():
    process_ = {'targets': 
                [{'target': 
                  {'alias': 'OBJ3', 'key': 'null', 'object': 'table2', 'columns': 
                   [{'name': 'ID', 'type': 'INTEGER'} 
                    ]
                   }, 
                   'definitions': 
                   [{'columns': ['ID'
                                 ], 
                     'source_columns': ['ID'
                                        ], 
                     'source': {'alias': 't1', 'object': '<SOURCE_DATABASE_FIVETRAN_FACEBOOK>.<SOURCE_SCHEMA_FIVETRAN_FACEBOOK>.table'}}]}]} 
    expected = {'targets': [{'target': {'alias': 'OBJ3', 'key': 'null', 'object': 'table2', 'columns': [{'name': 'ID', 'type': 'INTEGER'}]}, 'definitions': [{'columns': ['ID'], 'source_columns': ['ID'], 'source': {'alias': 't1', 'object': 'fb_db.fb_sch.table'}}]}]}
    result = process.replace_placeholder_db_schema(process_, 'FacebookAds', 'Fivetran', 'fb_db', 'fb_sch')
    assert result == expected

def test_check_source():
        process_ = {'targets': 
                [{'target': 
                  {'alias': 'OBJ3', 'key': 'null', 'object': 'table2', 'columns': 
                   [{'name': 'ID', 'type': 'INTEGER'} 
                    ]
                   }, 
                   'definitions': 
                   [{'columns': ['ID'
                                 ], 
                     'source_columns': ['ID'
                                        ], 
                     'source': {'alias': 't1', 'object': 'db.sch.table'}}]}]}
        expected = False
        result = process.check_source(process_, "db", "sch")
        assert result == expected

def test_create_model_data():
     content = {"MODEL_NAME": "MODEL_NAME", "TARGET_DATABASE": "TARGET_DATABASE", "TARGET_SCHEMA": "TARGET_SCHEMA", "MODEL_UI": "MODEL_UI"}
     result = process.create_model_data(content)
     assert [content] == result