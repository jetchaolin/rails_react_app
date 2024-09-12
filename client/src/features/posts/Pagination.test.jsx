import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Pagination from "./Pagination";
describe("handle page change", () => {

  it("should skip handlePrevious if current page is 1", () => {
    const currentPage = 1;
    const handlePrevious = jest.fn();

    render(<Pagination
      totalPosts={100}
      postsPerPage={2}
      currentPage={currentPage}
      onPageChange={handlePrevious}
    />);

    const previousButton = screen.getByText("Previous");

    fireEvent.click(previousButton);

    expect(handlePrevious).toHaveBeenCalledTimes(0);
    expect(previousButton).toBeDisabled();
  });

  it("should check if the current page is bigger than 1 and handle previous", () => {
    const currentPage = 2;
    const handlePrevious = jest.fn();

    render(<Pagination
      totalPosts={100}
      postsPerPage={2}
      currentPage={currentPage}
      onPageChange={handlePrevious}
    />);

    const previousButton = screen.getByText("Previous");

    fireEvent.click(previousButton);

    expect(handlePrevious).toHaveBeenCalledTimes(1);
    expect(handlePrevious).toHaveBeenCalledWith(1);
  });


  it("should skip handleNext if current page is the last page", () => {
    const currentPage = 50;
    const handleNext = jest.fn();

    render(<Pagination
      totalPosts={100}
      postsPerPage={2}
      currentPage={currentPage}
      onPageChange={handleNext}
    />);

    const nextButton = screen.getByText("Next");

    fireEvent.click(nextButton);

    expect(handleNext).toHaveBeenCalledTimes(0);
    expect(nextButton).toBeDisabled();
  });

  it("should check if the current page is smaller than the total pages and handle next", () => {
    const currentPage = 2;
    const handleNext = jest.fn();

    render(<Pagination
      totalPosts={100}
      postsPerPage={2}
      currentPage={currentPage}
      onPageChange={handleNext}
    />);

    const nextButton = screen.getByText("Next");

    fireEvent.click(nextButton);

    expect(handleNext).toHaveBeenCalledTimes(1);
    expect(handleNext).toHaveBeenCalledWith(3);

  });
})

describe("getVisiblePageNumbers", () => {
  it("if the total pages is less than 10, it should render all pages without ellipsis", () => {
    const totalPosts = 20;
    const currentPage = 4;
    const ellipsis = "...";
    // const totalPages = Math.ceil(totalPosts / currentPage);

    render(<Pagination
      totalPosts={totalPosts}
      postsPerPage={2}
      currentPage={currentPage}
      onPageChange={jest.fn()}
    />);

    expect(screen.queryByText(ellipsis)).not.toBeInTheDocument();
  });

  it("if the current page is less than 6 it should render pages 1 to 8, ellipsis and total pages", () => {
    const currentPage = 6;
    const ellipsis = "...";
    const totalPosts = 40;
    const totalPages = totalPosts / 2;
    const nineShouldNotBeRendered = 9

    render(<Pagination
      totalPosts={totalPosts}
      postsPerPage={2}
      currentPage={currentPage}
      onPageChange={jest.fn()}
    />);

    expect(screen.queryByText(nineShouldNotBeRendered)).not.toBeInTheDocument();
    expect(screen.queryByText(ellipsis)).toBeInTheDocument();
    expect(screen.getByText(totalPages)).toBeInTheDocument();
  });

  it("if the current page is greater than totalPages - 5 it should render page 1, ellipsis and the last 9 pages", () => {
    const currentPage = 26;
    const ellipsis = "...";
    const totalPosts = 60;
    const pageOneShouldBeRendered = 1;
    const totalPages = totalPosts / 2;

    render(<Pagination
      totalPosts={totalPosts}
      postsPerPage={2}
      currentPage={currentPage}
      onPageChange={jest.fn()}
    />);

    expect(screen.queryByText(ellipsis)).toBeInTheDocument();
    expect(screen.queryByText(pageOneShouldBeRendered)).toBeInTheDocument();
    expect(screen.getByText(totalPages)).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(12);
  })

  it("should render the page 1, middle pages between ellipsis and total pages", () => {
    const currentPage = 8;
    const totalPosts = 40;
    const pageOneShouldBeRendered = 1;
    const totalPages = totalPosts / 2;

    render(<Pagination
      totalPosts={totalPosts}
      postsPerPage={2}
      currentPage={currentPage}
      onPageChange={jest.fn()}
    />);

    expect(screen.getByText(pageOneShouldBeRendered)).toBeInTheDocument();
    expect(screen.getByText(totalPages)).toBeInTheDocument();
    expect(screen.getAllByTestId("ellipsis")).toHaveLength(2);
  })

  it("should render the page list buttons and change pages with a click", () => {
    const currentPage = 8;
    const totalPosts = 40;
    const onPageChange = jest.fn();

    render(<Pagination
      totalPosts={totalPosts}
      postsPerPage={2}
      currentPage={currentPage}
      onPageChange={onPageChange}
    />);

    const pageNineButton = screen.getByText("9");

    fireEvent.click(pageNineButton);

    expect(pageNineButton).toBeInTheDocument();
    expect(onPageChange).toHaveBeenCalledTimes(1);
    expect(onPageChange).toHaveBeenCalledWith(9);
  })
})






