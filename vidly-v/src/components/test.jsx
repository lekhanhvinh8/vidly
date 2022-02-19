import React, { Component } from "react";

class Test extends Component {
  state = {};
  render() {
    console.log(abc(4));
    console.log(foo(5));
    console.log(bar(6));
    console.log(this.xyz(10));
    console.log(((number) => number)(7));

    console.log(abc);
    console.log(foo);
    console.log(bar);
    console.log(this.xyz);
    console.log((number) => number);

    console.log(() => abc(7));
    console.log(() => foo(8));
    console.log(() => bar(9));

    return (
      <div>
        <h1>Test</h1>
      </div>
    );
  }

  xyz = (number) => {
    return number;
  };
}

function abc(number1) {
  return number1 * 2;
}

const foo = function (number) {
  return number;
};

const bar = (number) => number;

export default Test;
