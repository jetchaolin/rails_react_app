import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PostsList from "./PostsList";
import * as postsService from "../../services/postService";
import usePostsData from "../../hooks/usePostsData";

jest.mock("../../hooks/usePostsData", () => {
   return {
      __esModule: true,
      default: jest.fn(),
   }
});

jest.mock("../../constants", () => ({
   API_URL: "http://your-test-api-url",
}));

jest.mock("../../services/postService", () => ({
   fetchAllPosts: jest.fn(),
   deletePost: jest.fn(),
}));

global.console.error = jest.fn();

describe("PostsList component", () => {

   const mockPosts = [
      { id: 1, title: "Post 1", image: null, body: "Hello World" },
      { id: 2, title: "Post 2", image: "https://via.placeholder.com/150", body: "Hello World" },
   ];

   beforeEach(() => {
      usePostsData.mockReturnValue({
         posts: mockPosts,
      });
      postsService.deletePost.mockResolvedValue();
   });

   test("renders the list of posts", async () => {
      render(<PostsList />, { wrapper: MemoryRouter });

      await waitFor(() => screen.getByText("Post 1"));

      expect(screen.getByText("Post 1")).toBeInTheDocument();
      expect(screen.getByText("Post 2")).toBeInTheDocument();
   });

   test("should handle immediate changes", async () => {
      const setSearchTerm = jest.fn();

      render(<PostsList />, { wrapper: MemoryRouter });

      const searchBox = screen.getByPlaceholderText("Search...");

      fireEvent.change(searchBox, {
         target: { value: "2" },
      })

      expect(searchBox).toHaveValue("2");
      waitFor(() => {
         expect(setSearchTerm).toHaveBeenCalledTimes(1);
      })
   });

   test("should change searchValue after 500ms", async () => {
      const debouncedSearchTerm = jest.fn();
      const setDebouncedSearchTerm = jest.fn();

      render(<PostsList />, { wrapper: MemoryRouter });

      const searchBox = screen.getByPlaceholderText("Search...");

      fireEvent.change(searchBox, {
         target: { value: "2" },
      })

      waitFor(() => {
         expect(debouncedSearchTerm).toHaveBeenCalledTimes(1);
         expect(debouncedSearchTerm).toHaveBeenLastCalledWith("2");
         expect(setDebouncedSearchTerm).toHaveBeenCalledTimes(1);
         expect(setDebouncedSearchTerm).toHaveBeenLastCalledWith("2");
      })
   });

   test("should handle page change", async () => {
      const currentPage = 1;
      const setCurrentPage = jest.fn();
      const searchParams = jest.fn();

      render(<PostsList />, { wrapper: MemoryRouter });

      const nextButton = screen.getByText("Next");
      fireEvent.click(nextButton);

      waitFor(() => {
         expect(setCurrentPage).toHaveBeenCalledTimes(1);
         expect(setCurrentPage).toHaveBeenCalledWith(currentPage + 1);
         expect(searchParams).toHaveBeenCalledWith({ page: currentPage + 1 });
      })
   });

   test("deletes a post when delete button is clicked", async () => {
      render(<PostsList />, { wrapper: MemoryRouter });

      const postText = "Post 1";
      await waitFor(() => screen.getByText(postText));

      fireEvent.click(screen.getAllByText("Delete")[0]);

      await waitFor(() => expect(postsService.deletePost).toHaveBeenCalled());

      expect(screen.queryByText(postText)).not.toBeInTheDocument();
   });

   test("logs error when fetching posts fails", async () => {
      // "Failed to fetch posts:", e => An error occurred!
      // const error = new Error("An error occurred!");
      // const result = console.error("Failed to fetch posts: ", e);
      // const consoleSpy = jest.spyOn(console, "error");
      // consoleSpy.mockImplementation(jest.fn());
      usePostsData.mockReturnValue({
         posts: [],
         loading: false,
         error: new Error("Fetch failed"),
         totalPosts: 0,
         perPage: 2,
      });

      render(<PostsList />, { wrapper: MemoryRouter });

      await waitFor(() => {
         // TODO: spy on the console instead of mocking it
         expect(screen.getByText("Error loading posts.")).toBeInTheDocument();
      });
   });

   test("logs error when deleting a post fails", async () => {
      usePostsData.mockReturnValue({
         posts: mockPosts,
      });
      const deleteError = new Error("Delete failed!");
      postsService.deletePost.mockRejectedValue(deleteError);

      render(<PostsList />, { wrapper: MemoryRouter });

      await waitFor(() => screen.getByText("Post 1"));

      fireEvent.click(screen.getAllByText("Delete")[0]);
      await waitFor(() => {
         expect(console.error).toHaveBeenCalledWith(
            "Failed to delete post: ",
            deleteError
         );
      });
   });

   // test("checks if post has an image and displays it if it does", async () => {
   //    render(<PostsList />, { wrapper: MemoryRouter });

   //    await waitFor(() => screen.getByText("Post 1"));
   //    await waitFor(() => screen.getByText("Post 2"));

   //    expect(screen.queryByAltText("Post 1")).not.toBeInTheDocument();
   //    expect(screen.getByAltText("Post 2")).toBeInTheDocument();
   // });
});

describe("PostsList component image_url rendering", () => {
   const mockPostWithImageUrl = [
      {
         id: 1,
         title: "Post with Image",
         body: "Hello Image",
         image_url: "https://via.placeholder.com/150",
      },
   ];

   const mockPostWithoutImageUrl = [
      {
         id: 2,
         title: "Post without Image",
         body: "Hello Placeholder",
         image_url: null,
      },
   ];

   test("renders the image with image_url exists", async () => {
      usePostsData.mockReturnValue({
         posts: mockPostWithImageUrl,
      });

      render(<PostsList />, { wrapper: MemoryRouter });

      await waitFor(() => screen.getByText(mockPostWithImageUrl[0].title));

      const imgElement = screen.getByAltText(mockPostWithImageUrl[0].title);
      expect(imgElement).toBeInTheDocument();
      expect(imgElement.src).toBe(mockPostWithImageUrl[0].image_url);
   });

   test("renders the placeholder div when image_url does not exist", async () => {
      usePostsData.mockReturnValue({
         posts: mockPostWithoutImageUrl,
      });

      render(<PostsList />, { wrapper: MemoryRouter });

      await waitFor(() => screen.getByText(mockPostWithoutImageUrl[0].title));

      const placeholderDiv = screen.getByTestId("post-image-stub");
      expect(placeholderDiv).toBeInTheDocument();
   });

   test("handleImmediateChange", async () => {

   })
});