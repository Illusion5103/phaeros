import React from 'react'
import NET from 'vanta/dist/vanta.net.min'
import * as THREE from 'three'

class Globe extends React.Component {
    
  constructor() {
    super()
    this.vantaRef = React.createRef()
  }
  componentDidMount() {
    this.vantaEffect = NET({
      el: this.vantaRef.current,
      THREE,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 950.00,
      minWidth: 200.00,
      scale: 1,
      scaleMobile: 1,
      size: 1,
      // color: 0x000,
      // color2: 0xe9800,
      // backgroundColor: 0xb3b3b3
      color: 0xffffff,
      color2: 0xffffff,
      backgroundColor: 0x000
    })
  }
  componentWillUnmount() {
    if (this.vantaEffect) this.vantaEffect.destroy()
  }
  render() {
    return <div id="net" ref={this.vantaRef}>
    </div>
  }
}

export default Globe;