import { renderHook } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import useURLSearchParam from "./useURLSearchParam";
import { act } from "react";

describe("useURLSearchParam", () => {
  const Wrapper = ({ children }) => <Router>{children}</Router>;

  afterEach(() => {
    window.history.replaceState({}, "", "/"); // Reset the search params in the URL
  });

  it("should return the initial value", () => {
    // const { result } = renderHook(() =>
    //   useURLSearchParam("test", "initialValue")
    // );
    // expect(result.current).toBe("initialValue");

    const { result } = renderHook(() => useURLSearchParam("test"), {
      wrapper: Wrapper,
    });
    expect(result.current[0]).toBe("");
  });

  it("should return the updated value", async () => {
    const { result } = renderHook(() => useURLSearchParam("test"), {
      wrapper: Wrapper,
    });
    expect(result.current[0]).toBe("");
    await act(async () => {
      result.current[1]("newValue");
    });
    expect(result.current[0]).toBe("newValue");
  });

  it("should remove the parameter if its value is false", async () => {
    const { result } = renderHook(() => useURLSearchParam("test"), {
      wrapper: Wrapper,
    });
    await act(async () => {
      result.current[1]("newValue");
    });
    expect(result.current[0]).toBe("newValue");
    await act(async () => {
      result.current[1](false);
    });
    expect(result.current[0]).toBe("");
  });

  it("should not remove the parameter if its value is true", async () => {
    const { result } = renderHook(
      () => useURLSearchParam("test", "initialValue"),
      {
        wrapper: Wrapper,
      }
    );
    expect(result.current[0]).toBe("initialValue");
    await act(async () => {
      result.current[1]("newValue");
    });
    expect(result.current[0]).toBe("newValue");
    await act(async () => {
      result.current[1]();
    });
    expect(result.current[0]).toBe("initialValue");
  });

  it("should not remove the parameter if its value is null", async () => {
    const { result } = renderHook(() => useURLSearchParam("test", null), {
      wrapper: Wrapper,
    });
    expect(result.current[0]).toBe(null);
    await act(async () => {
      result.current[1]("newValue");
    });
    expect(result.current[0]).toBe("newValue");
    await act(async () => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(null);
  });

  it("should not remove the parameter if its value is undefined", async () => {
    const { result } = renderHook(() => useURLSearchParam("test", undefined), {
      wrapper: Wrapper,
    });
    expect(result.current[0]).toBe("");
    await act(async () => {
      result.current[1]("newValue");
    });
    expect(result.current[0]).toBe("newValue");
    await act(async () => {
      result.current[1]();
    });
    expect(result.current[0]).toBe("");
  });
});
