import { Toaster } from 'react-hot-toast';

import { Tooltip } from 'react-tooltip';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// styles
import '../styles/creator.css';

// hooks
import useCreatorPage from './useCreatorPage';

// components
import Row from '../components/Row';
import Seat from '../components/Seat';
import Stage from '../components/Stage';
import Header from '../components/Header';
import NewRow from '../components/NewRow';
import NewSeat from '../components/NewSeat';
import Preview from '../components/Preview';
import Buttons from '../components/Buttons';

const CreatorPage = (): JSX.Element => {
  const {
    rows,
    loading,
    preview,
    seatMap,
    seatData,
    addSeat,
    deleteSeat,
    editSeatName,
    addEmptyRow,
    addSeatedRow,
    deleteRow,
    editRowName,
    editMapName,
    editStageName,
    saveData,
    resetData,
    togglePreview,
    getTotalSeats,
    handleOnDragEnd,
  } = useCreatorPage();

  if (loading) {
    return <div className='container'>Loading... Please wait.</div>;
  }

  if (preview) {
    return <Preview seatData={seatData} text={seatMap?.stageText} togglePreview={togglePreview} />;
  }

  return (
    <div className='container'>
      <Header seatMap={seatMap} editMapName={editMapName} />

      <Stage text={seatMap?.stageText} editStageName={editStageName} />

      <div className='seatmap' onContextMenu={(e) => e.preventDefault()}>
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId='rows' direction='vertical'>
            {(droppableProvided) => (
              <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                {rows?.map(([row, seatsInRow], index) => (
                  <Draggable key={row} index={index} draggableId={row}>
                    {(draggableProvided) => (
                      <div ref={draggableProvided.innerRef} {...draggableProvided.draggableProps}>
                        <Row
                          row={row}
                          rowIndex={index}
                          deleteRow={deleteRow}
                          editRowName={editRowName}
                          empty={row.startsWith('empty-')}
                          dragHandleProps={draggableProvided.dragHandleProps}
                        >
                          {seatsInRow.map((seat) => (
                            <Seat
                              seat={seat}
                              key={seat.id}
                              rowIndex={index}
                              addSpace={addSeat}
                              deleteSeat={deleteSeat}
                              editSeatName={editSeatName}
                            />
                          ))}
                          <NewSeat
                            rowIndex={index}
                            addSeat={addSeat}
                            seat={seatsInRow[seatsInRow.length - 1]}
                          />
                        </Row>
                      </div>
                    )}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <Tooltip id='description' />

      <NewRow addEmptyRow={addEmptyRow} addSeatedRow={addSeatedRow} />

      <Buttons totals={getTotalSeats} save={saveData} reset={resetData} toggle={togglePreview} />

      <Toaster
        position='bottom-center'
        toastOptions={{
          style: {
            color: '#ffffff',
            background: '#333333',
          },
        }}
      />
    </div>
  );
};

export default CreatorPage;
