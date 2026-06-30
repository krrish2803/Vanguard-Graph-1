import { Router, Request, Response } from 'express';
import { AlertsService } from './alerts.service';
import { AlertsRepository } from './alerts.repository';
import { createAlertSchema, updateStatusSchema } from './alerts.schemas';
import { AlertStatus, AlertSeverity } from './alerts.types';

const router = Router();
const service = new AlertsService(new AlertsRepository());

router.post('/', async (req: Request, res: Response) => {
  const parsed = createAlertSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  try {
    const alert = await service.create(parsed.data);
    res.status(201).json(alert);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'failed' });
  }
});

// GET /alerts?status=OPEN&severity=HIGH
router.get('/', async (req: Request, res: Response) => {
  try {
    const alerts = await service.getAll({
      status: req.query.status as AlertStatus | undefined,
      severity: req.query.severity as AlertSeverity | undefined,
    });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'failed' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    res.json(await service.getById(String(req.params.id)));
  } catch (err) {
    res.status(404).json({ error: err instanceof Error ? err.message : 'not found' });
  }
});

// PATCH /alerts/:id/status — analyst review action
router.patch('/:id/status', async (req: Request, res: Response) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  try {
    const alert = await service.updateStatus(
      String(req.params.id),
      parsed.data.status,
      parsed.data.assignedTo,
      parsed.data.resolution,
    );
    res.json(alert);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : 'failed' });
  }
});

export default router;