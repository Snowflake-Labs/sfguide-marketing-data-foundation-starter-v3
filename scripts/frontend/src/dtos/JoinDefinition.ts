export enum JoinTypes {
  INNER = 'INNER',
  LEFT = 'LEFT',
  RIGHT = 'RIGHT',
}

export enum JoinConditions {
  AND = 'AND',
  OR = 'OR',
  NOT = 'NOT',
}

export enum JoinOperators {
  Equal = '=',
  NotEqual = '!=',
  Greater = '>',
  GraterInclusive = '>=',
  Lesser = '<',
  LesserInclusive = '<=',
}
