import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchBar from "./SearchBar";
import React from "react";


describe("SearchBar component", () => {

  it("should handle event change", () => {
    const onSearchTextChange = jest.fn();
    const onImmediateChange = jest.fn();
    const searchValue = "";

    render(<SearchBar
      searchTerm={searchValue}
      onSearchTextChange={onSearchTextChange}
      onImmediateChange={onImmediateChange}
    />);

    const input = screen.getByPlaceholderText("Search...");

    fireEvent.change(input, { target: { value: "test" } });

    waitFor(() => {
      expect(onSearchTextChange).toHaveBeenCalledTimes(1);
      expect(onSearchTextChange).toHaveBeenCalledWith("test");
    });
  })

  it("should handle immediate change", () => {
    const onSearchTextChange = jest.fn();
    const onImmediateChange = jest.fn();
    const searchValue = "";

    render(<SearchBar
      searchTerm={searchValue}
      onSearchTextChange={onSearchTextChange}
      onImmediateChange={onImmediateChange}
    />);

    const input = screen.getByPlaceholderText("Search...");

    fireEvent.change(input, { target: { value: "test" } });
    fireEvent.change(input, { target: { value: "" } });

    waitFor(() => {
      expect(onImmediateChange).toHaveBeenCalledTimes(1);
      expect(onImmediateChange).toHaveBeenCalledWith("");
    });
  });

  it("should clear timeout", async () => {
    const timeout = setTimeout(() => { }, 300000);
    jest
      .spyOn(React, 'useRef')
      .mockReturnValue({
        current:
          timeout
      });
    jest.spyOn(global, "clearTimeout");

    const onSearchTextChange = jest.fn();
    const onImmediateChange = jest.fn();
    const searchValue = "";

    render(<SearchBar
      searchTerm={searchValue}
      onSearchTextChange={onSearchTextChange}
      onImmediateChange={onImmediateChange}
    />);

    const input = screen.getByPlaceholderText("Search...");

    fireEvent.change(input, { target: { value: "test" } });

    waitFor(() => {
      expect(clearTimeout).toHaveBeenCalledWith(timeout);
    });
  })

  it("should not clear timeout", async () => {
    const timeout = setTimeout(() => { }, null);
    jest
      .spyOn(React, 'useRef')
      .mockReturnValue({
        current:
          timeout
      });
    jest.spyOn(global, "clearTimeout");

    const onSearchTextChange = jest.fn();
    const onImmediateChange = jest.fn();
    const searchValue = "";

    render(<SearchBar
      searchTerm={searchValue}
      onSearchTextChange={onSearchTextChange}
      onImmediateChange={onImmediateChange}
    />);

    const input = screen.getByPlaceholderText("Search...");

    fireEvent.change(input, { target: { value: "test" } });

    expect(onImmediateChange).toHaveBeenCalledTimes(1);
    expect(onImmediateChange).toHaveBeenCalledWith("test");
    expect(clearTimeout).toHaveBeenCalledTimes(1);
    expect(clearTimeout).toHaveBeenCalledWith(timeout);
    expect(input.value).toEqual("");

  })

  it("should set timeout", async () => {
    const onSearchTextChange = jest.fn();
    const onImmediateChange = jest.fn();
    const searchValue = "";

    render(<SearchBar
      searchTerm={searchValue}
      onSearchTextChange={onSearchTextChange}
      onImmediateChange={onImmediateChange}
    />);

    const input = screen.getByPlaceholderText("Search...");

    fireEvent.change(input, { target: { value: "test" } });
    await screen.findByPlaceholderText("Search...");
    fireEvent.change(input, { target: { value: "test2" } });

    expect(onSearchTextChange).toHaveBeenCalledTimes(0);
    waitFor(() => {
      expect(onSearchTextChange).toHaveBeenCalledTimes(1);
      expect(onSearchTextChange).toHaveBeenCalledWith("test");
    })
  })
})