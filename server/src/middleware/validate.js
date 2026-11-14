export function validateCheckin(req, res, next) {
  const { mood, stress, fatigue, sleepHours } = req.body || {};
  const errors = [];

  for (const [name, value] of Object.entries({ mood, stress, fatigue })) {
    if (typeof value !== 'number' || value < 1 || value > 10) {
      errors.push(`${name} must be a number from 1 to 10`);
    }
  }
  if (typeof sleepHours !== 'number' || sleepHours < 0 || sleepHours > 24) {
    errors.push('sleepHours must be a number from 0 to 24');
  }

  if (errors.length) return res.status(400).json({ error: 'Invalid input', details: errors });
  next();
}

export function validateReaction(req, res, next) {
  const { reactionTimeMs } = req.body || {};
  if (typeof reactionTimeMs !== 'number' || reactionTimeMs < 50 || reactionTimeMs > 5000) {
    return res.status(400).json({
      error: 'Invalid input',
      details: ['reactionTimeMs must be a number from 50 to 5000'],
    });
  }
  next();
}

export function validateBlackoutEvent(req, res, next) {
  const { type } = req.body || {};
  if (typeof type !== 'string' || type.trim() === '') {
    return res.status(400).json({
      error: 'Invalid input',
      details: ['type is required (for example: "symptom_logged")'],
    });
  }
  next();
}