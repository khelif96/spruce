import {
  toggleArray,
  deduplicatedAppend,
  convertArrayToObject,
  convertObjectToArray,
  mapStringArrayToObject,
  toArray,
} from ".";

describe("toggleArray", () => {
  it("should add an element to the array if the array is empty", () => {
    expect(toggleArray(1, [])).toStrictEqual([1]);
    expect(toggleArray("Mohamed", [])).toStrictEqual(["Mohamed"]);
  });
  it("should remove an element from the array if it already exists", () => {
    expect(toggleArray(1, [1])).toStrictEqual([]);
    expect(toggleArray("Arjun", ["Arjun"])).toStrictEqual([]);
    expect(toggleArray(1, [1, 2])).toStrictEqual([2]);
    expect(toggleArray("Chaya", ["Chaya", "Arjun"])).toStrictEqual(["Arjun"]);
  });
  it("should handle objects", () => {
    expect(toggleArray({ someArray: 1 }, [])).toStrictEqual([{ someArray: 1 }]);
    expect(toggleArray({ someArray: 1 }, [{ someArray: 1 }])).toStrictEqual([]);
    expect(toggleArray({ someArray: 1 }, [{ someArray: 2 }])).toStrictEqual([
      { someArray: 2 },
      { someArray: 1 },
    ]);
  });
});

describe("deduplicatedAppend", () => {
  it("should add an element into an array if it does not exist", () => {
    expect(deduplicatedAppend(1, [])).toStrictEqual([1]);
    expect(deduplicatedAppend("Mohamed", [])).toStrictEqual(["Mohamed"]);
    expect(deduplicatedAppend(2, [1])).toStrictEqual([1, 2]);
  });
  it("should not add an element into an array if it already exists", () => {
    expect(deduplicatedAppend(1, [1])).toStrictEqual([1]);
    expect(deduplicatedAppend(1, [1, 2])).toStrictEqual([1, 2]);
  });
});
describe("convertObjectToArray", () => {
  it("should return an empty array for an empty object", () => {
    expect(convertObjectToArray({})).toStrictEqual([]);
    expect(convertObjectToArray(undefined)).toStrictEqual([]);
  });
  it("should split out singular array values in objects into an array of their own objects", () => {
    expect(convertObjectToArray({ a: [1], b: [2] })).toStrictEqual([
      { key: "a", value: 1 },
      { key: "b", value: 2 },
    ]);
  });
  it("should split out array values with multiple elements in objects into an array of their own objects", () => {
    expect(convertObjectToArray({ a: [1, 2, 3], b: [4, 5, 6] })).toStrictEqual([
      { key: "a", value: 1 },
      { key: "a", value: 2 },
      { key: "a", value: 3 },
      { key: "b", value: 4 },
      { key: "b", value: 5 },
      { key: "b", value: 6 },
    ]);
  });
});

describe("convertArrayToObject", () => {
  it("should return an empty object if provided with an empty array", () => {
    expect(convertArrayToObject([], "someKey")).toStrictEqual({});
    expect(convertArrayToObject(undefined, "someKey")).toStrictEqual({});
  });
  it("should take a singular array element and return an object with one element", () => {
    const element = { key: "aKey", value: 1 };
    expect(convertArrayToObject([element], "key")).toStrictEqual({
      aKey: { key: "aKey", value: 1 },
    });
  });
  it("should take a array with many elements and return an object with many element", () => {
    const element1 = { key: "aKey", value: 1 };
    const element2 = { key: "bKey", value: 2 };
    const element3 = { key: "cKey", value: 3 };

    expect(
      convertArrayToObject([element1, element2, element3], "key")
    ).toStrictEqual({
      aKey: element1,
      bKey: element2,
      cKey: element3,
    });
  });
  it("should use the most recent object when there is a key name collision", () => {
    const element1 = { key: "aKey", value: 1 };
    const element2 = { key: "bKey", value: 2 };
    const element3 = { key: "aKey", value: 3 };

    expect(
      convertArrayToObject([element1, element2, element3], "key")
    ).toStrictEqual({
      aKey: element3,
      bKey: element2,
    });
  });
  it("should throw an error when the key value is not a valid type", () => {
    const element1 = { key: "aKey", value: 1 };
    const element2 = { key: () => {}, value: 2 };
    const element3 = { key: "cKey", value: 3 };

    expect(() =>
      convertArrayToObject([element1, element2, element3], "key")
    ).toThrow(TypeError("Object keys must be of type `string`"));
  });
});

describe("mapStringArrayToObject", () => {
  it("should convert a string array to an array of key value pairs", () => {
    const someArray = ["keyA", "keyB", "keyC", "keyD"];
    expect(mapStringArrayToObject(someArray, "Value")).toStrictEqual({
      keyA: "Value",
      keyB: "Value",
      keyC: "Value",
      keyD: "Value",
    });
    expect(mapStringArrayToObject(someArray, true)).toStrictEqual({
      keyA: true,
      keyB: true,
      keyC: true,
      keyD: true,
    });
  });

  it("should handle functions for passed in values", () => {
    const someArray = ["keyA", "keyB", "keyC", "keyD"];
    const someFunc = (v: string) => v.toUpperCase();
    expect(mapStringArrayToObject(someArray, someFunc)).toStrictEqual({
      keyA: "KEYA",
      keyB: "KEYB",
      keyC: "KEYC",
      keyD: "KEYD",
    });
  });
  it("should return an empty object if provided with an empty array", () => {
    expect(mapStringArrayToObject([], "someKey")).toStrictEqual({});
    expect(mapStringArrayToObject(undefined, "someKey")).toStrictEqual({});
  });
});

describe("toArray", () => {
  it("should convert a single element to an array", () => {
    expect(toArray(1)).toStrictEqual([1]);
    expect(toArray("a")).toStrictEqual(["a"]);
    expect(toArray(true)).toStrictEqual([true]);
    expect(toArray({ someKey: "someValue" })).toStrictEqual([
      { someKey: "someValue" },
    ]);
  });
  it("should convert an array to an array", () => {
    expect(toArray([1, 2, 3])).toStrictEqual([1, 2, 3]);
    expect(toArray(["a", "b", "c"])).toStrictEqual(["a", "b", "c"]);
    expect(toArray([true, false, true])).toStrictEqual([true, false, true]);
    expect(toArray([{ someKey: "someValue" }])).toStrictEqual([
      { someKey: "someValue" },
    ]);
  });
  it("an undefined value should be converted into an empty array", () => {
    expect(toArray(undefined)).toStrictEqual([]);
  });
});