/* eslint-disable no-unused-expressions */
import _ from 'lodash'
import u from 'updeep'
import { expect } from 'chai'

import reducer, { validateAnswer, questionModuleLoad } from './'

import slides from './slides.test.fixture.json'
import graph from './graph.test.fixture.json'

const applyAnswer = (state, { moduleRef, answer, destination }) => {
  const nextState = reducer(state, validateAnswer(moduleRef, answer))
  const { currentSlideRef } = nextState[moduleRef]
  expect(currentSlideRef).to.equal(destination)
}

const changeCurrentSlide = (state, moduleRef, currentSlideRef) => {
  return u({
    [moduleRef]: { currentSlideRef }
  }, state)
}

const listScenarii = (moduleRef, { answers, destination }) => {
  const givenAnswers = answers === 'default'
    ? ['some random answer which is not a valid answer 12345', 'test']
    : answers

  return givenAnswers.map((answer) => ({
    moduleRef,
    answer,
    destination
  }))
}

describe('slides - validating answer', () => {
  let moduleRef = graph.ref
  const startState = reducer(
    reducer(undefined, questionModuleLoad(moduleRef, slides, graph)),
    { type: '@@INIT' }
  )

  beforeEach(() => {
    moduleRef = graph.ref
  })

  it('should set currentSlideRef to be the next slide following the graph\'s vertices', () => {
    const { currentSlideRef } = startState[moduleRef]
    expect(currentSlideRef).to.exist
    const potentialPaths = graph.vertices[currentSlideRef]
    expect(potentialPaths).to.exist

    // List all available answers and the corresponding destination in graph
    _(potentialPaths)
      .map((path) => listScenarii(moduleRef, path))
      .flatten()
      .each((scenario) => applyAnswer(startState, scenario)) // try it out and make assertion
      .value()
  })

  it('should only take the default path if no other path matches')
  it('should do ? when no route is found')

  it('should remove lives when giving an answer that has that action', () => {
    const nextState = reducer(startState, validateAnswer(moduleRef, ['wrong answer']))
    expect(nextState[moduleRef].currentSlideRef).to.equal('9.A.3')
    expect(nextState[moduleRef].remainingLives).to.equal(2)
  })

  it('should not remove lives when giving an answer that does not have that action', () => {
    const nextState = reducer(startState, validateAnswer(moduleRef, ['9.A.1.0']))
    expect(nextState[moduleRef].currentSlideRef).to.equal('9.A.2')
    expect(nextState[moduleRef].remainingLives).to.equal(3)
  })

  it('should not make lives go under 0', () => {
    const state = u({
      [moduleRef]: { remainingLives: 0 }
    }, startState)
    const nextState = reducer(state, validateAnswer(moduleRef, ['9.A.2.3']))
    expect(nextState[moduleRef].remainingLives).to.equal(0)
  })

  it('should be able to remove more than one life, or grant some', () => {
    let nextState, state

    state = changeCurrentSlide(startState, moduleRef, '9.A.2')
    nextState = reducer(state, validateAnswer(moduleRef, ['9.A.2.3']))
    expect(nextState[moduleRef].currentSlideRef).to.equal('9.A.5')
    expect(nextState[moduleRef].remainingLives).to.equal(1)

    state = changeCurrentSlide(startState, moduleRef, '9.A.3')
    nextState = reducer(state, validateAnswer(moduleRef, ['wrong answer']))
    expect(nextState[moduleRef].currentSlideRef).to.equal('9.A.5')
    expect(nextState[moduleRef].remainingLives).to.equal(1003)
  })

  it('should send to an end slide when giving answer that lowers lives to 0', () => {
    const state = u({
      [moduleRef]: { remainingLives: 1 }
    }, startState)
    const nextState = reducer(state, validateAnswer(moduleRef, ['wrong answer']))
    expect(nextState[moduleRef].currentSlideRef).to.equal('9.A.END.1')
    expect(nextState[moduleRef].remainingLives).to.equal(0)
  })
})
