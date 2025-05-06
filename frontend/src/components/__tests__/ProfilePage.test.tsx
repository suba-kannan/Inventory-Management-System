import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProfilePage from "../ProfilePage"; // adjust the path if needed
import axios from "axios";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ProfilePage", () => {
  const mockProfile = {
    id: 1,
    name: "Test User",
    email: "test@example.com",
    phone: "1234567890",
    role: "user",
  };

  beforeEach(() => {
    localStorage.setItem("token", "mock-token");
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test("renders profile after fetch", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProfile });

    render(<ProfilePage />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    expect(await screen.findByText("My Profile")).toBeInTheDocument();
    expect(screen.getByText(mockProfile.name)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.email)).toBeInTheDocument();
    expect(screen.getByText(mockProfile.phone)).toBeInTheDocument();
    expect(screen.getByText("********")).toBeInTheDocument();
  });

  test("enters edit mode and updates name", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockProfile });

    render(<ProfilePage />);
    await screen.findByText("My Profile");

    fireEvent.click(screen.getByText("Edit Profile"));

    const nameInput = screen.getByDisplayValue(mockProfile.name);
    fireEvent.change(nameInput, { target: { value: "Updated User" } });

    mockedAxios.put.mockResolvedValueOnce({
      data: { ...mockProfile, name: "Updated User" },
    });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(screen.getByText("Updated User")).toBeInTheDocument();
    });
  });

  test("handles fetch error", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Failed"));

    render(<ProfilePage />);
    expect(await screen.findByText("Failed to fetch profile")).toBeInTheDocument();
  });
});
