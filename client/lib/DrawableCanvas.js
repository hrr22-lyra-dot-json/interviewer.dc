'use strict';
const React = require('react');
const ReactDOM = require('react-dom');
const PropTypes = React.PropTypes;

var trackingX = [];
var trackingY = [];

const DrawableCanvas = React.createClass({
  propTypes: {
    brushColor: PropTypes.string,
    lineWidth: PropTypes.number,
    canvasStyle: PropTypes.shape({
      backgroundColor: PropTypes.string,
      cursor: PropTypes.string
    }),
    clear: PropTypes.bool
  },
  getDefaultProps() {
    return {
      brushColor: '#000000',
      lineWidth: 4,
      canvasStyle: {
        backgroundColor: '#FFFFFF',
        cursor: 'pointer'
      },
      clear: false
    };
  },
  getInitialState(){
    return {
      canvas: null,
      context: null,
      drawing: false,
      lastX: 0,
      lastY: 0,
      history: []
    };
  },
  componentDidMount(){
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
        let drawX = event.data.X;
        let drawY = event.data.Y;
        let otherWidth = event.data.width;
        let otherHeight = event.data.height;

        if (canvas.width !== otherWidth || canvas.height !== otherHeight) {
          let widthMultiplier = canvas.width / otherWidth;
          let heightMultiplier = canvas.height / otherHeight;
          for (let i = 0; i < drawX.length-1 && i < drawY.length-1; i++) {
            context.draw(
              drawX[i] * widthMultiplier,
              drawY[i] * heightMultiplier,
              drawX[i+1] * widthMultiplier,
              drawY[i+1] * heightMultiplier
            );
          }
        } else {
          for (let i = 0; i < drawX.length-1 && i < drawY.length-1; i++) {
            context.draw(drawX[i], drawY[i], drawX[i+1], drawY[i+1]);
          }
        }
      } else if (event.data.type === 'clear') {
        context.resetCanvas();
      }
    };
  },
  componentWillReceiveProps: function(nextProps) {
    if(nextProps.clear){
      this.resetCanvas();
    }
  },
  handleOnMouseDown(e){
    let rect = this.state.canvas.getBoundingClientRect();
    this.state.context.beginPath();
    if(this.isMobile()){
      this.setState({
        lastX: e.targetTouches[0].pageX - rect.left,
        lastY: e.targetTouches[0].pageY - rect.top
      });
    }
    else{
      this.setState({
        lastX: e.clientX - rect.left,
        lastY: e.clientY - rect.top
      });
    }

    this.setState({
      drawing: true
    });
  },
  handleOnMouseMove(e){

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
      trackingX.push(currentX);
      trackingY.push(currentY);
    }
  },
  handleonMouseUp(){
    this.setState({
      drawing: false
    });
    this.props.webrtc.send({
      type: 'draw',
      data: {
        X: trackingX,
        Y: trackingY,
        width: ReactDOM.findDOMNode(this).children[0].width,
        height: ReactDOM.findDOMNode(this).children[0].height
      }
    });
    trackingX = [];
    trackingY = [];
  },
  draw(lX, lY, cX, cY){
    this.state.context.strokeStyle = this.props.brushColor;
    this.state.context.lineWidth = this.props.lineWidth;
    this.state.context.moveTo(lX,lY);
    this.state.context.lineTo(cX,cY);
    this.state.context.stroke();
  },
  handleClear(){
    this.props.webrtc.send({
      type: 'clear'
    });
    this.resetCanvas();
  },
  resetCanvas(){
    let width = this.state.context.canvas.width;
    let height = this.state.context.canvas.height;
    this.state.context.clearRect(0, 0, width, height);
  },
  getDefaultStyle(){
    return {
      backgroundColor: '#FFFFFF',
      cursor: 'pointer'
    };
  },
  canvasStyle(){
    let defaults =  this.getDefaultStyle();
    let custom = this.props.canvasStyle;
    return Object.assign({}, defaults, custom);
  },
  isMobile(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
      return true;
    }
    return false;
  },
  render() {
    return (
      <div style={{height: 100 + '%'}}>
        <canvas style = {this.canvasStyle()}
          onMouseDown = {this.handleOnMouseDown}
          onTouchStart = {this.handleOnMouseDown}
          onMouseMove = {this.handleOnMouseMove}
          onTouchMove = {this.handleOnMouseMove}
          onMouseUp = {this.handleonMouseUp}
          onTouchEnd = {this.handleonMouseUp}
        >
        </canvas>
        <button onClick={this.handleClear}>Clear</button>
      </div>
    );
  }

});

module.exports = DrawableCanvas;