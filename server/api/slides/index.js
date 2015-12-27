import _ from 'lodash'
import { Router } from 'express'

import data from '../../../data/slides.json'

const router = Router()

router.get('/', (req, res) => {
  res.send(data)
})

router.get('/:ref', (req, res) => {
  const { ref } = req.params
  const slides = _.filter(data, (slide) => slide.chapter_ref === ref)
  res.send(slides)
})

export default router
