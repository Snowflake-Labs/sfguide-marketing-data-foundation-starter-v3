import sys
sys.path.append('../backend')


def test_get_sql_jinja():
    import model_manager.model_manager as model_manager
    template = """
SELECT TYPEOF({{ columns[0] | sqlsafe}}::VARIANT) COL1
{% for column in columns[1:] %}
    ,TYPEOF({{ column | sqlsafe}}::VARIANT)
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
LIMIT 1
"""
    process_definition = {'source': {'alias': 'OBJ1', 'object': 'db.schema.table'}, 'columns': ['col1']}
    actual = model_manager.get_sql_jinja(template, process_definition)
    expected = """SELECT TYPEOF(col1::VARIANT) COL1
FROM (
    SELECT * FROM
    db.schema.table
) OBJ1
LIMIT 1"""

    assert len(actual) > 0
    assert actual == expected
