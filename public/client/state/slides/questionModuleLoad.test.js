import { expect } from 'chai'
import u from 'updeep'

import reducer, { questionModuleLoad } from './'

import slidesFixture from './slides.test.fixture.json'
import graphFixture from './graph.test.fixture.json'

describe('slides - module loading', () => {
  let state
  let moduleRef = graphFixture.ref
  const startState = reducer(
    reducer(startState, questionModuleLoad(moduleRef, slidesFixture, graphFixture)),
    { type: '@@INIT' }
  )

  beforeEach(() => {
    moduleRef = graphFixture.ref
    state = startState
  })

  it('should add a new module when modules field is empty', () => {
    expect(state[moduleRef].slides).to.deep.equal(slidesFixture)
    expect(state[moduleRef].graph).to.deep.equal(graphFixture)
    expect(state[moduleRef].currentSlideRef).to.equal(graphFixture.startPoints[0])
    expect(state[moduleRef].remainingLives).to.equal(3)
  })

  it('should add a new module when module is not yet present, but modules is not empty', () => {
    const newRef = `${moduleRef}A`
    const newSlides = [{
      a: 5,
      b: 6
    }, {
      a: 7,
      b: 8
    }]
    const newGraph = JSON.parse(JSON.stringify(graphFixture))
    newGraph.ref = newRef
    state = u({
      [moduleRef]: {
        remainingLives: 1,
        currentSlideRef: '9.A.2'
      }
    }, state)

    const nextState = reducer(state, questionModuleLoad(newRef, newSlides, newGraph))
    // Should not affect other modules
    expect(nextState[moduleRef].slides).to.deep.equal(slidesFixture)
    expect(nextState[moduleRef].graph).to.deep.equal(graphFixture)
    expect(nextState[moduleRef].currentSlideRef).to.equal('9.A.2')
    expect(nextState[moduleRef].remainingLives).to.equal(1)

    expect(nextState[newRef].slides).to.deep.equal(newSlides)
    expect(nextState[newRef].graph).to.deep.equal(newGraph)
    expect(nextState[newRef].currentSlideRef).to.equal(graphFixture.startPoints[0])
    expect(nextState[newRef].remainingLives).to.equal(3)
  })

  it('should override a module when it is already present, and reset the currentSlideRef', () => {
    const newSlides = [{
      a: 5,
      b: 6
    }, {
      a: 7,
      b: 8
    }]
    state = u({ 0: { currentSlideRef: 5 } }, state)

    const nextState = reducer(state, questionModuleLoad(moduleRef, newSlides, graphFixture))
    expect(nextState[moduleRef].slides).to.not.deep.equal(slidesFixture)
    expect(nextState[moduleRef].slides).to.deep.equal(newSlides)
    expect(nextState[moduleRef].graph).to.deep.equal(graphFixture)
    expect(nextState[moduleRef].currentSlideRef).to.equal(graphFixture.startPoints[0])
    expect(nextState[moduleRef].remainingLives).to.equal(3)
  })
})
