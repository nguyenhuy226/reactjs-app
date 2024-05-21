import axios from "axios";
import { API_ROOT } from "~/utils/constants";
console.log(API_ROOT);
export const fetchBoardDetailsAPI = async (boardId) => {
  const respone = await axios.get(`${API_ROOT}/v1/board/${boardId}`);
  return respone.data;
};

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const respone = await axios.put(
    `${API_ROOT}/v1/board/${boardId}`,
    updateData
  );
  return respone.data;
};

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const respone = await axios.put(
    `${API_ROOT}/v1/board/supports/moving_cards`,
    updateData
  );
  return respone.data;
};

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const respone = await axios.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  );
  return respone.data;
};
export const deleteColumnDetailsAPI = async (columnId) => {
  const respone = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`);
  return respone.data;
};

export const createNewColumnAPI = async (newColumnData) => {
  const respone = await axios.post(`${API_ROOT}/v1/columns/`, newColumnData);
  return respone.data;
};

export const createNewCardAPI = async (newCardData) => {
  const respone = await axios.post(`${API_ROOT}/v1/cards/`, newCardData);
  return respone.data;
};
