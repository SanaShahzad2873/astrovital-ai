import * as data from '../services/mockData.service.js';

export const overview = (req, res) => res.json(data.getOverview());
export const cardiovascular = (req, res) => res.json(data.getCardiovascular());
export const sleep = (req, res) => res.json(data.getSleep());
export const radiation = (req, res) => res.json(data.getRadiation());
export const fitness = (req, res) => res.json(data.getFitness());
export const alerts = (req, res) => res.json(data.getAlerts());
export const twinState = (req, res) => res.json(data.getTwinState());