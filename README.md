# Tetris Game 2024

這是一個使用 HTML5 Canvas 和 JavaScript 實現的 Tetris 遊戲。

## 目錄結構

## 如何開始遊戲

1. 打開 `index.html` 文件。
2. 在瀏覽器中打開該文件。

## 遊戲控制

- **Start**: 開始遊戲
- **Pause**: 暫停遊戲
- **Reset**: 重置遊戲
- **Left**: 向左移動方塊
- **Move Down**: 向下移動方塊
- **Right**: 向右移動方塊
- **Rotate**: 旋轉方塊
- **Speed +**: 增加遊戲速度
- **Speed -**: 減少遊戲速度

## 遊戲功能

- 方塊的隨機生成和顯示
- 方塊的移動和旋轉
- 方塊與邊界和其他方塊的碰撞檢測
- 消除完整的行
- 遊戲速度調整
- 遊戲結束顯示

## 文件說明

### index.html

包含遊戲的 HTML 結構和控制按鈕。

### game.js

包含遊戲的主要邏輯和功能，包括方塊的生成、移動、旋轉、碰撞檢測、行消除等。

#### 函數說明

- `startGame()`: 開始遊戲，並初始化遊戲循環。
- `pauseGame()`: 暫停或繼續遊戲。
- `resetGame()`: 重置遊戲狀態。
- `openingAnimation()`: 顯示開場動畫。
- `drawText2024(x, y)`: 在畫布上繪製 "2024" 文本。
- `createNewBlock()`: 創建新的隨機方塊。
- `drawBlock()`: 繪製當前活動的方塊。
- `drawDeadBlocks()`: 繪製已固定的方塊。
- `getRandomGradient(x, y, width, height)`: 生成隨機漸變顏色。
- `randomColor()`: 生成隨機顏色。
- `moveDown()`: 向下移動當前方塊。
- `moveLeft()`: 向左移動當前方塊。
- `moveRight()`: 向右移動當前方塊。
- `rotateBlock()`: 旋轉當前方塊。
- `detectCollision()`: 檢測當前方塊是否與邊界或其他方塊碰撞。
- `setBlockToDead()`: 將當前方塊設置為已固定。
- `clearFullRows()`: 清除已填滿的行。
- `increaseSpeed()`: 增加遊戲速度。
- `decreaseSpeed()`: 減少遊戲速度。
- `moveDownManually()`: 手動向下移動當前方塊。
- `gameOver()`: 顯示遊戲結束畫面。
- `isMouseInsideBlock(mouseX, mouseY)`: 檢查滑鼠是否在當前方塊內。
- `isOverlapWithDeadBlocks(proposedX, proposedY, shape)`: 檢查當前方塊是否與已固定的方塊重疊。
- `drawSelectedBlock()`: 繪製被選中的方塊。