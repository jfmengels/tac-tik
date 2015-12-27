import React from 'react'
import CSSModules from 'react-css-modules'

import ValidateButton from './validateButton'
import styles from './slide.css'

class Slide extends React.Component {
  static propTypes = {
    data: React.PropTypes.object.isRequired,
    onSendAnswer: React.PropTypes.func.isRequired
  }

  constructor (props, context) {
    super(props, context)
    this.state = {
      selectedIndex: -1
    }
  }

  slidesToListItems (selectedIndex) {
    return ({ label }, index) => (
      <li key={index}
        onClick={() => this.onSelect(index)}
        styleName={index === selectedIndex ? 'selected' : ''}
      >
        {label}
      </li>
    )
  }

  onSelect (choiceIndex) {
    this.setState({
      selectedIndex: choiceIndex
    })
  }

  onValidate () {
    const { data, onSendAnswer } = this.props
    const { selectedIndex } = this.state
    const answer = data.question.content.choices[selectedIndex].ref
    this.setState({ selectedIndex: -1 })
    onSendAnswer([answer])
  }

  render () {
    const { ref, question } = this.props.data
    const { selectedIndex } = this.state
    const choices = question.content.choices
      .map(this.slidesToListItems(selectedIndex))

    return (
      <div>
        Question {ref}
        <p>{question.header}</p>
        <ul>
          {choices}
        </ul>
        <ValidateButton
          disabled={selectedIndex === -1}
          onValidate={() => this.onValidate()}
        />
      </div>
    )
  }
}

export default CSSModules(styles)(Slide)
