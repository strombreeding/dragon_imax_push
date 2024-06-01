interface MyObject {
  [key: string]: any;
}

export function addFrontAndBack(arr: MyObject[]): MyObject[] | undefined {
  if (arr.length < 2) {
    console.error('배열의 길이는 최소한 2보다 커야 합니다.');
    return;
  }
  const d = {...arr[arr.length - 1]};
  const c = {...arr[arr.length - 2]};
  const a = {...arr[0]};
  const b = {...arr[1]};

  const newArr = [c, d, ...arr, a, b];

  return newArr;
}

// const a: MyObject[] = [{name: 'John'}, {name: 'Doe'}];
// const b = addFrontAndBack(a);
// console.log(b); // [{name: "John"}, {name: "Doe"}, {name: "John"}, {name: "Doe"}]
