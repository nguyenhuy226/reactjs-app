import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { mapOrder } from "~/utils/sorts";
import ListColumns from "./ListColumns/ListColumns";

import Card from "./ListColumns/Column/ListCards/Card/Card";
import Column from "./ListColumns/Column/Column";
import styled from "@emotion/styled";

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: "ACTIVE_DRAG_ITEM_TYPE_COLUMN",
  CARD: "ACTIVE_DRAG_ITEM_TYPE_CARD",
};

export default function BoardContent({ board }) {
  // nếu dúng pinterSensor  mặc định thì phải kết hợp thuộc tích css touch-action: none ở những phần tử nào kéo thả - nhưng mà còn bug
  // const pointerSensor = useSensor(PointerSensor, {
  //   activationConstraint: { distance: 10 },
  // });
  // yêu cầu chuột di chuyển 10px thì mới kích hoạt event fix trường hợp click bị gọi event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  // nhấn giữ 250ms và dung sai cảm ứng 500px thì mới kích hoạt evenr
  const tounchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 },
  });
  // const mySensors = useSensors(pointerSensor);
  // Ưu tiên sử dụng kết hợp 2 loại sensors là mouse và touch để có trải nghiệm  trên mobile tốt nhất, không bị bug
  const mySensors = useSensors(mouseSensor, tounchSensor);

  const [orderedColumns, setOrderedColumns] = useState([]);
  //cùng một thời điểm chỉ có một phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null);
  const [activeDragItemType, setActiveDragItemType] = useState(null);
  const [activeDragItemData, setActiveDragItemData] = useState(null);

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);
  // tìm một column theo một idcard
  const findColumnByCardId = (cardId) => {
    // đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOderIds bời bì ỏ bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới
    return orderedColumns.find((column) =>
      column?.cards?.map((card) => card._id).includes(cardId)
    );
  };

  // trigger khi bắt đầu kéo 1 phần tử
  const handleDragStart = (event) => {
    console.log(event);
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);
  };
  // trigger khi kéo 1 phần tử
  const handleDragOver = (event) => {
    // không làm gì thêm khi kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return;
    }
    const { active, over } = event;
    // kiểm tra nếu không tồn tại active hoặc over (kéo linh tinh râ ngoài  thì return  luôn tránh lỗi)
    if (!over || !active) return;
    // activecard là card đang kéo
    const {
      id: activeDraggingCardId,
      data: { current: activeDraggingCardData },
    } = active;
    // overcarrd là card đang trong lúc tương tác trên hoặc dưới so với cái card  được kéo ở trên
    const { id: overCardId } = over;

    // tìm 2 cái column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId);
    const overColumn = findColumnByCardId(overCardId);

    if (!activeColumn || !overColumn) return;
  };
  // trigger khi kêt thức hành động kéo 1 phần tử
  const handleDragEnd = (event) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      return;
    }
    const { active, over } = event;
    // kiểm tra nếu không tồn tại over (kéo linh tinh râ ngoài  thì return  luôn tránh lỗi)
    if (!over || !active) return;

    // nếu vị trí sau khi kéo thả khác với vị trí ban đầu
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
    }
    setActiveDragItemData(null);
    setActiveDragItemId(null);
    setActiveDragItemType(null);
  };

  // Animation khi thả (Drog) phàn tử = test bằng cách kéo xong thả trực tiếp và nhìn phần giữ chỗ Overlay
  const drogAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={mySensors}
    >
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
        <DragOverlay dropAnimation={drogAnimation}>
          {!activeDragItemType && null}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && (
            <Column column={activeDragItemData} />
          )}
          {activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD && (
            <Card card={activeDragItemData} />
          )}
        </DragOverlay>
      </Box>
    </DndContext>
  );
}
