import { ChangeEvent } from 'react';
import { Draggable } from 'react-beautiful-dnd';

import { Button } from '../Button';
import { Card } from '../Card';

import styles from './board.module.scss'

interface Cards {
  id: string;
  taskName: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Done'
}

interface BoardProps {
  title: string;
  cards: Cards[];
  customStyle: React.CSSProperties;
  innerRef: React.LegacyRef<HTMLDivElement>
  onChangeTaskName: (e: ChangeEvent<HTMLInputElement>, cardId: string) => void
  onChangeDescription: (e: ChangeEvent<HTMLTextAreaElement>, cardId: string) => void
  handleAddCard: () => void;
  handleRemoveCard: (cardId: string) => void
}

export const Board = ({ 
  title,
  cards,
  customStyle,
  innerRef,
  onChangeTaskName,
  onChangeDescription,
  handleAddCard,
  handleRemoveCard,
  ...droppableProps
}: BoardProps) => {
  return (
    <div
      ref={innerRef}
      className={styles.board}
      style={customStyle}
      {...droppableProps}
    >
      <div className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {title === 'Todo' && (
          <Button title='ADICIONAR' onClick={handleAddCard} />
        )}
      </div>
      {cards.map((card, index) => (
        <Draggable key={card.id} draggableId={card.id} index={index}>
          {(provided, snapshot) => (
            <Card
              innerRef={provided.innerRef}
              customStyle={{
                userSelect: 'none',
                ...provided.draggableProps.style
              }}
              card={card}
              handleRemoveCard={() => handleRemoveCard(card.id)}
              onChangeTaskName={(e) => onChangeTaskName(e, card.id)}
              onChangeDescription={(e) =>  onChangeDescription(e, card.id)} 
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            />
          )}
        </Draggable>
      ))}
    </div>
  )
}


/* 
    TODO: PENDÊNCIAS

  // todo:  Drag dos Cards entre os boards
  // todo:  Add e Remover Cards no Board Todo 
  // todo:  Editar o conteúdo da Task dos Cards em todos os Boards
  // todo:  Editar o título da Task dos Cards

*/