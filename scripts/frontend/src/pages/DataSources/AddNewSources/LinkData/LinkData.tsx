import { Stack } from '@mui/material';
import CustomCard from 'components/CustomCard/CustomCard';
import { Body1, H6 } from 'components/common/Text/TextComponents';
import { useTranslation } from 'locales/i18n';
import Image from '../../../../components/common/Image/Image';
import styles from './LinkData.module.scss';
import { useNavigate } from 'react-router-dom';
import { PathConstants } from 'routes/pathConstants';
import AddNewSourceFooter from 'components/AddNewSourceFooter/AddNewSourceFooter';
import { Button } from 'components/common/Button/Button';
import { useStepsContext } from 'components/Stepper/StepsContext/StepsContext';
import { useEffect } from 'react';

export interface ILinkDataProps {}

export default function LinkData(props: ILinkDataProps) {
  const { t } = useTranslation('common');
  const { setSteps } = useStepsContext();
  const navigate = useNavigate();

  useEffect(() => {
    setSteps(0, 1);
  }, []);

  const onClickBack = () => {
    setSteps(0, 0);
    navigate(`/${PathConstants.DATASOURCES}/${PathConstants.PROVIDERS}/`);
  };

  const onClickDataLink = (event: any) => {
    navigate(PathConstants.CONNECTORS);
  };

  const onClickDataInSnow = (event: any) => {
    navigate(PathConstants.LINK);
  };

  return (
    <Stack direction="column" spacing={4}>
      <H6>{t('SelectSource')}</H6>
      <Stack direction="row" spacing={4}>
        <CustomCard onClick={onClickDataLink}>
          <Stack direction="row" spacing={2} className={styles.content_wrapper}>
            <Image image_name="bring_data" image_height={16} image_width={22} />
            <Body1>{t('BringDataIntoSnowflake')}</Body1>
          </Stack>
        </CustomCard>
        <CustomCard onClick={onClickDataInSnow}>
          <Stack direction="row" spacing={2} className={styles.content_wrapper}>
            <Image image_name="link_data" image_height={18} image_width={18} />
            <Body1>{t('LinkDataAlreadyInSnowflake')}</Body1>
          </Stack>
        </CustomCard>
      </Stack>
      <AddNewSourceFooter>
        <Button variant="outlined" onClick={onClickBack}>
          {t('Back')}
        </Button>
      </AddNewSourceFooter>
    </Stack>
  );
}
