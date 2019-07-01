import React from 'react'
import { node } from 'prop-types'
import { useSpring, animated } from 'react-spring'

const propTypes = { children: node }

function Animated ({ children }) {
  const springProps = useSpring({
    opacity: 1,
    marginTop: 0,
    from: {
      opacity: 0,
      marginTop: -5
    }
  })

  return (
    <animated.div style={springProps}>
      {children}
    </animated.div>
  )
}

Animated.propTypes = propTypes

export default Animated
