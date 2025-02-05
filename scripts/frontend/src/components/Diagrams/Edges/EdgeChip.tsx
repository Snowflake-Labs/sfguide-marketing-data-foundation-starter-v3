import styles from './Edge.module.scss';
import { HTMLAttributes, ReactNode } from 'react';

interface IEdgeChipProps extends HTMLAttributes<HTMLDivElement> {
  chipX: number;
  chipY: number;
  children: ReactNode;
}

export default function EdgeChip({ chipX, chipY, onClick, children, ...props }: IEdgeChipProps) {
  return (
    <div
      {...props}
      style={{
        position: 'absolute',
        transform: `translate(-50%, -50%) translate(${chipX}px,${chipY}px)`,
        pointerEvents: 'all',
        borderRadius: '20px',
        padding: '8px',
        fontSize: 12,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className={`nodrag nopan ${styles.edgeChip} ${props.className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
