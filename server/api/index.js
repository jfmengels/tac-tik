import { Router } from 'express'

import slides from './slides'
import graphs from './graphs'

const router = Router()

router.use('/slides', slides)
router.use('/graphs', graphs)

export default router
