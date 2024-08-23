import { objectToFormData, formDataToObject } from "./formDataHelper";

describe("objectToFormData", () => {
  it("should convert an simple object to a FormData object", () => {
    const expectedObject = {
      title: "Hello World",
      body: "This is a test",
    };

    const actualObject = objectToFormData(expectedObject);

    expect(actualObject.get("title")).toEqual("Hello World");
    expect(actualObject.get("body")).toEqual("This is a test");
  });

  it("should convert a nested object to a FormData object", () => {
    const expectedObject = {
      post: {
        title: "Hello World",
        body: "This is a test",
      },
    };
    const actualObject = objectToFormData(expectedObject);

    expect(actualObject.get("post[title]")).toEqual("Hello World");
    expect(actualObject.get("post[body]")).toEqual("This is a test");
  });

  it("should append a date to a FormData object as a string", () => {
    const date = new Date();
    const expectedObject = {
      post: {
        title: "Hello World",
        body: "This is a test",
        created_at: date,
      },
    };
    const actualObject = objectToFormData(expectedObject);

    expect(actualObject.get("post[created_at]")).toEqual(date.toISOString());
  });

  it("should handle File objects", () => {
    const file = new File(["hello"], "hello.txt");
    const expectedObject = {
      post: {
        title: "Hello World",
        body: "This is a test",
        file: file,
      },
    };
    const actualObject = objectToFormData(expectedObject);

    expect(actualObject.get("post[file]")).toEqual(file);
  });
});

describe("formDataToObject", () => {
  it("should convert a FormData object to an object", () => {
    const formData = new FormData();
    formData.append("a", "1");
    formData.append("b", "2");

    const result = formDataToObject(formData);
    expect(result).toEqual({ a: "1", b: "2" });
  });
});
