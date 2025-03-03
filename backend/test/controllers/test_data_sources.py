import sys
sys.path.append('../backend')
from controllers.data_sources import _generate_existing_source_dict
from globals import *
from datetime import datetime


def test_generate_existing_source_dict():
    row = {
        SOURCE_ID_COL: 1,
        PROVIDER_NAME_COL: "Provider",
        CONNECTOR_NAME_COL: "Connector",
        DATABASE_COL: "Database",
        SCHEMA_COL: "Schema",
        CREATED_TIMESTAMP_COL: datetime(2022, 1, 1, 0, 0, 0),
        MODEL_ID_COL: 123,
        MODEL_NAME_COL: "Model",
    }
    expected_result = {
        SOURCE_ID_COL: 1,
        PROVIDER_NAME_COL: "Provider",
        CONNECTOR_NAME_COL: "Connector",
        DATABASE_COL: "Database",
        SCHEMA_COL: "Schema",
        CREATED_TIMESTAMP_COL: "2022-1-1 0:0:0",
        MODEL_ID_COL: 123,
        MODEL_NAME_COL: "Model",

    }
    assert _generate_existing_source_dict(row) == expected_result