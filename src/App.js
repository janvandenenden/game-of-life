import React, { useState, useCallback, useRef } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import produce from "immer";

//define number of rows and columns of grid
const totalBoardRows = 30;
const totalBoardColumns = 30;

//operations to find cell neighbors
let operations = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [0, -1],
];

//generate grid with only dead cells,
const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < totalBoardRows; i++) {
    rows.push(Array.from(Array(totalBoardColumns), () => 0));
  }
  return rows;
};

function App() {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });
  const [running, setRunning] = useState(false);
  let [counter, setCounter] = useState(0);

  //useRef hook to prevent that running is constantly set to false
  const runningRef = useRef(running);
  runningRef.current = running;

  //start/stop simulation when running changes
  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < totalBoardRows; i++) {
          for (let j = 0; j < totalBoardColumns; j++) {
            let neighbors = 0;

            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (
                newI >= 0 &&
                newI < totalBoardRows &&
                newJ >= 0 &&
                newJ < totalBoardColumns
              ) {
                neighbors += g[newI][newJ];
              }
            });
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    setCounter((c) => c + 1);
    setTimeout(runSimulation, 1000);
  }, []);

  return (
    <Container>
      <h1 className="display-4 my-5">Conway's Game of Life</h1>
      <p className="lead">
        The Game of Life, also known simply as Life, is a cellular automaton
        devised by the British mathematician John Horton Conway in 1970. It is a
        zero-player game, meaning that its evolution is determined by its
        initial state, requiring no further input. One interacts with the Game
        of Life by creating an initial configuration and observing how it
        evolves.
      </p>
      <hr />
      <Row className="my-5">
        <Col
          md={3}
          className="d-flex flex-column justify-content-between mb-3 mb-md-0"
        >
          <div>
            <p>Rules of life</p>
            <ul className="list-unstyled small">
              <li>Any live cell with two or three live neighbors survives.</li>
              <li>
                Any dead cell with three live neighbors becomes a live cell.
              </li>
              <li>
                All other live cells die in the next generation. Similarly, all
                other dead cells stay dead.
              </li>
            </ul>
            <p>Generations: {counter}</p>
          </div>
          <div className="btn-group d-flex flex-column">
            <Button
              variant="outline-secondary"
              size="lg"
              block
              className="mt-2 rounded-0"
              onClick={() => {
                setRunning(!running);
                if (!running) {
                  runningRef.current = true;
                  runSimulation();
                }
              }}
            >
              {running ? "stop" : "start"}
            </Button>
            <Button
              variant="outline-secondary"
              size="lg"
              block
              className="mt-2 rounded-0"
              onClick={() => {
                setGrid(generateEmptyGrid());
                setCounter(0);
              }}
            >
              clear
            </Button>
            <Button
              variant="outline-secondary"
              size="lg"
              block
              className="mt-2 rounded-0"
              onClick={() => {
                const rows = [];
                for (let i = 0; i < totalBoardRows; i++) {
                  rows.push(
                    Array.from(Array(totalBoardColumns), () =>
                      Math.random() < 0.3 ? 1 : 0
                    )
                  );
                }
                setGrid(rows);
              }}
            >
              random
            </Button>
          </div>
        </Col>
        <Col md={9} className="d-flex justify-content-center">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${totalBoardColumns}, 1fr)`,
              width: "100%",
            }}
          >
            {grid.map((rows, i) =>
              rows.map((col, k) => (
                <div
                  key={`${i} - ${k}`}
                  style={{
                    minHeight: "16px",
                    backgroundColor: grid[i][k] ? "pink" : "blue",
                    border: "1px solid black",
                  }}
                  onClick={() => {
                    const newGrid = produce(grid, (gridCopy) => {
                      gridCopy[i][k] = grid[i][k] ? 0 : 1;
                    });
                    setGrid(newGrid);
                  }}
                ></div>
              ))
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
