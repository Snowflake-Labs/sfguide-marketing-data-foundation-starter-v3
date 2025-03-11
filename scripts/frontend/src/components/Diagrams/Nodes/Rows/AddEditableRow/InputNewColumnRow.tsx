import styles from './InputNewColumnRow.module.scss';

interface Props {
  columnName: string;
  onChange: (newColumnName: string) => void;
  onKeyUp?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
}

export default function InputNewColumnRow(props: Props) {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value);
  };

  return (
    <input
      autoFocus
      type="editable"
      className={styles.editable}
      defaultValue={props.columnName}
      onChange={handleOnChange}
      onBlur={props.onBlur}
      onKeyUp={props.onKeyUp}
    />
  );
}
