import _ from 'lodash'
import { Router } from 'express'

import data from '../../../data/graph.json'

const router = Router()

router.get('/', (req, res) => {
  res.send(data)
})

router.get('/list', (req, res) => {
  const graphRefs = _.map(data, ({ ref, name }) => ({ ref, name }))
  res.send(graphRefs)
})

router.get('/:ref', (req, res) => {
  const { ref } = req.params
  const graph = _.find(data, (g) => g.ref === ref)
  res.send(graph)
})

export default router
