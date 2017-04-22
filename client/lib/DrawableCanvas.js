'use strict';
const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = React.PropTypes;

class DrawableCanvas extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canvas: null,
      context: null,
      drawing: false,
      lastX: 0,
      lastY: 0,
      history: []
    };

    this.brushColor = '#000000';
    this.lineWidth = 4;
    this.canvasStyle = {
      backgroundColor: '#FFFFFF',
      cursor: 'pointer'
    };
    this.trackingX = [];
    this.trackingY = [];
  }

  componentDidMount() {
    let canvas = ReactDOM.findDOMNode(this).children[0];

    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let ctx = canvas.getContext('2d');

    this.setState({
      canvas: canvas,
      context: ctx
    });

    let context = this;
    this.props.webrtc.onmessage = function(event) {
      if (event.data.type === 'draw') {
        let brushColor = event.data.data.brushColor;
        let drawX = event.data.data.X;
        let drawY = event.data.data.Y;
        let otherWidth = event.data.data.width;
        let otherHeight = event.data.data.height;

        context.state.context.beginPath();
        if (canvas.width !== otherWidth || canvas.height !== otherHeight) {
          let widthMultiplier = canvas.width / otherWidth;
          let heightMultiplier = canvas.height / otherHeight;
          for (let i = 0; i < drawX.length-1 && i < drawY.length-1; i++) {
            context.draw(
              drawX[i] * widthMultiplier,
              drawY[i] * heightMultiplier,
              drawX[i+1] * widthMultiplier,
              drawY[i+1] * heightMultiplier,
              brushColor
            );
          }
        } else {
          for (let i = 0; i < drawX.length-1 && i < drawY.length-1; i++) {
            context.draw(drawX[i], drawY[i], drawX[i+1], drawY[i+1], brushColor);
          }
        }
      } else if (event.data.type === 'clear') {
        context.resetCanvas();
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.clear){
      this.resetCanvas();
    }
  }

  handleOnMouseDown(e) {
    let rect = this.state.canvas.getBoundingClientRect();
    this.state.context.beginPath();
    if(this.isMobile()){
      let lastX = e.targetTouches[0].pageX - rect.left;
      let lastY = e.targetTouches[0].pageY - rect.top;
      this.setState({
        lastX: lastX,
        lastY: lastY
      });
      this.trackingX.push(lastX);
      this.trackingY.push(lastY);
    }
    else{
      let lastX = e.clientX - rect.left;
      let lastY = e.clientY - rect.top;
      this.setState({
        lastX: e.clientX - rect.left,
        lastY: e.clientY - rect.top
      });
      this.trackingX.push(lastX);
      this.trackingY.push(lastY);
    }

    this.setState({
      drawing: true
    });
  }

  handleOnMouseMove(e) {
    if(this.state.drawing){
      let rect = this.state.canvas.getBoundingClientRect();
      let lastX = this.state.lastX;
      let lastY = this.state.lastY;
      let currentX;
      let currentY;
      if(this.isMobile()){
        currentX =  e.targetTouches[0].pageX - rect.left;
        currentY = e.targetTouches[0].pageY - rect.top;
      }
      else{
        currentX = e.clientX - rect.left;
        currentY = e.clientY - rect.top;
      }


      this.draw(lastX, lastY, currentX, currentY);
      this.setState({
        lastX: currentX,
        lastY: currentY,
      });
      this.trackingX.push(currentX);
      this.trackingY.push(currentY);
    }
  }

  handleonMouseUp() {
    this.setState({
      drawing: false
    });
    this.props.webrtc.send({
      type: 'draw',
      data: {
        X: this.trackingX,
        Y: this.trackingY,
        width: ReactDOM.findDOMNode(this).children[0].width,
        height: ReactDOM.findDOMNode(this).children[0].height,
        brushColor: this.brushColor
      }
    });
    this.trackingX = [];
    this.trackingY = [];
  }

  draw(lX, lY, cX, cY, brushColor) {
    this.state.context.strokeStyle = brushColor || this.brushColor;
    this.state.context.lineWidth = this.lineWidth;
    this.state.context.moveTo(lX,lY);
    this.state.context.lineTo(cX,cY);
    this.state.context.stroke();
  }

  handleClear() {
    this.props.webrtc.send({
      type: 'clear'
    });
    this.resetCanvas();
  }

  changeToBrush() {
    this.brushColor = '#000000';
  }

  changeToEraser() {
    this.brushColor = this.canvasStyle.backgroundColor;
  }

  resetCanvas() {
    let width = this.state.context.canvas.width;
    let height = this.state.context.canvas.height;
    this.state.context.clearRect(0, 0, width, height);
  }

  getDefaultStyle() {
    return {
      backgroundColor: '#FFFFFF',
      cursor: 'pointer'
    };
  }

  canvasStyle() {
    let defaults =  this.getDefaultStyle();
    let custom = this.canvasStyle;
    return Object.assign({}, defaults, custom);
  }

  isMobile() {
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true;
    }
    return false;
  }

  render() {
    return (
      <div style={{height: 100 + '%'}}>
        <canvas style = {this.canvasStyle}
          onMouseDown = {this.handleOnMouseDown.bind(this)}
          onTouchStart = {this.handleOnMouseDown.bind(this)}
          onMouseMove = {this.handleOnMouseMove.bind(this)}
          onTouchMove = {this.handleOnMouseMove.bind(this)}
          onMouseUp = {this.handleonMouseUp.bind(this)}
          onTouchEnd = {this.handleonMouseUp.bind(this)}
        >
        </canvas>
        <button onClick={this.changeToBrush.bind(this)}>Brush</button>
        <button onClick={this.changeToEraser.bind(this)}>Eraser</button>
        <button id="clearButton" onClick={this.handleClear.bind(this)}>Clear</button>
      </div>
    );
  }

};

module.exports = DrawableCanvas;