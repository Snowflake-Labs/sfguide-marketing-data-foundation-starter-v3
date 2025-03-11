import styles from './ModalComponent.module.scss';
import { Modal } from '@mui/material';

export interface ModalProps {
  open: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

export default function ModalComponent(props: ModalProps) {
  return (
    <Modal className={styles.modal} open={props.open} onClose={props.onClose}>
      <div className={styles.modalContent}>{props.children}</div>
    </Modal>
  );
}
