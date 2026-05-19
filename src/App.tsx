import { useEffect, useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  HStack,
  VStack,
} from "@chakra-ui/react";

import "./App.css";
import {
  getAllRecords,
  addRecord,
  updateRecord,
  deleteRecord,
} from "./utils/supabaseFunctions";
import { Record } from "./domain/record";
import { useForm, type SubmitHandler } from "react-hook-form";
import { IoBookOutline } from "react-icons/io5";
import { RecordItem } from "./components/molecules/RecordItem";
import { LuPlus } from "react-icons/lu";

type Inputs = {
  title: string;
  time: number;
};
function App() {
  const [records, setRecords] = useState<Record[]>([]);
  const [editingRecord, setEditingRecord] = useState<Record | null>(null);
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
    if (editingRecord === null) {
      await addRecord(data.title, data.time);
    } else {
      await updateRecord(editingRecord.id, data.title, data.time);
    }
    const updatedRecords = await getAllRecords();
    setRecords(updatedRecords);
    reset();
    setIsOpen(false);
    setError("");
  };

  const onClickNew = () => {
    setEditingRecord(null);
    reset({ title: "", time: 0 });
    setIsOpen(true);
  };
  const onClickEdit = (record: Record) => {
    setEditingRecord(record);
    reset({ title: record.title, time: record.time });
    setIsOpen(true);
  };
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
            <Button
              size="sm"
              marginRight={2}
              colorPalette="green"
              borderRadius="full"
              onClick={() => onClickNew()}
            >
              <LuPlus />
              新規登録
            </Button>

            {/* モーダル */}
            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content>
                  <Dialog.Header>
                    <Dialog.Title style={{ fontWeight: "bold" }}>
                      {editingRecord ? "記録編集" : "新規登録"}
                    </Dialog.Title>
                  </Dialog.Header>
                  <Dialog.Body>
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
                    <Button
                      type="submit"
                      form="study-form"
                      colorPalette="green"
                    >
                      {editingRecord ? "更新する" : "登録する"}
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
            <RecordItem
              key={index}
              record={record}
              onClickEdit={onClickEdit}
              onClickDelete={onClickDelete}
            />
          ))}
        </VStack>

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
