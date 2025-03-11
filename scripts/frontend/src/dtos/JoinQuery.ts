import { JoinConditions, JoinOperators, JoinTypes } from './JoinDefinition';
import { TableModel } from './ModelUI';

export interface JoinQuery {
  type: JoinTypes;
  source?: TableModel;
  target?: TableModel;
  clauses: JoinClauseQuery[];
}

export interface JoinClauseQuery {
  sourceColumn: string;
  targetColumn: string;
  relation: JoinOperators;
  condition: JoinConditions | '';
}

export const JoinQuery: JoinQuery = {
  type: JoinTypes.INNER,
  clauses: [],
};

export const JoinClauseQuery: JoinClauseQuery = {
  condition: '',
  sourceColumn: '',
  targetColumn: '',
  relation: JoinOperators.Equal,
};
