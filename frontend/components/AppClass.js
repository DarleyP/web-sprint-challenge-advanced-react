import React from 'react';
import axios from 'axios';

class AppClass extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      email: '',
      steps: 0,
      index: 4,
    };
  }

  getXY(index) {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  getXYMessage(index) {
    const { x, y } = this.getXY(index);
    return `Coordinates (${x}, ${y})`;
  }

  getNextIndex(index, direction) {
    let x = index % 3;
    let y = Math.floor(index / 3);

    switch (direction) {
      case 'left':
        x = x === 0 ? x : x - 1;
        break;
      case 'up':
        y = y === 0 ? y : y - 1;
        break;
      case 'right':
        x = x === 2 ? x : x + 1;
        break;
      case 'down':
        y = y === 2 ? y : y + 1;
        break;
      default:
        break;
    }
    if (x === index % 3 && y === Math.floor(index / 3)) {
      this.setState({ message: `You can't go ${direction}` })
    }
    return y * 3 + x;
  }



  reset = () => {
    this.setState({
      message: '',
      email: '',
      steps: 0,
      index: 4,
    });
  }

  move = (evt) => {
    const direction = evt.target.id;
    const nextIndex = this.getNextIndex(this.state.index, direction);
    if (nextIndex !== this.state.index) {
      this.setState((prevState) => ({
        steps: prevState.steps + 1,
        index: nextIndex,
      }));
    }
  };

  onChange = (evt) => {
    this.setState({ email: evt.target.value });
  };

  onSubmit = (evt) => {
    evt.preventDefault();

    const email1 = this.state.email.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (email1 === 'foo@bar.baz') {
    this.setState({ message: 'foo@bar.baz failure #71' });
    return;
  }

  if (email1 === '') {
    this.setState({ message: 'Ouch: email is required' });
    return;
  }

  if (!emailRegex.test(email1)) {
    this.setState({ message: 'Ouch: email must be a valid email' });
    return;
  }
  
    const { index, steps, email } = this.state;
    const payload = {
      x: this.getXY(index).x,
      y: this.getXY(index).y,
      steps,
      email,
    }

    
    axios
      .post('http://localhost:9000/api/result', payload)
      .then((response) => {
        this.setState({ message: response.data.message });
      })
      .catch((error) => {
        if (error.response && error.response.status === 422) {
          this.setState({ message: 'Unprocessable Entity' });
        } else {
          this.setState({ message: 'Error submitting the form.' });
        }
      });

    this.setState({
      message: '',
      email: '',
    });
  };

  render() {
    const { index, steps, email, message } = this.state;
    const stepsText = steps === 1 ? "1 time" : `${steps} times`;
    return (
      <div id="wrapper" className={this.props.className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage(index)}</h3>
          <h3 id="steps">You moved {stepsText}</h3>
        </div>
        <div id="grid">
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))}
        </div>
        <div className="info">
          <h3 id="message">{message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>
            LEFT
          </button>
          <button id="up" onClick={this.move}>
            UP
          </button>
          <button id="right" onClick={this.move}>
            RIGHT
          </button>
          <button id="down" onClick={this.move}>
            DOWN
          </button>
          <button id="reset" onClick={this.reset}>
            reset
          </button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input
            id="email"
            type="email"
            placeholder="type email"
            value={email}
            onChange={this.onChange}
          />
          <input id="submit" type="submit" />
        </form>
      </div>
    );
  }
}

export default AppClass;

