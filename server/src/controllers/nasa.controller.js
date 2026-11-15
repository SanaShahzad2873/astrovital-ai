import { getDatasets } from '../services/mockData.service.js';

export const datasets = (req, res) => res.json(getDatasets());