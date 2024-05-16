import Container from "@mui/material/Container";
import { useEffect, useState } from "react";
import { mockData } from "~/apis/mock-data";
import AppBar from "~/components/AppBar/AppBar";
import BoardBar from "./BoardBar/BoardBar";
import BoardContent from "./BoardContent/BoardContent";
import { fetchBoardDetailsAPI } from "~/apis";
function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const boardId = "664323921f09c40af7fafe4b";
    fetchBoardDetailsAPI(boardId).then((board) => {
      setBoard(board);
    });
  }, []);
  return (
    <Container disableGutters maxWidth={false} sx={{ height: "100vh" }}>
      <AppBar />
      <BoardBar board={mockData.board} />
      <BoardContent board={mockData.board} />
    </Container>
  );
}

export default Board;
