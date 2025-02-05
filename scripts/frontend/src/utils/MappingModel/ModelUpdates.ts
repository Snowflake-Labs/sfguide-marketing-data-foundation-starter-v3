import { ModelUI, ColumnRelation, JoinModel, TableModel, MappingType, ColumnMetadata } from 'dtos/ModelUI';
import {
  addTableModelToModelUI,
  findTableModelInModelUI,
  isColumnMetadataEqual,
  isColumnRelationMatch,
} from './ModelUIHelpers';

/**
 * Removes a column relation from the mapping model.
 * @param model The mapping model to remove the column relation from.
 * @param column The column relation to remove.
 * @returns The updated mapping model.
 */
export function removeColumnRelationFromModelUI(model: ModelUI, column: ColumnRelation): ModelUI {
  const modelCopy: ModelUI = JSON.parse(JSON.stringify(model));
  const [trgDatabase, trgSchema] = column.target.object.split('.');

  for (const source of column.sources) {
    const [srcDatabase, srcSchema] = source.object.split('.');

    modelCopy.databases.forEach((db) => {
      if (db.databaseName !== srcDatabase && db.databaseName !== trgDatabase) return;
      db.schemas.forEach((sch) => {
        if (sch.schemaName !== srcSchema && sch.schemaName !== trgSchema) return;
        sch.tables.forEach((t) => (t.mappings = t.mappings?.filter((m) => !isColumnRelationMatch(column, m))));
      });
    });
  }

  return modelCopy;
}

/**
 * Removes a mapping from the ModelUI based on the target handle ID.
 *
 * @param targetHandleId - The target handle ID in the format "databaseName.schemaName.tableName.mapping".
 * @param model - The ModelUI object to modify.
 * @returns The updated ModelUI object with the mapping removed.
 */
export function removeColumnRelationFromModelUIByMapping(model: ModelUI, targetHandleIdSplited: string[]): ModelUI {
  const newModel = { ...model };
  const [databaseName, schemaName, tableName, mapping] = targetHandleIdSplited;

  for (let db of newModel.databases) {
    if (db.databaseName !== databaseName) continue;
    for (let schema of db.schemas) {
      if (schema.schemaName !== schemaName) continue;
      for (let table of schema.tables) {
        if (table.tableName !== tableName) continue;
        if (table.mappings) {
          for (let i = 0; i < table.mappings.length; i++) {
            if (table.mappings[i].target.columnName !== mapping) continue;
            table.mappings.splice(i, 1);
            return newModel;
          }
        }
      }
    }
  }
  return newModel;
}

/**
 * Adds a column relation to the mapping model.
 * Replaces the existing column relation if it already exists.
 * Avoids adding duplicate column relations.
 * @param model The mapping model to add the column relation to.
 * @param newColumnRelation The column relation to add.
 * @returns The updated mapping model.
 */
export function updateColumnRelationInModelUI(
  model: ModelUI,
  newColumnRelation: ColumnRelation,
  sourceFilter: string
): ModelUI {
  const modelCopy: ModelUI = JSON.parse(JSON.stringify(model));
  modelCopy.databases.forEach((db) => {
    db.schemas.forEach((sch) => {
      sch.tables.forEach((t) => {
        const isAnySource = newColumnRelation.sources?.some((src) => src.object === t.object);
        if (t.object !== newColumnRelation.target.object && !isAnySource) return;
        t.mappings = t.mappings?.filter(
          (m) =>
            !isColumnMetadataEqual(newColumnRelation.target, m.target) ||
            !m.sources?.some((src) => src.object.startsWith(sourceFilter))
        );
        t.mappings = t.mappings ? [...t.mappings, newColumnRelation] : [newColumnRelation];
      });
    });
  });

  return { ...modelCopy };
}

/**
 * Removes a table from the mapping model.
 * Removes all related joins and mappings related to the table.
 * @param model The mapping model to remove the table from.
 * @param tableObject The table object to remove.
 * @param parentObject Context to avoid removing the table if it is a child of another table.
 * @returns The updated mapping model.
 */
