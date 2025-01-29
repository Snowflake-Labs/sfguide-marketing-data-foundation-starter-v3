const PathConstants = {
  HOME: '/',
  DATASOURCES: 'datasources',
  EXISTING: 'existing',
  PROVIDERS: 'providers',
  CONNECTORS: 'connectors',
  LINK: 'link',
  DATABASE: 'database',
  SCHEMA: 'schema',
  MODELS: 'models',
  EDIT: 'edit',
  PROGRESS: 'progress',
  DATAQUALITY: 'dataquality',
  DATAEXPLORER: 'explorer',
  AIASSISTANT: 'aiassistant',
  MARKETINGEXECUTION: 'marketingexecution',
  NEWTABLE: 'new',
};

const ArgumentsConstants = {
  PROVIDER: ':providerId',
  CONNECTOR: ':connectorId',
  SOURCE: ':sourceId',
  MODEL: ':modelId',
  DATABASE: ':databaseName',
  SCHEMA: ':schemaName',
};

const FullPathConstants = {
  toProviders: `/${PathConstants.DATASOURCES}/${PathConstants.PROVIDERS}`,
  toModel: `/${PathConstants.DATASOURCES}/${PathConstants.MODELS}`,
  toExistingSources: `/${PathConstants.DATASOURCES}/${PathConstants.EXISTING}`,
};

const isDeniedPath = (path: string): boolean => /^\/datasources\/(providers|existing|[0-9]+\/models)\/?$/.test(path);

const isModelIdPage = (path: string): boolean => /datasources\/[0-9]+\/models\/[0-9]+/g.test(path);

export { PathConstants, ArgumentsConstants, FullPathConstants, isModelIdPage, isDeniedPath };
