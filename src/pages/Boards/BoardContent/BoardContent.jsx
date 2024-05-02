import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  closestCenter,
  pointerWithin,
  rectIntersection,
  getFirstCollision,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import Box from "@mui/material/Box";
import { useCallback, useEffect, useRef, useState } from "react";
import { mapOrder } from "~/utils/sorts";
import ListColumns from "./ListColumns/ListColumns";
import { generatePlaceholderCard } from "~/utils/formatter";
import Card from "./ListColumns/Column/ListCards/Card/Card";
import Column from "./ListColumns/Column/Column";
import { cloneDeep, isEmpty } from "lodash";

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
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] =
    useState(null);
  // điểm va chạm cuối cùng xử lý thuật toán phát hiện va chạm
  const lastOverId = useRef(null);

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

  const moveCartBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns((prevColumns) => {
      // Tìm vị trí (index) của overCard  trong column đích (nơi card sắp được thả )
      const overCardIndex = overColumn?.cards?.findIndex(
        (card) => card._id === overCardId
      );

      // logic tính toán Cardindex mới (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện
      let newCardIndex;
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height;
      const modifier = isBelowOverItem ? 1 : 0;
      newCardIndex =
        overCardIndex >= 0
          ? overCardIndex + modifier
          : overColumn?.cards?.length + 1;
      // clone mảng OrderedColumnsState cũ ra một cái mới để xửu lý data rồi return - cập nhật lại OrderedColumnsState
      const nextColumns = cloneDeep(prevColumns);
      const nextActiveColumn = nextColumns.find(
        (column) => column._id === activeColumn._id
      );
      const nextOverColumn = nextColumns.find(
        (column) => column._id === overColumn._id
      );
      if (nextActiveColumn) {
        // xóa card ở cái column  active ( cũng có thể hiểu là column cũ, cái lúc mà kéo card ra khỏi nó để sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );
        // thêm placeholder card nếu column rỗng : bị kéo hết card đi  không còn cái nào nữa
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
        }

        // cập nhật lại mảng cardOrderIds cho chuẩn dũ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(
          (card) => card._id
        );
      }
      if (nextOverColumn) {
        // kiểm tra xem card đang kéo  nó có tồn tại ở overColumn chư, nếu có tồn tại thì xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => card._id !== activeDraggingCardId
        );
        // đối với trường hợp dragEnd  thì phải cập nhật lại chuẩn dữ liệu column trong card sau khi kéo card giữa 2 column khác nhau
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id,
        };

        // thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(
          newCardIndex,
          0,
          rebuild_activeDraggingCardData
        );
        // xóa cái placeholder đi nếu nó đang tồn tại
        nextOverColumn.cards = nextOverColumn.cards.filter(
          (card) => !card.FE_placeholderCard
        );

        // cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(
          (card) => card._id
        );
      }
      return nextColumns;
    });
  };
  // trigger khi bắt đầu kéo 1 phần tử
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYPE.CARD
        : ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragItemData(event?.active?.data?.current);
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
    }
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

    // xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card ở chung 1 column thì không thực hiện
    // vì đây đang là đoạn xử lý lúc kéo ( handleDragOver), còn xử lý kéo xong xuôi thì nó lại là vấn đề khác ở handleDragEnd
    if (activeColumn._id !== overColumn._id) {
      moveCartBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      );
    }
  };
  // trigger khi kêt thức hành động kéo 1 phần tử
  const handleDragEnd = (event) => {
    const { active, over } = event;
    // kiểm tra nếu không tồn tại over (kéo linh tinh râ ngoài  thì return  luôn tránh lỗi)
    if (!over || !active) return;

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
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
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCartBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        );
      } else {
        // kéo thả card ở cùng một column
        // lấy vị trí cũ (từ thằng oldColumnWhenDraggingCard)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(
          (c) => c._id === activeDragItemId
        );
        // lấy vị trí cũ (từ thằng over)
        const newCardIndex = overColumn?.cards?.findIndex(
          (c) => c._id === overCardId
        );

        // dùng arrayMove vì kéo card trong một cái column thì tương tự như kéo column trong một cái board content
        const dndOrderedCards = arrayMove(
          oldColumnWhenDraggingCard?.cards,
          oldCardIndex,
          newCardIndex
        );
        setOrderedColumns((prevColumns) => {
          // clone mảng OrderedColumnsState cũ ra một cái mới để xửu lý data rồi return - cập nhật lại OrderedColumnsState
          const nextColumns = cloneDeep(prevColumns);

          // tìm tới column đang thả
          const targetColumn = nextColumns.find(
            (column) => column._id === overColumn._id
          );

          // cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards;
          targetColumn.cardOrderIds = dndOrderedCards.map((card) => card._id);
          return nextColumns;
        });
      }
    }
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // nếu vị trí sau khi kéo thả khác với vị trí ban đầu
      if (active.id !== over.id) {
        // lấy vị trí cũ (từ thằng active)
        const oldColumnIndex = orderedColumns.findIndex(
          (c) => c._id === active.id
        );
        // lấy vị trí cũ (từ thằng over)
        const newColumnIndex = orderedColumns.findIndex(
          (c) => c._id === over.id
        );
        // dùng arrayMove của thằng dnd-kit để sắp xếp  lại mảng Columns ban đầu
        // Code của arrayMove ở đây: dndKit/packages/sortable/src/utilities/arrayMove.ts

        const dndOrderedColumns = arrayMove(
          orderedColumns,
          oldColumnIndex,
          newColumnIndex
        );
        // const dndOrderedColumnsIds = dndOrderedColumns.map(c=> c.id)
        // 2 mảng trên sau này dùng để xử lý gọi api

        // cập nhật lại state columns ban đầu sau khi đã kéo thả
        setOrderedColumns(dndOrderedColumns);
      }
    }
    // những dữ liệu sau khi kéo thả phải đưa về null mặc định ban đ
    setActiveDragItemData(null);
    setActiveDragItemId(null);
    setActiveDragItemType(null);
    setOldColumnWhenDraggingCard(null);
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
  const collisionDetectionStrategy = useCallback(
    (args) => {
      if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
        return closestCorners({ ...args });
      }
      // tìm các điểm giao nhau , va chạm - intersection với con trỏ
      const pointerIntersections = pointerWithin(args);

      // nếu pointerIntersections là một mảng rỗng return luôn không làm gì hết
      if (!pointerIntersections?.length) return;
      // thuật toán va chạm sẽ trả về một mảng các va chạm ở đây
      // const intersection = !!pointerIntersections?.length
      //   ? pointerIntersections
      //   : rectIntersection(args);

      // tìm overId  đầu tiên trong đám pointerIntersections ở trên
      let overId = getFirstCollision(pointerIntersections, "id");

      // nếu cái over nó là một cái column thì sẽ tìm tới cái Cardid gần nhất bên trong khu vực va chạm đó dựa vào thuật toán phát hiện va chạm closestCenter hoặc closestCorners đều được. Tuy nhiên ở dây dùng closestCorners mượt hơn
      const checkColumn = orderedColumns.find(
        (column) => column._id === overId
      );
      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter((container) => {
            return (
              container.id !== overId &&
              checkColumn?.cardOrderIds?.includes(container.id)
            );
          }),
        })[0]?.id;
      }
      if (overId) {
        lastOverId.current = overId;
        return [{ id: overId }];
      }

      // nếu overId là null thì trả về mảng rỗng  - tránh bug crash trang
      return lastOverId.current ? [{ id: lastOverId.current }] : [];
    },
    [activeDragItemType]
  );
  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      // cảm biến
      sensors={mySensors}
      // Thuật toán phát hiện va chạm ( nếu không có nó thì card với cover lớn sẽ không kéo qua column được vì lúc này đang bị conflict giữa card và column )
      //chúng ta sẽ dùng closesCorner thay vì closesCenter
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
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
