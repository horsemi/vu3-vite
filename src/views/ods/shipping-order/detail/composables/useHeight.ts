import { ref } from 'vue';

export function useHeight() {
  const tableHeight = ref('calc(100vh - 467px)');
  const formRowHeight = 29;
  const formRowPaddingTop = 12;
  const recordOverHeight = 330;
  const definiteOverHeight = 330;
  const arrowIconHeight = 26;
  const defaultDefiniteHeight = `calc(100vh - ${definiteOverHeight}px)`;
  const defaultRecordHeight = `calc(100vh - ${recordOverHeight}px)`;

  const handleHeight = (rowCount: number, tIndex: number, opened: boolean) => {
    // 展开按钮高度，超出3行才会出现展开按钮
    const iconHeight = rowCount > 3 ? arrowIconHeight : 0;
    // 表格高度
    let formHeight = 0;
    if (opened) {
      // 表格高度
      formHeight = formRowHeight * rowCount + formRowPaddingTop * (rowCount - 1);
    } else {
      formHeight = formRowHeight * 3 + formRowPaddingTop * 2;
    }
    // 总裁剪高度
    const overHeight = tIndex === 0 ? definiteOverHeight : recordOverHeight;
    const cutHeight = formHeight + iconHeight + overHeight;
    tableHeight.value = `calc(100vh - ${cutHeight}px)`;
  };

  const getColseHeight = (rowCount) => {
    if (rowCount >= 3) {
      return `${formRowHeight * 3 + formRowPaddingTop * 2}px`;
    } else {
      return `${formRowHeight * rowCount + formRowPaddingTop * (rowCount - 1)}px`;
    }
  };

  return {
    tableHeight,
    defaultDefiniteHeight,
    defaultRecordHeight,
    handleHeight,
    getColseHeight,
  };
}
