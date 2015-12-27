import _ from 'lodash'
import u from 'updeep'

import { createReducer } from '../utils'

const prefix = 'slides/'
const QUESTION_MODULE_LOAD = prefix + 'QUESTION_MODULE_LOAD'
const VALIDATE_ANSWER = prefix + 'VALIDATE_ANSWER'

const questionModuleLoadReducer = (state, { moduleRef, slides, graph }) => {
  const updater = {
    [moduleRef]: {
      slides,
      graph,
      remainingLives: 3,
      currentSlideRef: graph.startPoints[0]
    }
  }
  return u(updater, state)
}

const matchesAnswers = (answers, answer) => {
  if (answers === 'default') return true

  // Does answers contain answer?
  const containsAnswer = answers.reduce((res, possibleAnswer) => {
    return res || _.isEqual(possibleAnswer, answer)
  }, false)
  return containsAnswer
}

const findNoLivesEndSlide = (state, moduleRef) => {
  const { endPoints } = state[moduleRef].graph
  const endPoint = _.chain(endPoints)
    .mapValues(({ when }, ref) => ({ ref, when }))
    .reduce((res, { ref, when }) => {
      return res || (when && when.lives === 0 && ref)
    }, false)
    .value()
  return endPoint
}

const validateAnswerReducer = (state, { moduleRef, answer }) => {
  const { graph, currentSlideRef } = state[moduleRef]

  const vertice = graph.vertices[currentSlideRef]
    .reduce((res, vert) => {
      const { answers } = vert
      return res || (matchesAnswers(answers, answer) && vert)
    }, null)

  const { destination, actions = {} } = vertice
  const { lives } = actions
  let nextState = u({
    [moduleRef]: {
      currentSlideRef: destination,
      remainingLives: (l) => Math.max(0, l + (lives || 0))
    }
  }, state)

  if (nextState[moduleRef].remainingLives > 0) {
    return nextState
  }

  // User has no more lives, send him to an end slide
  return u({
    [moduleRef]: {
      currentSlideRef: findNoLivesEndSlide(state, moduleRef)
    }
  }, nextState)
}

const initialState = {}
export default createReducer(initialState, {
  [QUESTION_MODULE_LOAD]: questionModuleLoadReducer,
  [VALIDATE_ANSWER]: validateAnswerReducer
})

export const validateAnswer = (moduleRef, answer) => {
  return {
    moduleRef,
    answer,
    type: VALIDATE_ANSWER
  }
}

export const questionModuleLoad = (moduleRef, slides, graph) => {
  return {
    moduleRef,
    slides,
    graph,
    type: QUESTION_MODULE_LOAD
  }
}
