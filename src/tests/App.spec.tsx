// src/tests/App.spec.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

// テスト用の簡単な関数
const add = (a: number, b: number) => a + b;

// テスト用の簡単なコンポーネント
const Greeting = ({ name }: { name: string }) => <h1>Hello, {name}!</h1>;

describe('初期動作確認テスト', () => {
  
  // 関数のテスト
  it('add関数が正しく計算されること', () => {
    expect(add(1, 2)).toBe(3);
  });

  // コンポーネントのテスト
  it('Greetingコンポーネントが正しく表示されること', () => {
    render(<Greeting name="Takahiro" />);
    
    // "Hello, Takahiro!" というテキストが画面内にあるか確認
    const element = screen.getByText(/Hello, Takahiro!/i);
    expect(element).toBeInTheDocument();
  });

});