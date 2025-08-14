import { get } from '../../../services/api/Axios/MethodsGeneral';
import { mockData } from '../../../mock/mockData';

export const fetchStatisticData = async (start, end) => {
  try {
    const response = await get(
      `report/statistics?start=${start.format('YYYY-MM-DD')}&end=${end.format('YYYY-MM-DD')}`,
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return mockData;
  }
};
