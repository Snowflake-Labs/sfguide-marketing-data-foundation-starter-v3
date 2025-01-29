import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import styles from './SearchBar.module.scss';
import { HTMLAttributes } from 'react';

export interface ISearchBarProp extends HTMLAttributes<HTMLElement> {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ onChange, ...props }: ISearchBarProp) {
  return (
    <div {...props} className={`${styles.search} ${props.className}`}>
      <SearchIcon className={styles.search_icon} />
      <InputBase className={styles.input} placeholder="Search" onChange={onChange} />
    </div>
  );
}
