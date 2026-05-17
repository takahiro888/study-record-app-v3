import { Record } from "../../domain/record";
import { TfiTime } from "react-icons/tfi";
import { Button, HStack, Spacer } from "@chakra-ui/react";
type Props = {
  record: Record;
  onClickEdit: (record: Record) => void;
  onClickDelete: (id: number) => void;
};

export const RecordItem = ({ record, onClickEdit, onClickDelete }: Props) => {
  return (
    <HStack
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
      <p style={{ margin: 0, whiteSpace: "nowrap" }}>{record.time}時間</p>
      <div style={{ whiteSpace: "nowrap" }}>
        <Button size="sm" onClick={() => onClickEdit(record)}>
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
  );
};
