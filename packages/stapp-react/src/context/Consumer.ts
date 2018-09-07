import shallowEqual from 'fbjs/lib/shallowEqual'
import { Component, createElement } from 'react'
import { identity } from 'stapp/lib/helpers/identity/identity'
import { STAPP_REACT } from '../helpers/constants'
import { consumerPropTypes } from '../helpers/propTypes'
import { renderComponent } from '../helpers/renderComponent'
import { Context, StappContext } from './Provider'

// Models
import { ConsumerProps } from '../models/Props'

export class Consumer<State, Api> extends Component<
  ConsumerProps<State, Api, any>
> {
  static displayName = 'Stapp.Consumer'
  static propTypes = consumerPropTypes
  static defaultProps = {
    map: identity
  }

  render() {
    let memo: ReturnType<typeof renderComponent> | null = null
    let prevState: any = null

    return createElement(StappContext.Consumer, {
      children: ({ state, app }: Context) => {
        if (!app) {
          throw new Error(`${STAPP_REACT} error: Provider missing!`)
        }

        const nextState = this.props.map!(state, app.api)

        if (!shallowEqual(prevState, nextState)) {
          prevState = nextState
          return (memo = renderComponent({
            name: 'Consumer',
            renderProps: this.props,
            result: nextState,
            api: app.api,
            app
          }))
        }

        return memo
      }
    })
  }
}
