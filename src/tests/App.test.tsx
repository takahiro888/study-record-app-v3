import App from "@/App";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  getAllRecords,
  addRecord,
  deleteRecord,
} from "@/utils/supabaseFunctions";

// モジュールをモック化(Supabase通信をモック化)
vi.mock("@/utils/supabaseFunctions", () => ({
  getAllRecords: vi.fn(),
  addRecord: vi.fn(),
  deleteRecord: vi.fn(),
}));

// 型キャスト(TypeScriptにモック関数だと認識させる)
const mockGetAllRecords = getAllRecords as ReturnType<typeof vi.fn>;
const mockAddRecord = addRecord as ReturnType<typeof vi.fn>;
// const mockUpdateRecord = updateRecord as ReturnType<typeof vi.fn>;
const mockDeleteRecord = deleteRecord as ReturnType<typeof vi.fn>;

// テスト用のサンプルデータ
const mockRecords = [
  { id: 1, title: "React勉強", time: 2, created_at: "2024-01-01T00:00:00Z" },
  { id: 2, title: "Supabase勉強", time: 1, created_at: "2024-01-02T00:00:00Z" },
];

// Chakra UIのProviderでラップするrender
const renderApp = () =>
  render(
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>,
  );

beforeEach(() => {
  // 各テスト前にモックをリセット&初期データをセット
  vi.clearAllMocks();
  mockGetAllRecords.mockResolvedValue(mockRecords);
  mockAddRecord.mockResolvedValue(undefined);
  mockDeleteRecord.mockResolvedValue(undefined);
});

// テストケース
describe("App", () => {
  it("ローディング画面が表示される", () => {
    // getAllRecordsをずっと解決しないPromiseにする
    mockGetAllRecords.mockReturnValue(new Promise(() => {}));
    renderApp();
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("タイトルが表示される", async () => {
    renderApp();
    await waitFor(() =>
      expect(screen.getByTestId("title")).toBeInTheDocument(),
    );
  });

  it("レコード一覧が表示される", async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByText("React勉強")).toBeInTheDocument();
      expect(screen.getByText("Supabase勉強")).toBeInTheDocument();
    });
  });

  it("新規登録ボタンが表示される", async () => {
    renderApp();
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "新規登録" })).toBeInTheDocument(),
    );
  });

  it("新規登録ボタンを押すとモーダルが開き、タイトルが「新規登録」になる", async () => {
    renderApp();
    await waitFor(() => screen.getByText("新規登録"));
    await userEvent.click(screen.getByText("新規登録"));
    // モーダルのタイトルが「新規登録」
    expect(screen.getAllByText("新規登録").length).toBeGreaterThan(1);
  });

  it("学習内容を入力せずに登録するとエラーが出る", async () => {
    renderApp();
    await waitFor(() => screen.getByText("新規登録"));
    await userEvent.click(screen.getByText("新規登録"));
    await userEvent.click(screen.getByText("登録する"));
    await waitFor(() =>
      expect(screen.getByText("内容の入力は必須です")).toBeInTheDocument(),
    );
  });
  it("学習内容を入力せずに登録するとエラーが出る", async () => {
    renderApp();
    await waitFor(() => screen.getByText("新規登録"));
    await userEvent.click(screen.getByText("新規登録"));
    //学習内容だけ入力
    await userEvent.type(screen.getByLabelText("学習内容"), "React");
    // 時間フィールドをクリア（初期値0を消す）
    fireEvent.change(screen.getByLabelText("学習時間"), { target: { value: "" } });
    await userEvent.click(screen.getByText("登録する"));
    await waitFor(() =>
      expect(screen.getByText("時間の入力は必須です")).toBeInTheDocument(),
    );
  });

  it("学習時間に0以下を入力するとエラーが出る", async () => {
    renderApp();
    await waitFor(() => screen.getByText("新規登録"));
    await userEvent.click(screen.getByText("新規登録"));
    await userEvent.type(screen.getByLabelText("学習内容"), "React");
    fireEvent.change(screen.getByLabelText("学習時間"), {
      target: { value: "-1" },
    });
    await userEvent.click(screen.getByText("登録する"));
    await waitFor(() =>
      expect(
        screen.getByText("時間は0以上である必要があります"),
      ).toBeInTheDocument(),
    );
  });

  it("登録できること", async () => {
    renderApp();
    await waitFor(() => screen.getByText("新規登録"));
    await userEvent.click(screen.getByText("新規登録"));
    await userEvent.type(screen.getByLabelText("学習内容"), "React");
    await userEvent.type(screen.getByLabelText("学習時間"), "2");
    await userEvent.click(screen.getByText("登録する"));
    // addRecordが呼ばれていること
    await waitFor(() =>
      expect(mockAddRecord).toHaveBeenCalledWith("React", "2"),
    );
  });

  it("削除できること", async () => {
    renderApp();
    await waitFor(() => screen.getByText("Supabase勉強"));
    const deleteButtons = screen.getAllByTestId("button-delete");
    await userEvent.click(deleteButtons[0]);
    await waitFor(() => expect(mockDeleteRecord).toHaveBeenCalledWith(1));
  });
});
