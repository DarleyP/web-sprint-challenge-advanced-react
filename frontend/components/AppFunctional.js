import React, { useState } from 'react';

export default function AppFunctional(props) {
  const initialMessage = '';
  const initialEmail = '';
  const initialSteps = 0;
  const initialIndex = 4;
  const initialErr = ''

  const [index, setIndex] = useState(initialIndex);
  const [steps, setSteps] = useState(initialSteps);
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  

  function getXY() {
    const x = (index % 3) + 1;
    const y = Math.floor(index / 3) + 1;
    return { x, y };
  }

  function getXYMessage() {
    const { x, y } = getXY();
    return `Coordinates (${x}, ${y})`;
  }

  function reset() {
    setIndex(initialIndex);
    setSteps(initialSteps);
    setMessage(initialMessage);
    setEmail(initialEmail);
  }



  function getNextIndex(direction) {
    let x = index % 3;
    let y = Math.floor(index / 3);
  
    switch (direction) {
      case 'left':
        x = Math.max(x - 1, 0);
        break;
      case 'up':
        y = Math.max(y - 1, 0);
        break;
      case 'right':
        x = Math.min(x + 1, 2);
        break;
      case 'down':
        y = Math.min(y + 1, 2);
        break;
      default:
        break;
    }
  
    if (x === index % 3 && y === Math.floor(index / 3)) {
      setMessage(`You can't go ${direction}`);
      return index;
    }
  
    return y * 3 + x;
  }
  

  function move(evt) {
    const direction = evt.target.id;
    const nextIndex = getNextIndex(direction);
    if (nextIndex !== index) {
      setIndex(nextIndex);
      setSteps(steps + 1);
    }
  }

  function onChange(evt) {
    setEmail(evt.target.value);
  }

  function onSubmit(evt) {
    evt.preventDefault();

    if (!email.trim()) {
      setMessage('Ouch: email is required');
      return;
    }

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValidEmail) {
      setMessage('Ouch: email must be a valid email');
      return;
    }

    const payload = {
      x: getXY().x,
      y: getXY().y,
      steps,
      email,
    };

    fetch('http://localhost:9000/api/result', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          setMessage(data.error);
        } else {
          setMessage(data.message);
        }
      })
      .catch(error => {
        setMessage('An error occurred while submitting the form.');
        console.error(error);
      });
      {message && <p className="ouch">{message}</p>}
      setEmail('')
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} {steps === 1 ? 'time' : 'times'}</h3>
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
        <button  data-testid='left' id="left" onClick={move}>
          LEFT
        </button>
        <button  data-testid="up" id="up" onClick={move}>
          UP
        </button>
        <button data-testid='right' id="right" onClick={move}>
          RIGHT
        </button>
        <button  data-testid='down' id="down" onClick={move}>
          DOWN
        </button>
        <button  id="reset" onClick={reset}>
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange} />
        <input id="submit" type="submit" />
      </form>
    </div>
  );
}
