import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // 1. グローバル変数（describe, expectなど）を有効にする
    globals: true,
    // 2. ブラウザ環境をシミュレートする（testing-libraryを使うなら必須）
    environment: "jsdom",
    // 3. setupファイルのパスを実際の配置に合わせる
    setupFiles: ["./src/tests/setup.ts"],
  },
});
