import { render, screen } from "@testing-library/react";
import { describe, vi, it, expect } from "vitest";
import UserForm from "./user-form";
import userEvent from "@testing-library/user-event";

describe("UserForm", () => {
  const setup = () => {
    const onSubbmit = vi.fn();
    render(<UserForm onSubmit={onSubbmit} />);
    return { onSubbmit };
  };

  it("should render all fields", () => {
    setup();

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Website")).toBeInTheDocument();
    expect(screen.getByLabelText("Company")).toBeInTheDocument();
  });

  it("should show validation errors", async () => {
    setup();

    // Submit empty form
    screen.getByRole("button", { name: /submit/i }).click();

    expect(await screen.findByText("Name is required")).toBeInTheDocument();
    expect(await screen.findByText("Email is required")).toBeInTheDocument();
    expect(await screen.findByText("Company is required")).toBeInTheDocument();
  });

  it("should submit form successfully", async () => {
    const { onSubbmit } = setup();
    vi.spyOn(window, "alert").mockImplementation(() => {});
    await userEvent.type(screen.getByPlaceholderText("Name*"), "John Doe");
    await userEvent.type(
      screen.getByPlaceholderText("Email*"),
      "john@test.com"
    );
    await userEvent.type(screen.getByPlaceholderText("Company*"), "Test Inc.");

    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(onSubbmit).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@test.com",
      phone: "",
      website: "",
      companyName: "Test Inc.",
    });
    expect(window.alert).toHaveBeenCalledWith("Form submitted successfully!");
  });

  it("should show error alert on submission failure", async () => {
    const onSubbmit = vi.fn().mockRejectedValue(new Error("Submission failed"));
    render(<UserForm onSubmit={onSubbmit} />);
    vi.spyOn(window, "alert").mockImplementation(() => {});

    await userEvent.type(screen.getByPlaceholderText("Name*"), "John Doe");
    await userEvent.type(
      screen.getByPlaceholderText("Email*"),
      "john@test.com"
    );
    await userEvent.type(screen.getByPlaceholderText("Company*"), "Test Inc.");
    await userEvent.click(screen.getByRole("button", { name: /submit/i }));

    expect(window.alert).toHaveBeenCalledWith(
      "Form submission failed. Please try again."
    );
  });

  it("should show validation errors for invalid website and phone", async () => {
    setup();

    await userEvent.type(screen.getByPlaceholderText("Website"), "a");
    await userEvent.type(screen.getByPlaceholderText("Phone"), "abc123");

    expect(await screen.findByText("Invalid URL")).toBeInTheDocument();
    expect(await screen.findByText("Invalid phone number")).toBeInTheDocument();
  });
});
