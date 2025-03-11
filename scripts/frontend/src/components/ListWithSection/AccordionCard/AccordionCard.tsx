import { Stack } from '@mui/material';
import Image from 'components/common/Image/Image';
import { Body1 } from 'components/common/Text/TextComponents';
import { useNavigate, useParams } from 'react-router-dom';
import CustomCard from 'components/CustomCard/CustomCard';
import ChipList from '../ChipList/ChipList';

export interface IAccordionCardProps {
  chips: string[];
  disabled: boolean;
  image_name: string;
  label: string;
  id: string;
  key_name: string;
  providers?: string[];
  url?: string;
  isLink?: boolean;
  customOnClick?: (event: any) => void;
}

export default function AccordionCard({
  chips,
  disabled,
  image_name,
  label,
  key_name,
  providers,
  customOnClick
}: IAccordionCardProps) {
  let { providerId } = useParams();
  const navigate = useNavigate();

  const onCardClick = (event: any) => {
    event.preventDefault();
    navigate(key_name);
  };

  const isDisabled = () => {
    if (providers) return !providers.some((provider) => providerId === provider);
    return disabled;
  };

  return (
    <CustomCard onClick={customOnClick? customOnClick: onCardClick} selected={false} disabled={isDisabled()}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Image image_name={image_name} image_height={36} image_width={36} />
        <Body1>{label}</Body1>
      </Stack>
      <ChipList chips={chips} />
    </CustomCard>
  );
}
