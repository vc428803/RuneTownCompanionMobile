import { ApiError, submitEvidence } from "@/api/client";
import SubmitEvidenceScreen from "@/app/submit-evidence";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { router } from "expo-router";

jest.mock("@/api/client", () => {
  const actual = jest.requireActual("@/api/client");

  return {
    ...actual,
    submitEvidence: jest.fn(),
  };
});

jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
  useLocalSearchParams: () => ({
    goalId: "goal-1",
    criterionId: "criterion-1",
  }),
}));

const mockSubmitEvidence = submitEvidence as jest.MockedFunction<
  typeof submitEvidence
>;
const mockReplace = router.replace as jest.MockedFunction<typeof router.replace>;

async function fillAndSubmit() {
  await fireEvent.changeText(
    screen.getByLabelText("標題"),
    "  Published article  ",
  );
  await fireEvent.changeText(
    screen.getByLabelText("描述"),
    "  The article is publicly available  ",
  );
  await fireEvent.changeText(
    screen.getByLabelText("來源"),
    "  publication-log  ",
  );
  await fireEvent.press(screen.getByText("提交"));
}

describe("Evidence submission", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits through the backend client and forwards its authoritative result", async () => {
    mockSubmitEvidence.mockResolvedValue({
      accepted: true,
      goalId: "goal-1",
      criterionId: "criterion-1",
      criterionCompleted: true,
      goalStatus: "READY_TO_COMPLETE",
    });
    await render(<SubmitEvidenceScreen />);

    await fillAndSubmit();

    await waitFor(() =>
      expect(mockSubmitEvidence).toHaveBeenCalledWith(
        "goal-1",
        "criterion-1",
        {
          title: "Published article",
          description: "The article is publicly available",
          source: "publication-log",
        },
      ),
    );
    expect(mockReplace).toHaveBeenCalledWith({
      pathname: "/submit-result",
      params: {
        accepted: "true",
        criterionCompleted: "true",
        criterionId: "criterion-1",
        goalId: "goal-1",
        goalStatus: "READY_TO_COMPLETE",
      },
    });
  });

  it("keeps local input intact and does not navigate after duplicate Evidence", async () => {
    mockSubmitEvidence.mockRejectedValue(
      new ApiError("這個 Criterion 已經完成，無法重複提交。", 409),
    );
    await render(<SubmitEvidenceScreen />);

    await fillAndSubmit();

    expect(
      await screen.findByText("這個 Criterion 已經完成，無法重複提交。"),
    ).toBeTruthy();
    expect(screen.getByDisplayValue("Published article")).toBeTruthy();
    expect(
      screen.getByDisplayValue("The article is publicly available"),
    ).toBeTruthy();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
