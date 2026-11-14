const checkins = []; // temporary in-memory storage (resets on restart)

export function createCheckin(req, res) {
  const record = {
    id: `chk-${Date.now()}`,
    ...req.body,
    source: 'SELF_REPORTED',
    timestamp: new Date().toISOString(),
  };
  checkins.push(record);
  res.status(201).json(record);
}

export const listCheckins = (req, res) => res.json(checkins);