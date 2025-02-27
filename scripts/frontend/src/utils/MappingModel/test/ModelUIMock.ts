import { JoinTypes } from 'dtos/JoinDefinition';
import { ColumnType, ModelUI, MappingType } from 'dtos/ModelUI';
import { NullType } from 'dtos/NullType';

export const ModelUIMock: ModelUI = {
  id: 'model-id',
  name: 'model-name',
  databases: [
    {
      databaseName: 'database',
      schemas: [
        {
          schemaName: 'schema',
          databaseName: 'database',
          tables: [
            {
              alias: 'TAB01',
              type: 'source',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table01',
                },
                {
                  columnName: 'varchar_column',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  object: 'database.schema.table01',
                },
              ],
            },
            {
              alias: 'TAB02',
              type: 'source',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table02',
                },
              ],
            },
            {
              alias: 'TAB03',
              type: 'source',
              object: 'database.schema.table03',
              tableName: 'table03',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'date_column',
                  type: ColumnType.DATE,
                  sqlType: 'DATE',
                  object: 'database.schema.table03',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const ModelUIMockWithMappings: ModelUI = {
  id: 'model-id',
  name: 'model-name',
  databases: [
    {
      databaseName: 'database',
      schemas: [
        {
          schemaName: 'schema',
          databaseName: 'database',
          tables: [
            {
              alias: 'TAB01',
              type: 'target',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table01',
                },
                {
                  columnName: 'varchar_column',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  object: 'database.schema.table01',
                },
                {
                  columnName: 'static_col',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  object: 'database.schema.table01',
                },
              ],
              mappings: [
                {
                  sources: [
                    {
                      object: 'database.schema.table02',
                      columnName: 'varchar_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'varchar_column',
                  },
                  type: MappingType.Column,
                  mapping: 'varchar_column',
                },
                {
                  sources: [
                    {
                      object: NullType,
                      columnName: NullType,
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'static_col',
                  },
                  type: MappingType.Static,
                  mapping: 'static_value',
                },
              ],
            },
            {
              alias: 'TAB02',
              type: 'source',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table02',
                },
                {
                  columnName: 'varchar_column',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  object: 'database.schema.table02',
                },
              ],

              mappings: [
                {
                  sources: [
                    {
                      object: 'database.schema.table02',
                      columnName: 'varchar_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'varchar_column',
                  },
                  type: MappingType.Column,
                  mapping: 'varchar_column',
                },
                {
                  sources: [
                    {
                      object: NullType,
                      columnName: NullType,
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'static_col',
                  },
                  type: MappingType.Static,
                  mapping: 'static_value',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const ModelUIMockWithJoins: ModelUI = {
  id: 'model-id',
  name: 'model-name',
  databases: [
    {
      databaseName: 'database',
      schemas: [
        {
          schemaName: 'schema',
          databaseName: 'database',
          tables: [
            {
              alias: 'TAB01',
              type: 'target',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table01',
                },
                {
                  columnName: 'varchar_column',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  object: 'database.schema.table01',
                },
              ],
              mappings: [
                {
                  sources: [
                    {
                      object: 'database.schema.table02',
                      columnName: 'number_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'number_column',
                  },
                  type: MappingType.Column,
                  mapping: 'number_column',
                },
              ],
              joins: [
                {
                  target: {
                    alias: 'TAB01',
                    object: 'database.schema.table01',
                    tableName: 'table01',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  from: {
                    alias: 'TAB01',
                    object: 'database.schema.table01',
                    tableName: 'table01',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  to: {
                    alias: 'TAB02',
                    object: 'database.schema.table02',
                    tableName: 'table02',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  type: JoinTypes.INNER,
                  on: 'TAB02.number_column = TAB01.number_column',
                },
              ],
            },
            {
              alias: 'TAB02',
              type: 'source',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table02',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const ModelUIMockWithJoinsSequence: ModelUI = {
  id: 'model-id',
  name: 'model-name',
  databases: [
    {
      databaseName: 'database',
      schemas: [
        {
          schemaName: 'schema',
          databaseName: 'database',
          tables: [
            {
              alias: 'TAB01',
              type: 'target',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [],
              joins: [
                {
                  target: {
                    alias: 'TAB01',
                    object: 'database.schema.table01',
                    tableName: 'table01',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  from: {
                    alias: 'TAB02',
                    object: 'database.schema.table02',
                    tableName: 'table02',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  to: {
                    alias: 'TAB01',
                    object: 'database.schema.table01',
                    tableName: 'table01',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  type: JoinTypes.INNER,
                  on: 'TAB02.number_column = TAB01.number_column',
                },
              ],
            },
            {
              alias: 'TAB02',
              type: 'source',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [],
              joins: [
                {
                  target: {
                    alias: 'TAB01',
                    object: 'database.schema.table01',
                    tableName: 'table01',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  from: {
                    alias: 'TAB03',
                    object: 'database.schema.table03',
                    tableName: 'table03',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  to: {
                    alias: 'TAB02',
                    object: 'database.schema.table02',
                    tableName: 'table02',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  type: JoinTypes.INNER,
                  on: 'TAB02.number_column = TAB03.number_column',
                },
              ],
            },
            {
              alias: 'TAB03',
              type: 'source',
              object: 'database.schema.table03',
              tableName: 'table03',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [],
            },
          ],
        },
      ],
    },
  ],
};

export const MappingModelMockWithMappingAndJoinInSequence: ModelUI = {
  id: 'model-id',
  name: 'model-name',
  databases: [
    {
      databaseName: 'database',
      schemas: [
        {
          schemaName: 'schema',
          databaseName: 'database',
          tables: [
            {
              alias: 'TAB01',
              type: 'target',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [],
              mappings: [
                {
                  sources: [
                    {
                      object: 'database.schema.table02',
                      columnName: 'varchar_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'varchar_column',
                  },
                  type: MappingType.Column,
                  mapping: 'varchar_column',
                },
              ],
            },
            {
              alias: 'TAB02',
              type: 'source',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [],
              joins: [
                {
                  target: {
                    alias: 'TAB01',
                    object: 'database.schema.table01',
                    tableName: 'table01',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  from: {
                    alias: 'TAB03',
                    object: 'database.schema.table03',
                    tableName: 'table03',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  to: {
                    alias: 'TAB02',
                    object: 'database.schema.table02',
                    tableName: 'table02',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  type: JoinTypes.INNER,
                  on: 'TAB02.number_column = TAB03.number_column',
                },
                {
                  target: {
                    alias: 'TAB02',
                    object: 'database.schema.table02',
                    tableName: 'table02',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  from: {
                    alias: 'TAB04',
                    object: 'database.schema.table04',
                    tableName: 'table04',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  to: {
                    alias: 'TAB02',
                    object: 'database.schema.table02',
                    tableName: 'table02',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  type: JoinTypes.INNER,
                  on: 'TAB02.number_column = TAB04.number_column',
                },
              ],
            },
            {
              alias: 'TAB03',
              type: 'source',
              object: 'database.schema.table03',
              tableName: 'table03',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [],
            },
            {
              alias: 'TAB04',
              type: 'source',
              object: 'database.schema.table04',
              tableName: 'table04',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [],
            },
          ],
        },
      ],
    },
  ],
};

export const MappingModelMockWithoutColumns: ModelUI = {
  id: 'model-id',
  name: 'model-name',
  databases: [
    {
      databaseName: 'database',
      schemas: [
        {
          schemaName: 'schema',
          databaseName: 'database',
          tables: [
            {
              alias: 'TAB01',
              type: 'source',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [],
            },
            {
              alias: 'TAB02',
              type: 'target',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [],
            },
          ],
        },
      ],
    },
  ],
};

export const ModelUIMockWithMultipleMappings: ModelUI = {
  id: 'model-id',
  name: 'model-name',
  databases: [
    {
      databaseName: 'database',
      schemas: [
        {
          schemaName: 'schema',
          databaseName: 'database',
          tables: [
            {
              alias: 'TAB01',
              type: 'target',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table01',
                },
                {
                  columnName: 'varchar_column',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  object: 'database.schema.table01',
                },
              ],
              mappings: [
                {
                  sources: [
                    {
                      object: 'database.schema.table02',
                      columnName: 'varchar_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'varchar_column',
                  },
                  type: MappingType.Column,
                  mapping: 'varchar_column',
                },
              ],
            },
            {
              alias: 'TAB02',
              type: 'source',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table02',
                },
                {
                  columnName: 'varchar_column',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  object: 'database.schema.table02',
                },
              ],
              mappings: [
                {
                  sources: [
                    {
                      object: 'database.schema.table02',
                      columnName: 'varchar_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'varchar_column',
                  },
                  type: MappingType.Column,
                  mapping: 'varchar_column',
                },
              ],
            },
            {
              alias: 'TAB03',
              type: 'source',
              object: 'database.schema.table03',
              tableName: 'table03',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table02',
                },
                {
                  columnName: 'varchar_column',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  object: 'database.schema.table02',
                },
              ],
              mappings: [
                {
                  sources: [
                    {
                      object: 'database.schema.table03',
                      columnName: 'varchar_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'varchar_column',
                  },
                  type: MappingType.Column,
                  mapping: 'varchar_column',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const ModelUIMockWithNoMappingColumns: ModelUI = {
  id: 'model-id',
  name: 'model-name',
  databases: [
    {
      databaseName: 'database',
      schemas: [
        {
          schemaName: 'schema',
          databaseName: 'database',
          tables: [
            {
              alias: 'TAB01',
              type: 'target',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'boolean_column',
                  type: ColumnType.BOOLEAN,
                  sqlType: 'BOOLEAN',
                  object: 'database.schema.table01',
                },
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table01',
                },
                {
                  columnName: 'varchar_column',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  object: 'database.schema.table01',
                },
              ],
              mappings: [
                {
                  sources: [
                    {
                      object: 'database.schema.table02',
                      columnName: 'number_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'number_column',
                  },
                  type: MappingType.Column,
                  mapping: 'number_column',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const ModelUIMockMultipleTargets: ModelUI = {
  id: 'model-id',
  name: 'model-name',
  databases: [
    {
      databaseName: 'database',
      schemas: [
        {
          schemaName: 'schema',
          databaseName: 'database',
          tables: [
            {
              alias: 'TAB01',
              type: 'target',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'boolean_column',
                  type: ColumnType.BOOLEAN,
                  sqlType: 'BOOLEAN',
                  object: 'database.schema.table01',
                },
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table01',
                },
              ],
              mappings: [
                {
                  sources: [
                    {
                      object: 'database.schema.table02',
                      columnName: 'number_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'number_column',
                  },
                  type: MappingType.Column,
                  mapping: 'number_column',
                },
              ],
            },
            {
              alias: 'TAB02',
              type: 'target',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'varchar_column',
                  type: ColumnType.VARCHAR,
                  sqlType: 'VARCHAR',
                  object: 'database.schema.table02',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const ModelUINoRemainingMappings: ModelUI = {
  id: 'model-id',
  name: 'model-name',
  databases: [
    {
      databaseName: 'database',
      schemas: [
        {
          schemaName: 'schema',
          databaseName: 'database',
          tables: [
            {
              alias: 'TAB01',
              type: 'target',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table01',
                },
              ],
              mappings: [
                {
                  sources: [
                    {
                      object: 'database.schema.table02',
                      columnName: 'number_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'number_column',
                  },
                  type: MappingType.Column,
                  mapping: 'number_column',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const ModelUIMockWithMultipleTargets: ModelUI = {
  id: 'model-id',
  name: 'model-name',
  databases: [
    {
      databaseName: 'database',
      schemas: [
        {
          schemaName: 'schema',
          databaseName: 'database',
          tables: [
            {
              alias: 'TAB01',
              type: 'target',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table01',
                },
              ],
              mappings: [
                {
                  sources: [
                    {
                      object: 'database.schema.table03',
                      columnName: 'number_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'number_column',
                  },
                  type: MappingType.Column,
                  mapping: 'number_column',
                },
              ],
            },
            {
              alias: 'TAB02',
              type: 'target',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table02',
                },
              ],
              mappings: [
                {
                  sources: [
                    {
                      object: 'database.schema.table03',
                      columnName: 'number_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table02',
                    columnName: 'number_column',
                  },
                  type: MappingType.Column,
                  mapping: 'number_column',
                },
              ],
            },
            {
              alias: 'TAB03',
              type: 'source',
              object: 'database.schema.table03',
              tableName: 'table03',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: ColumnType.NUMBER,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table03',
                },
              ],
              mappings: [
                {
                  sources: [
                    {
                      object: 'database.schema.table03',
                      columnName: 'number_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table01',
                    columnName: 'number_column',
                  },
                  type: MappingType.Column,
                  mapping: 'number_column',
                },
                {
                  sources: [
                    {
                      object: 'database.schema.table03',
                      columnName: 'number_column',
                    },
                  ],
                  target: {
                    object: 'database.schema.table02',
                    columnName: 'number_column',
                  },
                  type: MappingType.Column,
                  mapping: 'number_column',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

export const EmptyModel: ModelUI = {
  id: 'model-id',
  name: 'model-name',
  databases: [
    {
      databaseName: 'database',
      schemas: [
        {
          schemaName: 'schema',
          databaseName: 'database',
          tables: [
          ],
        },
      ],
    },
  ],
};

export const ModelWithSourcesAndJoins: ModelUI = {
  id: 'model-id',
  name: 'model-name',
  databases: [
    {
      databaseName: 'database',
      schemas: [
        {
          schemaName: 'schema',
          databaseName: 'database',
          tables: [
            {
              alias: 'TAB01',
              type: 'source',
              object: 'database.schema.table01',
              tableName: 'table01',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: 'NUMBER' as ColumnType,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table01',
                },
              ],
              joins: [
                {
                  target: {
                    alias: 'TAB01',
                    object: 'database.schema.table01',
                    tableName: 'table01',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  from: {
                    alias: 'TAB02',
                    object: 'database.schema.table02',
                    tableName: 'table02',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  to: {
                    alias: 'TAB01',
                    object: 'database.schema.table01',
                    tableName: 'table01',
                    databaseName: 'database',
                    schemaName: 'schema',
                  },
                  type: JoinTypes.INNER,
                  on: 'TAB01.number_column = TAB02.number_column',
                },
              ],
            },
            {
              alias: 'TAB02',
              type: 'source',
              object: 'database.schema.table02',
              tableName: 'table02',
              databaseName: 'database',
              schemaName: 'schema',
              columns: [
                {
                  columnName: 'number_column',
                  type: 'NUMBER' as ColumnType,
                  sqlType: 'NUMBER',
                  object: 'database.schema.table02',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};