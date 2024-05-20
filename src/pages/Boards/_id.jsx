import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
// import { mockData } from "~/apis/mock-data";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI,
} from "~/apis";

import { generatePlaceholderCard } from "~/utils/formatter";
import { isEmpty } from "lodash";
import { mapOrder } from "~/utils/sorts";

function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const boardId = "664323921f09c40af7fafe4b";
    fetchBoardDetailsAPI(boardId).then((board) => {
      board.columns = mapOrder(board?.columns, board?.columnOrderIds, "_id");
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)];
          column.cardOrderIds = [generatePlaceholderCard(column)._id];
        } else {
          column.cards = mapOrder(column?.cards, column?.cardOrderIds, "_id");
        }
      });
      setBoard(board);
    });
  }, []);
  // gọi api tạo mới column và làm lại dữ liệu state board
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });
    createdColumn.cards = [generatePlaceholderCard(createdColumn)];
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id];
    // cập nhật lại state board
    const newBoard = { ...board };
    newBoard.columns.push(createdColumn);
    newBoard.columnOrderIds.push(createdColumn._id);
    setBoard(newBoard);
  };

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });

    // cập nhật lại state board
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === createdCard.columnId
    );
    if (columnToUpdate) {
      if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard];
        columnToUpdate.cardOrderIds = [createdCard._id];
      } else {
        columnToUpdate.cards.push(createdCard);
        columnToUpdate.cardOrderIds.push(createdCard._id);
      }
    }
    setBoard(newBoard);
  };

  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);

    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: newBoard.columnOrderIds,
    });
  };

  // khi di chuyển card trong cùng column
  // chỉ cần gọi Api để cập nhật mảng CardOrderIds của column chứa nó ( thay đổi vị trí trong mảng)
  const moveCardIntheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    const newBoard = { ...board };
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    );
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards;
      columnToUpdate.cardOrderIds = dndOrderedCardIds;
    }
    setBoard(newBoard);

    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderedCardIds,
    });
  };

  const moveCardToDifferentColumn = (
    currentCardId,
    prevcolumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnsIds;
    setBoard(newBoard);

    let prevCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === prevcolumnId
    )?.cardOrderIds;
    // xử lý vấn đề khi kéo card cuối cùng ra khỏi column, column rỗng sẽ có placeholder card , cần xóa nó đi trước khi gủi dữ liệu lên cho phía BE
    if (prevCardOrderIds[0].includes("placeholder-card")) prevCardOrderIds = [];
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevcolumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        ?.cardOrderIds,
    });
  };

  const deleteColumnDetails = (columnId) => {
    const newBoard = { ...board };
    newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId);
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
      (_id) => _id !== columnId
    );
    setBoard(newBoard);

    deleteColumnDetailsAPI(columnId).then((res) => {
      toast.success(res.deleteResult);
    });
  };

  if (!board) {
    return <Box>loading...</Box>;
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardIntheSameColumn={moveCardIntheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  );
}

export default Board;
