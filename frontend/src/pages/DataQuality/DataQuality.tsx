import { useTranslation } from 'locales/i18n';
import { H6 } from 'components/common/Text/TextComponents';
import DataQualityCard from 'components/DataQuality/DataQualityCard';
import styles from './DataQuality.module.scss';
import Paginator from 'components/common/Paginator/Paginator';
import { container } from 'ioc/inversify.config';
import { ISnowflakeService } from 'interfaces/ISnowflakeService';
import { TYPES } from 'ioc/types';
import { useEffect, useState } from 'react';
import getNotebooks from './Notebooks';
import { Box } from '@mui/material';
import Spinner from 'components/common/Spinner/Spinner';

export default function DataQuality() {
  const { t } = useTranslation('common');
  const [account, setAccount] = useState('');
  const [org, setOrg] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [loadingOrg, setLoadingOrg] = useState(true);

  const SnowflakeServices = container.get<ISnowflakeService>(TYPES.ISnowflakeService);

  useEffect(() => {
    SnowflakeServices.get_account_identifier().then((response) => {
      setAccount(response.account_name);
      setOrg(response.organization_name);
      setLoadingAccount(false);
      setLoadingOrg(false);
    });
  }, []);

  const [notebooks, setNotebooks] = useState<string[][]>([]);

  useEffect(() => {
    if (org == '' || account == '') {
      return;
    }
    const notebooks = getNotebooks({ t, org, account });

    setNotebooks(notebooks);
    SetnotebooksDisplay(notebooks.slice(0, 4));
  }, [org, account]);

  const [notebooksDisplay, SetnotebooksDisplay] = useState(notebooks.slice(0, 4));

  function onPageChange(newPage: number, page: number) {
    let startSlice = 4 * (newPage + 1) - 4;
    let endSlice = 4 * (newPage + 1);
    SetnotebooksDisplay(notebooks.slice(startSlice, endSlice));
  }

  useEffect(() => {
    setLoading(loadingAccount || loadingOrg);
  }, [loadingAccount, loadingOrg]);

  return (
    <div className={`${styles.container} dataQuality`}>
      <div>
        <H6>{t('DataQualityPage')}</H6>
        <Spinner loading={loading}>
          {notebooksDisplay.map((notebook, index) => {
            return (
              <div key={`data-quality-card${index}`} className={styles.dataQuality}>
                <DataQualityCard title={notebook[0]} description={notebook[1]} link={notebook[2]} />
              </div>
            );
          })}
        </Spinner>
      </div>
      <Paginator ItemsCount={notebooks.length} onPageChange={onPageChange} />
    </div>
  );
}
