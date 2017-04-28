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

    this.rect;
    this.tool = 'brush';
    this.brushColor = '#000000';
    this.lineWidth = 4;
    this.canvasStyle = {
      backgroundColor: '#FFFFFF',
      cursor: 'crosshair'
    };
    this.tracker = [];

    this.originalOffsetW;
    this.originalOffsetH;
    this.offsetWidth = 0;
    this.offsetHeight = 0;
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
    this.originalOffsetW = canvas.offsetWidth;
    this.originalOffsetH = canvas.offsetHeight;

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
          for (let i = 0; i < data.lines.length-1; i++) {
            context.draw(
              data.lines[i][0] * widthMultiplier,
              data.lines[i][1] * heightMultiplier,
              data.lines[i+1][0] * widthMultiplier,
              data.lines[i+1][1] * heightMultiplier,
              data.brushColor,
              data.lineWidth
            );
          }
        } else {
          for (let i = 0; i < data.lines.length-1; i++) {
            context.draw(
              data.lines[i][0],
              data.lines[i][1],
              data.lines[i+1][0],
              data.lines[i+1][1],
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
      this.tracker.push([lastX, lastY]);
    }
    else{
      let lastX = (e.clientX - rect.left) * (this.state.canvas.width / rect.width);
      let lastY = (e.clientY - rect.top) * (this.state.canvas.height / rect.height);
      this.setState({
        lastX: lastX,
        lastY: lastY
      });
      this.tracker.push([lastX, lastY]);
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
        currentX = (e.clientX - rect.left) * (this.state.canvas.width / rect.width);
        currentY = (e.clientY - rect.top) * (this.state.canvas.height / rect.height);
      }

      this.draw(lastX, lastY, currentX, currentY);
      this.setState({
        lastX: currentX,
        lastY: currentY,
      });
      this.tracker.push([currentX, currentY]);

      if (this.tracker.length === 10) {
        this.sendData('drawing');
      }
    }
  }

  handleonMouseUp() {
    this.setState({
      drawing: false
    });
    this.sendData();
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

  sendData(condition) {
    let tracker = this.tracker;
    this.tracker = [];

    if (condition === 'drawing') {
      // Connect the last point of this series to the first point of the next
      // Only if the mouse is still held down
      this.tracker.push(tracker[tracker.length-1]);
    }

    this.props.webrtc.send({
      type: 'draw',
      data: {
        lines: tracker,
        width: ReactDOM.findDOMNode(this).children[0].width,
        height: ReactDOM.findDOMNode(this).children[0].height,
        brushColor: this.brushColor,
        lineWidth: this.lineWidth
      }
    });
  }

  handleClear() {
    this.props.webrtc.send({
      type: 'clear'
    });
    this.resetCanvas();
  }

  changePointer(id, option) {
    if (id === 'brushButton') {
      this.tool = 'brush';
      this.brushColor = '#000000';
    } else if (id === 'eraserButton') {
      this.tool = 'eraser';
      this.brushColor = this.canvasStyle.backgroundColor;
    } else if (id === 'widthSelector') {
      this.lineWidth = option;
    } else if (id === 'colorSelector' && this.tool === 'brush') {
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