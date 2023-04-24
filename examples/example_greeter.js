const Greeter = require('../services/Greeter');

const alice = new Greeter('Alice');
alice.greet(); // prints "Hello, Alice!"

const bob = new Greeter('Bob');
bob.greet(); // prints "Hello, Bob!"
