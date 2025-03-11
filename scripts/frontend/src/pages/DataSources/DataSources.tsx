import { useMemo, useEffect, useState, SyntheticEvent } from 'react';
import { useTranslation } from 'locales/i18n';
import Tabs from 'components/common/Tabs/Tabs';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FullPathConstants, PathConstants } from 'routes/pathConstants';
import { getAddNewSourceStepsPath } from './AddNewSources/AddNewSourceStepsPath';
import { ExistingSourcesContextWrapper } from 'contexts/ExistingSourcesContext/ExistingSourcesContext';
import { StepsContextWrapper } from 'components/Stepper/StepsContext/StepsContext';

const providers: string[] = [FullPathConstants.toProviders, FullPathConstants.toModel];

export default function DataSources() {
  const { t } = useTranslation('common');
  const tabs = useMemo(() => [t('TabPanelExistingSources'), t('TabPanelAddNewSource')], [t]);
  const steps = getAddNewSourceStepsPath(t);
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const selectedTab = providers.some((provider: string) => location.pathname.startsWith(provider)) ? 1 : 0;
    setValue(selectedTab);
  }, [location.pathname]);

  const handleChange = (_event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
    navigate(newValue === 0 ? PathConstants.EXISTING : PathConstants.PROVIDERS);
  };

  return (
    <ExistingSourcesContextWrapper>
      <StepsContextWrapper stepsPath={steps}>
        <Tabs labels={tabs} onChange={handleChange} value={value}>
        </Tabs>
      </StepsContextWrapper>
    </ExistingSourcesContextWrapper>
  );
}
