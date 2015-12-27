import React, { PropTypes } from 'react'
import axios from 'axios'
import { Link } from 'react-router'
import { connect } from 'react-redux'

import { loadModuleList } from '../../../state/actions'
import { Loading } from '../components'

const mapStateToProps = ({ modules }) => ({ modules })

const mapDispatchToProps = {
  loadModuleList
}

class ModuleList extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    modules: PropTypes.array.isRequired,
    loadModuleList: PropTypes.func.isRequired
  }

  async componentDidMount () {
    const { modules } = this.props
    if (modules && modules.length !== 0) return

    const { data: loadedModules } = await axios.get('/api/graphs/list')
    this.props.loadModuleList(loadedModules)
  }

  render () {
    let content
    const { children, modules } = this.props
    if (!modules || modules.length === 0) {
      content = (
        <div>
          <Loading />
          {children}
        </div>
      )
    } else {
      const links = modules.map(({ ref, name }, index) => (
        <li key={index}>
          <Link to={`/${ref}`}>
            {name}
          </Link>
        </li>
      ))
      content = <ul>{links}</ul>
    }

    return (
      <div>
        {content}
        {children}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ModuleList)
