import { Subtitle2 } from 'components/common/Text/TextComponents';
import styles from './DragGhost.module.scss';
import { renderToStaticMarkup } from 'react-dom/server';

export default function DragGhost(label: string, type: string): HTMLElement {
  const ghostElement = renderToStaticMarkup(<DragElement label={label} />);
  const container = document.createElement('div');
  container.innerHTML = ghostElement;
  container.classList.add(styles.draggable);
  container.classList.add(styles[type]);
  container.id = 'drag-ghost';
  document.body.appendChild(container);
  return container;
}

function DragElement(props: { label: string }) {
  return (
    <>
      <Subtitle2>{props.label}</Subtitle2>
    </>
  );
}
