import { Button } from '../Button';

import styles from './card.module.scss';

interface Card {
  id: string;
  taskName: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Done'
}

interface CardProps {
  card: Card
  customStyle: React.CSSProperties;
  innerRef: React.LegacyRef<HTMLDivElement>
  onChangeDescription: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  onChangeTaskName: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleRemoveCard: () => void
}

export const Card = ({
  card,
  customStyle,
  innerRef,
  onChangeDescription,
  onChangeTaskName,
  handleRemoveCard,
  ...draggableProps
}: CardProps) => {
  return (
    <div
      ref={innerRef}
      className={styles.card}
      style={customStyle}
      {...draggableProps}
    >
      <div data-status={card.status} className={styles.tag}/>
      <input
        className={styles.task}
        type='text'
        name='taskname' 
        value={card.taskName} 
        placeholder='Task name 🔥'
        onChange={onChangeTaskName}
      />
      <textarea
        className={styles.description}
        placeholder='Task description'
        spellCheck='false'
        value={card.description}
        onChange={onChangeDescription}
      />
      <div className={styles.buttonContainer}>
        <Button title='REMOVER' onClick={handleRemoveCard} />
      </div>
    </div>
  )
}
