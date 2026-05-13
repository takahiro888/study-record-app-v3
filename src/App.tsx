import { useEffect, useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
} from "@chakra-ui/react";
import "./App.css";
import {
  getAllRecords,
  addRecord,
  deleteRecord,
} from "./utils/supabaseFunctions";
import { Record } from "./domain/record";
import { useForm, type SubmitHandler } from "react-hook-form";

type Inputs = {
  title: string;
  time: number;
};
function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [studyTitle, setStudyTitle] = useState("");
  const [studyTime, setStudyTime] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const getRecords = async () => {
      setIsLoading(true); // ①読み込み開始！
      const records = await getAllRecords();
      setRecords(records);
      setIsLoading(false); // ②読み込み終了！
    };
    getRecords();
  }, []);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await addRecord(data.title, data.time);
    const updatedRecords = await getAllRecords();
    setRecords(updatedRecords);
    reset();
    setIsOpen(false);
    setStudyTitle("");
    setStudyTime(0);
    setError("");
  };
  // const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) =>
  //   setStudyTitle(event.target.value);
  // const onChangeTime = (event: React.ChangeEvent<HTMLInputElement>) =>
  //   setStudyTime(Number(event.target.value));

  // const onClickAdd = async () => {
  //   if (studyTitle === "" || studyTime === 0) {
  //     setError("入力されていない項目があります");
  //     return;
  //   }

  //   await addRecord(studyTitle, Number(studyTime));

  //   // データベースから最新のデータを再取得
  //   const updatedRecords = await getAllRecords();
  //   setRecords(updatedRecords);

  //   setStudyTitle("");
  //   setStudyTime(0);
  //   setError("");
  // };

  const onClickDelete = async (id) => {
    await deleteRecord(id);
    const newRecords = records.filter((record) => record.id !== id);
    setRecords(newRecords);
  };
  const totalTime = records.reduce((total, record) => {
    return total + record.time;
  }, 0);

  if (isLoading) {
    return <div style={{}}>Loading...</div>;
  }

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
        <div className="App">
          <h1 data-testid="title">学習記録一覧</h1>
          <p>合計学習時間：{totalTime}/1000(h)</p>

          <p> 最近の記録</p>
          <Dialog.Trigger asChild>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
              新規登録
            </Button>
          </Dialog.Trigger>

          <div>
            <p>入力されている学習内容:{studyTitle}</p>
            <p>入力されている時間:{studyTime}時間</p>
          </div>
          {records.map((record, index) => (
            <div key={index} data-testid="study-record">
              <p>
                {record.title} {record.time}時間
              </p>
              <Button
                data-testid="button-delete"
                onClick={() => onClickDelete(record.id)}
              >
                削除
              </Button>
            </div>
          ))}
          {/* <button data-testid="button-add" onClick={onClickAdd}>
            登録 過去
          </button> */}

          {error && (
            <p style={{ color: "red" }} data-testid="error-message">
              {error}
            </p>
          )}
        </div>

        {/* モーダル */}

        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>新規登録</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                {/* <div>
                  <p>◾️学習内容</p>
                  <input
                    data-testid="input-title"
                    value={studyTitle}
                    onChange={onChangeTitle}
                  />
                </div>
                <div>
                  <p>◾️学習記録</p>
                  <input
                    data-testid="input-time"
                    type="number"
                    value={studyTime}
                    onChange={onChangeTime}
                  />
                  時間
                </div> */}
                <form id="study-form" onSubmit={handleSubmit(onSubmit)}>
                  <Field.Root invalid={!!errors.title}>
                    <Field.Label>学習内容</Field.Label>
                    <Input
                      {...register("title", {
                        required: "内容の入力は必須です",
                      })}
                    />
                    <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
                  </Field.Root>

                  <Field.Root invalid={!!errors.time}>
                    <Field.Label>学習時間</Field.Label>
                    <Input
                      type="number"
                      {...register("time", {
                        required: "時間の入力は必須です",
                        min: {
                          value: 0,
                          message: "時間は0以上である必要があります",
                        },
                      })}
                    />
                    <Field.ErrorText>{errors.time?.message}</Field.ErrorText>
                  </Field.Root>
                </form>
              </Dialog.Body>
              <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                  <Button variant="outline">キャンセル</Button>
                </Dialog.ActionTrigger>
                <Button type="submit" form="study-form">
                  登録する
                </Button>
              </Dialog.Footer>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
}

export default App;
