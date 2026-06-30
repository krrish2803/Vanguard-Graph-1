import { Router, Request, Response } from 'express';
import { MerchantsService } from './merchants.service';
import { MerchantsRepository } from './merchants.repository';
import { createMerchantSchema } from './merchants.schemas';

const router = Router();
const service = new MerchantsService(new MerchantsRepository());

router.post('/', async (req: Request, res: Response) => {
  const parsed = createMerchantSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }
  try {
    const merchant = await service.create(parsed.data);
    res.status(201).json(merchant);
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'failed' });
  }
});

router.get('/', async (_req: Request, res: Response) => {
  try {
    res.json(await service.getAll());
  } catch (err) {
    res.status(500).json({ error: err instanceof Error ? err.message : 'failed' });
  }
});

// NOTE: ye route '/:merchantId' se PEHLE hona chahiye, warna 'risk-profile'
// ko merchantId samajh lega Express
router.get('/:merchantId/risk-profile', async (req: Request, res: Response) => {
  try {
   res.json(await service.getRiskProfile(String(req.params.merchantId)));
  } catch (err) {
    res.status(404).json({ error: err instanceof Error ? err.message : 'not found' });
  }
});

router.get('/:merchantId', async (req: Request, res: Response) => {
  try {
    res.json(await service.getRiskProfile(String(req.params.merchantId)));
  } catch (err) {
    res.status(404).json({ error: err instanceof Error ? err.message : 'not found' });
  }
});

export default router;