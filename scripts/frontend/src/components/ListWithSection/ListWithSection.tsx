import { Box, SelectChangeEvent, Stack } from '@mui/material';
import AccordionForList, { IAccordionForList } from 'components/ListWithSection/AccordionForList/AccordionForList';
import SearchBar from 'components/SearchBar/SearchBar';
import { ReactNode, useMemo, useState } from 'react';
import AccordionCard, { IAccordionCardProps } from 'components/ListWithSection/AccordionCard/AccordionCard';
import styles from './ListWithSection.module.scss';
import { H6 } from 'components/common/Text/TextComponents';
import { useTranslation } from 'locales/i18n';
import CustomSelect, { IMenuItem } from 'components/CustomSelect/CustomSelect';

interface IListWithSection {
  sectionSource: IAccordionForList[];
  customTitle?: string;
}

export default function ListWithSection({ sectionSource, customTitle }: IListWithSection) {
  const { t } = useTranslation('common');

  const [searchBarValue, setSearchBarValue] = useState('');
  const [categorySelectValue, setCategorySelectValue] = useState('');

  const [memoSectionSource, memoAccordionCards, memoCategories] = useMemo(() => {
    const sectionSourceMapped: IAccordionForList[] = [];
    const accordionCardsMapped: IAccordionCardProps[] = [];
    const categoriesMapped: IMenuItem[] = [{ label: '-', value: '-' }];

    sectionSource.forEach(({ accordionSummary, accordionSections }) => {
      categoriesMapped.push({
        label: t(accordionSummary),
        value: accordionSummary,
      });

      if (!categorySelectValue || categorySelectValue == accordionSummary || categorySelectValue == '-') {
        accordionSections.forEach(({ accordionCards }) => {
          accordionCards.forEach((accordionCard) => {
            if(accordionCard.url && accordionCard.isLink) {
              accordionCard.customOnClick = () => window.open(accordionCard.url, '_blank');
            }
          });
          accordionCardsMapped.push(...accordionCards)}
        );
        sectionSourceMapped.push({ accordionSummary, accordionSections });
      }
    });

    return [sectionSourceMapped, accordionCardsMapped, categoriesMapped];
  }, [sectionSource, categorySelectValue]);

  const onChangeSearchBar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value ?? '';
    setSearchBarValue(newValue.toLowerCase());
  };

  const onChangeSelect = (event: SelectChangeEvent<unknown>, _: ReactNode) => {
    setCategorySelectValue(event.target.value as string);
  };

  const sectionTitle = customTitle ? customTitle : t('SelectSource');

  return (
    <Stack direction="column" spacing={4}>
      <H6>{sectionTitle}</H6>
      <Stack direction="row" spacing={2}>
        <SearchBar onChange={onChangeSearchBar} />
        <CustomSelect label={t('FilterByCategory')} menuItems={memoCategories} onChange={onChangeSelect} />
      </Stack>
      {searchBarValue.length === 0 ? (
        <Stack direction="column" spacing={2}>
          {memoSectionSource.map((AccordionItem, index) => (
            <AccordionForList key={`accordion-${index}`} {...AccordionItem} />
          ))}
        </Stack>
      ) : (
        <Box className={styles.sourcesContainer}>
          {memoAccordionCards
            .filter(({ label }) => label.toLowerCase().includes(searchBarValue))
            .map((accordionCard, index) => (
              <AccordionCard key={`source-filtered-${index}`} {...accordionCard} />
            ))}
        </Box>
      )}
    </Stack>
  );
}
