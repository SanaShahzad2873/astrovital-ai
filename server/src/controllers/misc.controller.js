import { getOverview, getAlerts, getDatasets } from '../services/mockData.service.js';

const reactionTests = [];
const blackoutEvents = [];

export function createReactionTest(req, res) {
  const record = {
    id: `rt-${Date.now()}`,
    reactionTimeMs: req.body.reactionTimeMs,
    source: 'MEASURED',
    timestamp: new Date().toISOString(),
  };
  reactionTests.push(record);
  res.status(201).json(record);
}

export function createBlackoutEvent(req, res) {
  const record = {
    id: `evt-${Date.now()}`,
    type: req.body.type.trim(),
    note: req.body.note || '',
    source: 'SELF_REPORTED',
    synced: false,
    timestamp: new Date().toISOString(),
  };
  blackoutEvents.push(record);
  res.status(201).json(record);
}

export function getMissionReport(req, res) {
  res.json({
    generatedAt: new Date().toISOString(),
    overview: getOverview(),
    alerts: getAlerts(),
    reactionTestsCount: reactionTests.length,
    blackoutEventsCount: blackoutEvents.length,
    datasets: getDatasets(),
    disclaimer: 'Decision-support prototype. Not a medical diagnostic system.',
  });
}