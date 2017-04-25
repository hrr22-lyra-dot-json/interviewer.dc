'use strict';
const React = require('react');
const ReactDOM = require('react-dom');

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
      cursor: 'crosshair'
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
    ctx.lineJoin = 'round';
    ctx.lineCap = 'butt';

    this.setState({
      canvas: canvas,
      context: ctx
    });

    let context = this;
    this.props.webrtc.onmessage = function(event) {
      if (event.data.type === 'draw') {
        let data = event.data.data;

        if (canvas.width !== data.width || canvas.height !== data.height) {
          let widthMultiplier = canvas.width / data.width;
          let heightMultiplier = canvas.height / data.height;
          for (let i = 0; i < data.X.length-1 && i < data.Y.length-1; i++) {
            context.draw(
              data.X[i] * widthMultiplier,
              data.Y[i] * heightMultiplier,
              data.X[i+1] * widthMultiplier,
              data.Y[i+1] * heightMultiplier,
              data.brushColor,
              data.lineWidth
            );
          }
        } else {
          for (let i = 0; i < data.X.length-1 && i < data.Y.length-1; i++) {
            context.draw(
              data.X[i],
              data.Y[i],
              data.X[i+1],
              data.Y[i+1],
              data.brushColor,
              data.lineWidth
            );
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
        brushColor: this.brushColor,
        lineWidth: this.lineWidth
      }
    });
    this.trackingX = [];
    this.trackingY = [];
  }

  draw(lX, lY, cX, cY, brushColor, lineWidth) {
    this.state.context.beginPath();
    this.state.context.strokeStyle = brushColor || this.brushColor;
    this.state.context.lineWidth = lineWidth || this.lineWidth;
    this.state.context.moveTo(lX,lY);
    this.state.context.lineTo(cX,cY);
    this.state.context.closePath();
    this.state.context.stroke();
  }

  handleClear() {
    this.props.webrtc.send({
      type: 'clear'
    });
    this.resetCanvas();
  }

  changePointer(id, option) {
    if (id === 'brushButton') {
      this.brushColor = '#000000';
    } else if (id === 'eraserButton') {
      this.brushColor = this.canvasStyle.backgroundColor;
    } else if (id === 'widthSelector') {
      this.lineWidth = option;
    } else if (id === 'colorSelector') {
      this.brushColor = option;
    }
  }

  onSelectChange(id, event) {
    if (id === 'widthSelector') {
      this.changePointer(id, event.target.value);
      document.getElementById(id).value = event.target.value;
    } else if (id === 'colorSelector') {
      this.changePointer(id, event.target.value);
      document.getElementById(id).value = event.target.value;
    }
  }

  resetCanvas() {
    let width = this.state.context.canvas.width;
    let height = this.state.context.canvas.height;
    this.state.context.clearRect(0, 0, width, height);
  }

  getDefaultStyle() {
    return {
      backgroundColor: '#FFFFFF',
      cursor: 'crosshair'
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
      <div id="whiteboard" className="col s12">
        <canvas style = {this.canvasStyle}
          onMouseDown = {this.handleOnMouseDown.bind(this)}
          onTouchStart = {this.handleOnMouseDown.bind(this)}
          onMouseMove = {this.handleOnMouseMove.bind(this)}
          onTouchMove = {this.handleOnMouseMove.bind(this)}
          onMouseUp = {this.handleonMouseUp.bind(this)}
          onTouchEnd = {this.handleonMouseUp.bind(this)}
        >
        </canvas>
        <div id="whiteboardOptions">
          <select id="colorSelector" defaultValue="Black" onChange={this.onSelectChange.bind(this, 'colorSelector')}>
            <option value="#000000">Black</option>
            <option value="#ff0000">Red</option>
            <option value="#0000FF">Blue</option>
          </select>
          <button onClick={this.changePointer.bind(this, 'brushButton')}>Brush</button>
          <button onClick={this.changePointer.bind(this, 'eraserButton')}>Eraser</button>
          <select id="widthSelector" defaultValue="4" onChange={this.onSelectChange.bind(this, 'widthSelector')}>
            <option value="1">1</option>
            <option value="4">4</option>
            <option value="8">8</option>
            <option value="16">16</option>
            <option value="32">32</option>
          </select>
          <button id="clearButton" onClick={this.handleClear.bind(this)}>Clear</button>
        </div>
      </div>
    );
  }

};

module.exports = DrawableCanvas;