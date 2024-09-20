import { renderHook, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";
import usePostsData from "./usePostsData";
import * as postService from "../services/postService";
import { act } from "react";

jest.mock("../services/postService", () => ({
  fetchAllPosts: jest.fn(),
  searchPosts: jest.fn(),
}));

describe("usePostsData", () => {
  const mockPosts = [
    { id: 1, title: "Post 1", image: null, body: "Hello World" },
    {
      id: 2,
      title: "Post 2",
      image: "https://via.placeholder.com/150",
      body: "Hello World",
    },
  ];

  const mockResponse = {
    posts: mockPosts,
    total_count: 2,
    per_page: 2,
  };

  beforeEach(() => {
    postService.fetchAllPosts.mockResolvedValue(mockResponse);
    postService.searchPosts.mockResolvedValue(mockResponse.posts[0]);
  });

  const Wrapper = ({ children }) => <Router>{children}</Router>;

  it("should return posts and totalPosts", async () => {
    const { result } = renderHook(() => usePostsData(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.posts).toEqual(mockPosts);
      expect(result.current.totalPosts).toEqual(2);
    });
  });

  it("should not fetch posts", async () => {
    // TODO: Fix this test
    // const { result } = renderHook(() => usePostsData(), { wrapper: Wrapper });
    // await act(async () => {
    //   result.current.posts = [mockPosts[0]];
    // });
    // await waitFor(() => expect(result.current.totalPosts).toEqual(1));
  });

  it("should set error and log it", async () => {
    const error = new Error("An error occurred!");
    const spy = jest.spyOn(console, "error");

    spy.mockImplementation(() => {});
    postService.fetchAllPosts.mockRejectedValue(error);

    const { result } = renderHook(() => usePostsData(), { wrapper: Wrapper });

    await waitFor(() => {
      expect(result.current.error).toEqual(error);
      expect(spy).toHaveBeenCalledWith("Failed to fetch posts: ", error);
    });
  });
});
