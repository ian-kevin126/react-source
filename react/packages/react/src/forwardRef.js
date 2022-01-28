/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {REACT_FORWARD_REF_TYPE} from 'shared/ReactSymbols';

import warningWithoutStack from 'shared/warningWithoutStack';

export default function forwardRef<Props, ElementType: React$ElementType>(
  render: (props: Props, ref: React$Ref<ElementType>) => React$Node,
) {
  if (__DEV__) {
    if (typeof render !== 'function') {
      warningWithoutStack(
        false,
        'forwardRef requires a render function but was given %s.',
        render === null ? 'null' : typeof render,
      );
    } else {
      warningWithoutStack(
        // Do not warn for 0 arguments because it could be due to usage of the 'arguments' object
        render.length === 0 || render.length === 2,
        'forwardRef render functions accept exactly two parameters: props and ref. %s',
        render.length === 1
          ? 'Did you forget to use the ref parameter?'
          : 'Any additional parameter will be undefined.',
      );
    }

    if (render != null) {
      warningWithoutStack(
        render.defaultProps == null && render.propTypes == null,
        'forwardRef render functions do not support propTypes or defaultProps. ' +
          'Did you accidentally pass a React component?',
      );
    }
  }

  /**
   * 这里要注意，通过forwardRef包裹的组件，返回的并不是这个 REACT_FORWARD_REF_TYPE 类型的对象，仍然是ReactElement.js中的 REACT_ELEMENT_TYPE
 const element = {
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner,
  };

  只是在type上会加入下面这个属性
  {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
  }

  可以这么说，只要是通过createElement()方法创建的组件，它的$$typeof都是REACT_ELEMENT_TYPE

   *
   */
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render,
  };
}
