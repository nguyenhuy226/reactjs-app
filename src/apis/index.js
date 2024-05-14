import axios from "axios";
import { API_ROOT } from "~/utils/constants";
export const fetchBoardDetailsAPI = async (boardId) => {
  const respone = await axios.get(`${API_ROOT}/v1/board/${boardId}`);
  return respone.data;
};
