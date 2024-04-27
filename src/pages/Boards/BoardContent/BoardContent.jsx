import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "~/utils/sorts";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

export default function BoardContent({ board }) {
  const [orderedColumns, setOrderedColumns] = useState([]);
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);
  const handleDragEnd = (event) => {
    console.log("handleDragEnd", event);
    const { active, over } = event;
    // kiểm tra nếu không tồn tại over (kéo linh tinh râ ngoài  thì return  luôn tránh lỗi)

    // nếu vị trí sau khi kéo thả khác với vị trí ban đầu
    if (!over) return;
    if (active.id !== over.id) {
      // lấy vị trí cũ (từ thằng active)
      const oldIndex = orderedColumns.findIndex((c) => c._id === active.id);
      // lấy vị trí cũ (từ thằng over)
      const newIndex = orderedColumns.findIndex((c) => c._id === over.id);
      // dùng arrayMove của thằng dnd-kit để sắp xếp  lại mảng Columns ban đầu
      // Code của arrayMove ở đây: dndKit/packages/sortable/src/utilities/arrayMove.ts

      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c=> c.id)
      // 2 mảng trên sau này dùng để xử lý gọi api

      // cập nhật lại state columns ban đầu sau khi đã kéo thả
      setOrderedColumns(dndOrderedColumns);
      console.log(dndOrderedColumns);
    }
  };
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          width: "100%",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  );
}
