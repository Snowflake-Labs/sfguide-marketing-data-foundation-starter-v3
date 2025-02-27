import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SelectTargetModelPage from './SelectTargetModelPage';
import { act } from 'react';
import { TYPES } from 'ioc/types';
import { IMappingService } from 'interfaces/IMappingService';
import { IPubSubService } from 'interfaces/IPubSubService';
import { ISnowflakeService } from 'interfaces/ISnowflakeService';
import { mockMappingService } from 'JestTest/mocks/mockMappingService';

const schemasMenuItems = [
  { value: '1', label: 'Schema 1' },
  { value: '2', label: 'Schema 2' },
];

const databaseMenuItems = [
  { value: '1', label: 'Database 1' },
  { value: '2', label: 'Database 2' },
];

jest.mock('ioc/inversify.config', () => ({
  container: {
    get: (type: symbol) => {
      switch (type) {
        case TYPES.IMappingService:
          const mappingService: IMappingService = mockMappingService;
          return mappingService;
        case TYPES.IPubSubService:
          const pubSubService: IPubSubService = {
            subscribeToEvent: jest.fn(),
            unsubscribeFromEvent: jest.fn(),
            emitEvent: jest.fn(),
          };
          return pubSubService;
        default:
          const snowflakeService: ISnowflakeService = {
            get_current_database: jest.fn(),
            get_account_name: jest.fn(),
            get_organization_name: jest.fn(),
            get_databases: jest.fn().mockResolvedValue(databaseMenuItems),
            get_schemas: jest.fn().mockResolvedValue(schemasMenuItems),
            get_account_identifier: jest.fn(),
          };
          return snowflakeService;
      }
    },
  },
}));

jest.mock('locales/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('SelectTargetModelPage', () => {
  it('renders the page correctly', () => {
    render(
      <MemoryRouter>
        <SelectTargetModelPage />
      </MemoryRouter>
    );

    expect(screen.getByText('SelectTargetModelPage')).toBeInTheDocument();

    expect(screen.getByTestId('test-id-button-new-target')).toBeInTheDocument();
  });

  it("opens the custom drawer when the 'NewTargetModel' button is clicked", () => {
    render(
      <MemoryRouter>
        <SelectTargetModelPage />
      </MemoryRouter>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('test-id-button-new-target'));
    });

    expect(screen.getByTestId('CloseIcon')).toBeInTheDocument();
  });

  it('updates the TargetModelName in textFieldsState when a text field value changes', async () => {
    render(
      <MemoryRouter>
        <SelectTargetModelPage />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByTestId('test-id-button-new-target'));
    const targetModelNameDiv = screen.getByTestId('text-field-target-model') as HTMLInputElement;
    const targetModelNameInput = targetModelNameDiv.querySelector('input')!;

    act(() => {
      fireEvent.change(targetModelNameInput, { target: { value: 'New Target TransformationModel' } });
    });

    expect(targetModelNameInput).toHaveValue('New Target TransformationModel');
  });

  it('enables the create button when all text fields are filled', async () => {
    render(
      <MemoryRouter>
        <SelectTargetModelPage />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTestId('test-id-button-new-target'));

    const targetModelNameDiv = screen.getByTestId('text-field-target-model') as HTMLInputElement;
    const targetModelNameInput = targetModelNameDiv.querySelector('input')!;

    fireEvent.change(targetModelNameInput, { target: { value: 'New Target TransformationModel' } });

    fireEvent.mouseDown(screen.getByLabelText('Database'));
    waitFor(() => screen.getByText('Database 1'));

    fireEvent.mouseDown(screen.getByLabelText('Schema'));
    waitFor(() => fireEvent.click(screen.getByText('Schema 1')));

    waitFor(() => expect(screen.getByText('Create')).toBeEnabled());
  });
});
