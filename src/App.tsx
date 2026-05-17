import { useEffect, useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  HStack,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import { TfiTime } from "react-icons/tfi";
import "./App.css";
import {
  getAllRecords,
  addRecord,
  deleteRecord,
} from "./utils/supabaseFunctions";
import { Record } from "./domain/record";
import { useForm, type SubmitHandler } from "react-hook-form";
import { IoBookOutline } from "react-icons/io5";

type Inputs = {
  title: string;
  time: number;
};
function App() {
  const [records, setRecords] = useState<Record[]>([]);
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

  const onClickDelete = async (id: number) => {
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
      <div className="App">
        <h1 data-testid="title" style={{ fontWeight: "bold" }}>
          学習記録一覧
        </h1>
        <p>合計学習時間：{totalTime}/1000(h)</p>

        <HStack justify="space-between" align="center" mb={4} w="100%">
          <HStack style={{ fontSize: "1.2rem" }}>
            <IoBookOutline />
            <p style={{ margin: 0, fontWeight: "bold" }}> 最近の記録</p>
          </HStack>
          <Dialog.Root
            open={isOpen}
            onOpenChange={({ open }) => setIsOpen(open)}
          >
            <Dialog.Trigger asChild>
              <Button size="sm" marginRight={2} onClick={() => setIsOpen(true)}>
                新規登録
              </Button>
            </Dialog.Trigger>

            {/* <div>
            <p>入力されている学習内容:{studyTitle}</p>
            <p>入力されている時間:{studyTime}時間</p>
          </div> */}

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
                        <Field.ErrorText>
                          {errors.title?.message}
                        </Field.ErrorText>
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
                        <Field.ErrorText>
                          {errors.time?.message}
                        </Field.ErrorText>
                      </Field.Root>
                    </form>
                  </Dialog.Body>
                  <Dialog.Footer>
                    <Dialog.ActionTrigger asChild>
                      <Button variant="outline">キャンセル</Button>
                    </Dialog.ActionTrigger>
                    <Button type="submit" form="study-form" colorPalette="blue">
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
        </HStack>

        <VStack
          w="100%"
          bg="white" // 薄いグレーの背景色（お手本のような白ベースにしたい場合は "white" でもOK）
          borderRadius="lg" // 角の丸み（ラージ）
          border="1px solid" // 枠線
          borderColor="gray.200" // 枠線の色
          p={2} // 内側の余白
          gap={0} // 要素間のデフォルトの隙間をゼロにして区切り線が綺麗に見えるように
          boxShadow="sm" // お好みで：うっすらと影をつける
        >
          {records.map((record, index) => (
            <HStack
              key={index}
              data-testid="study-record"
              align="center" // 上下の中心線を揃える
              borderBottom="1px solid" // （お好みで）レコードの区切り線
              borderColor="gray.200" // （お好みで）線の色
              p={3} // （お好みで）上下左右の余白
              w="100%" // 横幅いっぱいに広げる
              gap={4} // テキストとボタンの間のスペース
            >
              <div
                style={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TfiTime />
              </div>
              <p style={{ margin: 0 }}>{record.title}</p>
              <Spacer />
              <p style={{ margin: 0, whiteSpace: "nowrap" }}>
                {record.time}時間
              </p>
              <div style={{ whiteSpace: "nowrap" }}>
                <Button size="sm" onClick={() => onClickDelete(record.id)}>
                  編集
                </Button>
                <Button
                  data-testid="button-delete"
                  size="sm"
                  marginLeft={1}
                  onClick={() => onClickDelete(record.id)}
                >
                  削除
                </Button>
              </div>
            </HStack>
          ))}
        </VStack>
        {/* <button data-testid="button-add" onClick={onClickAdd}>
            登録 過去
          </button> */}

        {error && (
          <p style={{ color: "red" }} data-testid="error-message">
            {error}
          </p>
        )}
      </div>
    </>
  );
}

export default App;
