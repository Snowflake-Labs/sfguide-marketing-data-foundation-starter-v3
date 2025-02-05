import AddButton from 'components/AddButton/AddButton';
import FilterButton from 'components/FilterButton/FilterButton';
import SearchBar from 'components/SearchBar/SearchBar';
import styles from './ExistingSources.module.scss';
import SourcesTable from './Table/SourcesTable';
import DeleteButton from 'components/DeleteButton/DeleteButton';
import { useExistingSourcesContext } from '../../../contexts/ExistingSourcesContext/ExistingSourcesContext';
import { useTranslation } from 'locales/i18n';
import { useNavigate } from 'react-router-dom';
import { PathConstants } from 'routes/pathConstants';

export default function ExistingSources() {
  return (
    <div>
      <ActionsRow></ActionsRow>
      <SourcesTable></SourcesTable>
    </div>
  );
}

function ActionsRow() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const { rowsToDelete, deleteExistingSources, setCurrentFilter } = useExistingSourcesContext();

  const onChangeSearchBar = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFilter(event.target.value);
  };

  const handleGoToAddNewSource = () => {
    navigate(`/${PathConstants.DATASOURCES}/${PathConstants.PROVIDERS}`);
  };

  return (
    <div className={styles.row_box}>
      <SearchBar onChange={onChangeSearchBar} />
      <FilterButton></FilterButton>
      {Object.keys(rowsToDelete).length > 0 && <DeleteButton onClick={deleteExistingSources}></DeleteButton>}
      <AddButton variant="contained" onClick={handleGoToAddNewSource}>
        {t('AddNewSource')}
      </AddButton>
    </div>
  );
}
