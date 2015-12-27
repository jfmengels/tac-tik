import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'

import { questionModuleLoad, validateAnswer } from '../../../state/actions'
import { Slide, Loading, EndSlide, LivesCounter } from '../components'

const mapStateToProps = ({ slides }) => ({ slides })

const mapDispatchToProps = {
  questionModuleLoad,
  validateAnswer
}

class SlidesModules extends Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
    slides: PropTypes.object.isRequired,
    questionModuleLoad: PropTypes.func.isRequired,
    validateAnswer: PropTypes.func.isRequired
  }

  async componentDidMount () {
    const { ref } = this.props.params
    const ok = await new Promise(function(resolve) {
      setTimeout(function() {
        resolve(2)
      }, 1000);
    })
    console.log(ok);
    const [{ data: slides }, { data: graphs }] = await axios.all([
      axios.get(`/api/slides/${ref}`),
      axios.get(`/api/graphs/${ref}`)
    ])

    const slidesMap = slides.reduce((map, slide) => {
      map[slide.ref] = slide
      return map
    }, {})
    this.props.questionModuleLoad(ref, slidesMap, graphs)
  }

  onSendAnswer (answer) {
    const { ref } = this.props.params
    this.props.validateAnswer(ref, answer)
  }

  render () {
    const { slides } = this.props
    const { ref } = this.props.params
    const currentModule = slides[ref]
    if (!currentModule) {
      return <Loading />
    }

    const { currentSlideRef, graph, remainingLives } = currentModule
    const endPoint = graph.endPoints[currentSlideRef]
    let slideComponent

    if (endPoint) {
      slideComponent = <EndSlide data={endPoint} />
    } else {
      const currentSlide = currentModule.slides[currentSlideRef]
      slideComponent = <Slide moduleRef={ref} data={currentSlide} onSendAnswer={this.onSendAnswer.bind(this)} />
    }
    return (
      <div>
        <LivesCounter remainingLives={remainingLives} />
        {slideComponent}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SlidesModules)
