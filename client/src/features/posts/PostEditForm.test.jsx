import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { act } from "react";
import PostEditForm from "./PostEditForm";
import { updatePost, fetchPost } from "../../services/postService";
import { objectToFormData } from "../../Utils/formDataHelper";

jest.mock("../../services/postService", () => ({
   // Gonna need to return an id, title, body
   updatePost: jest.fn(),
   fetchPost: jest.fn(),
}));

describe("PostEditForm component", () => {
   const mockPost = {
      title: "Original Post Title",
      body: "Original Post Body.",
   };

   beforeEach(() => {
      fetchPost.mockResolvedValue(mockPost);
   });

   afterEach(() => {
      jest.clearAllMocks();
   });

   const renderForm = () =>
      render(
         <MemoryRouter initialEntries={["/posts/1/edit"]}>
            <Routes>
               <Route path="/posts/:id/edit" element={<PostEditForm />} />
               <Route path="/posts/:id" element={<h1>Post Detail</h1>} />
            </Routes>
         </MemoryRouter>
      );

   it("should render the PostEditForm component", async () => {
      renderForm();

      await waitFor(() => {
         expect(fetchPost).toHaveBeenCalledTimes(1);
      });

      expect(screen.getByDisplayValue(mockPost.title)).toBeInTheDocument();
      expect(screen.getByDisplayValue(mockPost.body)).toBeInTheDocument();
   });

   it("successfully updates the post and redirects", async () => {
      renderForm();

      await waitFor(() => {
         expect(fetchPost).toHaveBeenCalledTimes(1);
      });

      const newPost = {
         title: "New Post Title",
         body: "New Post Body.",
         image: null,
      };

      const formData = objectToFormData({ post: newPost });

      fireEvent.change(screen.getByLabelText(/Title:/i), {
         target: { value: newPost.title },
      });

      fireEvent.change(screen.getByLabelText(/Body:/i), {
         target: { value: newPost.body },
      });

      // fireEvent.change(screen.getByLabelText(/Image:/i), {
      //    target: { files: "null" },
      // });

      await act(async () => {
         fireEvent.click(screen.getByText(/Update Post/i));
      });

      await waitFor(() => {
         expect(updatePost).toHaveBeenCalledTimes(1);
         expect(updatePost).toHaveBeenCalledWith("1", formData);
      });

      expect(screen.getByText("Post Detail")).toBeInTheDocument();
   });

   it("shows a console error and update failure", async () => {
      updatePost.mockRejectedValue(new Error("Update failed"));

      const consoleSpy = jest.spyOn(console, "error");
      consoleSpy.mockImplementation(jest.fn());

      renderForm();

      await waitFor(() => {
         fireEvent.click(screen.getByText(/Update Post/i));
      });

      await waitFor(() => {
         expect(updatePost).toHaveBeenCalledTimes(1);
      });

      expect(consoleSpy).toHaveBeenCalledWith(
         "Failed to update post: ",
         Error("Update failed")
      );
   });

   it("shows a console error and fetch failure", async () => {
      const expectedError = new Error("Fetch failed");
      fetchPost.mockRejectedValue(expectedError);

      const consoleSpy = jest.spyOn(console, "error");
      consoleSpy.mockImplementation(jest.fn());

      renderForm();

      await waitFor(() => {
         expect(fetchPost).toHaveBeenCalledTimes(1);
      });

      expect(consoleSpy).toHaveBeenCalledWith(
         "Failed to fetch the post: ",
         expectedError
      );

      consoleSpy.mockRestore();
   });
});