export function removeDeepTableFromModelUI(model: ModelUI, tableObject: string, parentObject?: string): ModelUI {
  const isRelationEmpty = (relation: ColumnRelation[] | JoinModel[] | undefined) => !relation || relation.length === 0;
  const isTargetRemovable = (t: TableModel) => t.type === 'target' && t.object === tableObject;
  const isSourceRemovable = (t: TableModel) =>
    t.type === 'source' && t.object === tableObject && isRelationEmpty(t.mappings) && isRelationEmpty(t.joins);
  const isMappingRemovable = (m: ColumnRelation) =>
    m.target.object === tableObject ||
    (m.sources?.find((src) => src.object === tableObject) && m.target.object == parentObject);
  const isJoinRemovable = (j: JoinModel) =>
    (j.from.object === tableObject || j.to.object === tableObject) && j.target.object == parentObject;

  model.databases.forEach((db) => {
    db.schemas.forEach((sch) => {
      sch.tables.forEach((t) => {
        if (t.mappings) t.mappings = t.mappings.filter((m) => !isMappingRemovable(m));
        if (t.joins) t.joins = t.joins.filter((j) => !isJoinRemovable(j));
      });
      sch.tables = sch.tables.filter((t) => !isTargetRemovable(t) && !isSourceRemovable(t));
    });
  });
  return { ...model };
}

/*
 * Adds a join model to the mapping model.
 * Adds the the source table to the model if it does not exist.
 * @param model The mapping model to add the join model to.
 * @param joinModel The join model interface, represents the join between two tables.
 * @param source The source table to join, will be added if not already in the model
 * @returns The updated mapping model.
 */
export function addJoinModelToModelUI(model: ModelUI, joinModel: JoinModel, from: TableModel): ModelUI {
  const newModel = JSON.parse(JSON.stringify(model));

  const sourceTable = findTableModelInModelUI(joinModel.to, newModel);
  if (!sourceTable) return newModel;

  // Ensure the target table exists in the model
  if (!findTableModelInModelUI(from, newModel)) {
    addTableModelToModelUI(newModel, from);
  }

  // Add or update the join in the source table
  sourceTable.joins = sourceTable.joins || [];
  const existingJoinIndex = sourceTable.joins.findIndex(
    (existingJoin) =>
      existingJoin.to.object === joinModel.to.object && existingJoin.from.object === joinModel.from.object
  );

  if (existingJoinIndex > -1) {
    sourceTable.joins[existingJoinIndex] = joinModel;
  } else {
    sourceTable.joins.push(joinModel);
  }

  return newModel;
}

export function FillTargetsColumnRelationsWithNulls(model: ModelUI) {
  model.databases.forEach((database) => {
    database.schemas.forEach((schema) => {
      schema.tables.forEach((table) => {
        if (table.type != 'target') return;
        table.columns.forEach((column) => {
          const object = column.object;
          const name = column.columnName;
          if (table.mappings?.find((mapping) => mapping.target.columnName == name && mapping.target.object == object))
            return;
          const newRelation: ColumnRelation = {
            sources: [{ object: 'NULL', columnName: 'NULL' }],
            target: { columnName: name, object: object },
            type: MappingType.Static,
            mapping: 'NULL',
          };
          if (!table.mappings) table.mappings = [];
          return table.mappings.push(newRelation);
        });
      });
    });
  });

  return model;
}

/**
 * Removes a column from the mapping model.
 * Removes all related transformations related to the column.
 * @param model The mapping model to remove the column from.
 * @param column The column metadata to remove.
 * @returns The updated mapping model without the column.
 */
export function removeColumnFromModelUI(model: ModelUI, column: ColumnMetadata): ModelUI {
  model.databases.forEach((db) => {
    db.schemas.forEach((sch) => {
      sch.tables.forEach((t) => {
        if (t.object === column.object) t.columns = t.columns.filter((c) => c.columnName !== column.columnName);
        if (t.mappings) t.mappings = t.mappings.filter((m) => !isColumnMetadataEqual(m.target, column));
      });
    });
  });
  return { ...model };
}
