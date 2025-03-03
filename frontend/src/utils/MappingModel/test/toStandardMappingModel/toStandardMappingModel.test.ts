import 'reflect-metadata';
import { toStandardMappingModel } from '../../toStandardMappingModel';
import { StandardUnifiedDataModelMock, UnifiedDataModelMock } from './MockStandardUnifiedDataModelMock';
import { ModelUIMockWithMappings, StandardMappingModelMockWithMappings } from './MockModelWithMappings';
import { ModelUIMockWithJoin, StandardMappingModelMockWithJoin } from './MockModelWithJoin';
import { ModelUIMockWithUnions, StandardMappingModelMockWithUnions } from './MockModelWithUnions';
import { ModelUIMockComplex, StandardMappingModelMockComplex } from './MockModel';
import { ModelUIMockWithWhereQualify, StandardMappingModelMockWithWhereQualify } from './MockModelWithWhereQualify';
import {
  ModelUIMockWithMultipleTargets,
  StandardMappingModelMockWithMultipleTargets,
} from './MockModelWithMultipleTargets';
import { ExpectedMockModelWithTableInJoinAndTableSource, MockModelWithTableInJoinAndTableSource } from './MockModelWithTableInJoinAndTableSource';

describe('toStandardMappingModel test', () => {
  test('should support column mappings from one source to one target', () => {
    // arrange
    const model = ModelUIMockWithMappings;
    const expected = StandardMappingModelMockWithMappings;

    // act
    const result = toStandardMappingModel(model);

    // assert
    expect(result).toEqual(expected);
  });

  test('should support mappings with a join between two source tables', () => {
    // arrange
    const model = ModelUIMockWithJoin;
    const expected = StandardMappingModelMockWithJoin;

    // act
    const result = toStandardMappingModel(model);

    // assert
    expect(result).toEqual(expected);
  });

  test('should support unions', () => {
    // arrange
    const model = ModelUIMockWithUnions;
    const expected = StandardMappingModelMockWithUnions;

    // act
    const result = toStandardMappingModel(model);

    // assert
    expect(result).toEqual(expected);
  });

  test('should support where and qualify in source and joins', () => {
    // arrange
    const model = ModelUIMockWithWhereQualify;
    const expected = StandardMappingModelMockWithWhereQualify;

    // act
    const result = toStandardMappingModel(model);

    // assert
    expect(result).toEqual(expected);
  });

  test('should support transformations with multiple targets', () => {
    // arrange
    const model = ModelUIMockWithMultipleTargets;
    const expected = StandardMappingModelMockWithMultipleTargets;

    // act
    const result = toStandardMappingModel(model);

    // assert
    expect(result).toEqual(expected);
  });

  test('should convert UnifiedDataModel toStandardMappingModel', () => {
    // assert
    const model = UnifiedDataModelMock;
    const expected = StandardUnifiedDataModelMock;

    // act
    const result = toStandardMappingModel(model);

    // assert
    expect(result).toEqual(expected);
  });

  test('should convert complex MockModel toStandardMappingModel', () => {
    // assert
    const model = ModelUIMockComplex;
    const expected = StandardMappingModelMockComplex;

    // act
    const result = toStandardMappingModel(model);

    // assert
    expect(result).toEqual(expected);
  });

  test('should correctly transform a complex model with joins and table sources to a standard mapping model when the join table from one target is the source for the other target table', () => {
    // assert
    const model = MockModelWithTableInJoinAndTableSource;
    const expected = ExpectedMockModelWithTableInJoinAndTableSource

    // act
    const result = toStandardMappingModel(model);
    
    // assert
    expect(result).toEqual(expected);
})});
