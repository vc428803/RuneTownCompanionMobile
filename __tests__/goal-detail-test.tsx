import { ApiError, completeGoal, getGoal } from "@/api/client";
import { GoalDetail } from "@/api/contracts";
import GoalDetailScreen from "@/app/goal-detail";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react-native";

jest.mock("@/api/client", () => {
  const actual = jest.requireActual("@/api/client");

  return {
    ...actual,
    completeGoal: jest.fn(),
    getGoal: jest.fn(),
  };
});

jest.mock("expo-router", () => {
  const React = jest.requireActual("react");

  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
    router: { push: jest.fn() },
    useFocusEffect: (effect: () => void | (() => void)) => {
      React.useEffect(effect, [effect]);
    },
    useLocalSearchParams: () => ({ goalId: "goal-1" }),
  };
});

const mockCompleteGoal = completeGoal as jest.MockedFunction<
  typeof completeGoal
>;
const mockGetGoal = getGoal as jest.MockedFunction<typeof getGoal>;

const readyGoal: GoalDetail = {
  goalId: "goal-1",
  title: "Ship mobile MVP",
  lifeArchetype: "TECHNOMANCER",
  goalStatus: "READY_TO_COMPLETE",
  criteria: [
    {
      criterionId: "criterion-1",
      description: "Connect completion API",
      completed: true,
    },
  ],
};

async function openCompletionDialog() {
  await render(<GoalDetailScreen />);

  await fireEvent.press(await screen.findByText("完成目標"));
  await fireEvent.press(screen.getByText("確認完成"));
}

describe("Goal completion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetGoal.mockResolvedValue(readyGoal);
  });

  it("promotes the Goal to COMPLETED after a successful request", async () => {
    mockCompleteGoal.mockResolvedValue({
      goalId: readyGoal.goalId,
      goalStatus: "COMPLETED",
    });

    await openCompletionDialog();

    expect(await screen.findByText("目標已完成")).toBeTruthy();
    expect(screen.queryByText("完成目標")).toBeNull();
    expect(mockCompleteGoal).toHaveBeenCalledTimes(1);
    expect(mockCompleteGoal).toHaveBeenCalledWith(readyGoal.goalId);
  });

  it("keeps the confirmation available and shows the 404 error", async () => {
    const message = "此 Goal 已不存在或無法取得。";
    mockCompleteGoal.mockRejectedValue(new ApiError(message, 404));

    await openCompletionDialog();

    expect(await screen.findByText(message)).toBeTruthy();
    expect(screen.getByText("確認完成")).toBeTruthy();
    expect(mockGetGoal).toHaveBeenCalledTimes(1);
  });

  it("refreshes authoritative Goal state after a 409 conflict", async () => {
    const refreshedGoal: GoalDetail = {
      ...readyGoal,
      goalStatus: "PAUSED",
    };
    const message = "Goal 狀態已變更，目前無法完成。已重新同步最新狀態。";
    mockGetGoal
      .mockResolvedValueOnce(readyGoal)
      .mockResolvedValueOnce(refreshedGoal);
    mockCompleteGoal.mockRejectedValue(new ApiError(message, 409));

    await openCompletionDialog();

    expect(await screen.findByText(message)).toBeTruthy();
    await waitFor(() => expect(mockGetGoal).toHaveBeenCalledTimes(2));
    expect(await screen.findByText("PAUSED")).toBeTruthy();
    expect(screen.queryByText("完成目標")).toBeNull();
  });

  it("recovers from a network failure without changing Goal state", async () => {
    const message = "無法連線至 API。";
    mockCompleteGoal.mockRejectedValue(new ApiError(message, null));

    await openCompletionDialog();

    expect(await screen.findByText(message)).toBeTruthy();
    expect(screen.getByText("READY_TO_COMPLETE")).toBeTruthy();
    expect(screen.getByText("確認完成")).toBeTruthy();

    await fireEvent.press(screen.getByText("確認完成"));
    await waitFor(() => expect(mockCompleteGoal).toHaveBeenCalledTimes(2));
  });
});
