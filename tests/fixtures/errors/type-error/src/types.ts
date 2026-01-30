interface User {
  name: string;
  age: number;
}

const user: User = {
  name: 'John',
  age: 'thirty' // Type error: should be number
};

export { user };