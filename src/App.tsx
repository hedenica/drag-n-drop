import { ChangeEvent, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';

import { Board } from './components/Board';

import styles from './app.module.scss'

interface Cards {
  id: string;
  taskName: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'Done'
}

interface Boards {
  id: string;
  title: string;
  items: Cards[]
}

const initalBoards = [
  { id: 'board1', title: 'Todo', items: [] },
  { id: 'board2', title: 'In Progress', items: [] },
  { id: 'board3', title: 'Done', items: [] }
]

const onDragEnd = (result: DropResult, boards: Boards[], setBoards: React.Dispatch<React.SetStateAction<Boards[]>> ) => {
  if (!result.destination) return;
  const { source, destination } = result;

  if (source.droppableId !== destination.droppableId) {
    const sourceBoard = boards.find((column) => column.id === source.droppableId);
    const destinationBoard = boards.find((column) => column.id === destination.droppableId);
    const sourceItems = Array.from(sourceBoard?.items ??[])
    const destinationItems = Array.from(destinationBoard?.items ??[])
    const removedItem = sourceItems.splice(source.index, 1);
    destinationItems.splice(destination.index, 0, removedItem[0])

    setBoards(oldBoards => oldBoards.map(column => {
      if (column.id === destination.droppableId) {
        return {
          ...column,
          items: destinationItems.map(item => {
            if (item.id === removedItem[0].id) {
              return {
                ...item,
                status: destinationBoard?.title ?? 'Todo'
              }
            }

            return item
          }),
        }
      } else if (column.id === source.droppableId) {
        return {
          ...column,
          items: sourceItems
        }
      } 
      
      return column
    }) as Boards[]);
    
  } else {
    const board = boards.find((column) => column.id === source.droppableId)
    const copiedItems = Array.from(board?.items ?? [])
    const removedItem = copiedItems.splice(source.index, 1)
    copiedItems.splice(destination.index, 0, removedItem[0])
    setBoards(oldBoards => oldBoards.map(column => {
      if (column.id !== source.droppableId) {
        return column
      } 
        
      return { ...column, items: copiedItems }
    }))
  }
};

function App() {
  const [boards, setBoards] = useState<Boards[]>(initalBoards)

  const onChangeTaskName = (e: ChangeEvent<HTMLInputElement>, cardId: string) => {
    setBoards(oldBoards => oldBoards.map(board => ({
      ...board,
      items: board.items.map(item => item.id === cardId 
        ? { ...item, taskName: e.target.value }
        : item
      )
    })))
  }

  const onChangeDescription = (e: ChangeEvent<HTMLTextAreaElement>, cardId: string) => {
    setBoards(oldBoards => oldBoards.map(board => ({
      ...board,
      items: board.items.map(item => item.id === cardId 
        ? { ...item, description: e.target.value }
        : item
      )
    })))
  }

  const handleAddCard = (boardId: string) => {
    const cardId = uuidv4();
    setBoards((oldBoards) => oldBoards.map(board => {
      if (boardId !== board.id) {
        return board
      } 
      
      const newBoard: Boards = {
        ...board,
        items: board.items.concat({
          id: cardId,
          taskName: '',
          description: '',
          status: 'Todo',
        })
      }
  
      return newBoard
    }))
  }

  const handleRemoveCard = (cardId: string) => {
    const updatedCards = boards.map(board => ({
      ...board,
      items: board.items.filter(item => item.id !== cardId)
    }))

    setBoards(updatedCards)
  }

  console.log(boards)

  return (
    <div className={styles.container}>
      <DragDropContext 
        onDragEnd={result => onDragEnd(result, boards, setBoards)}>
        {boards.map(board => (
          <Droppable droppableId={board.id} key={board.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
              >
                <Board
                  innerRef={provided.innerRef}
                  customStyle={{
                    backgroundColor: snapshot.isDraggingOver 
                    ? '#b101a8a2' : '#420242'
                  }}
                  title={board.title}
                  cards={board.items}
                  onChangeTaskName={onChangeTaskName}
                  onChangeDescription={onChangeDescription}
                  handleAddCard={() => handleAddCard(board.id)}
                  handleRemoveCard={handleRemoveCard}
                  {...provided.droppableProps}
                />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </div>
  )
}

export default App
