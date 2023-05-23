/*
 * @Author: June
 * @Description:
 * @Date: 2023-04-17 13:50:21
 * @LastEditors: June
 * @LastEditTime: 2023-05-23 23:16:38
 */
import type { Canvas } from 'fabric/fabric-impl';
import { fabric } from 'fabric';
import CanvasRuler, { RulerOptions } from './ruler';

function initRuler(canvas: Canvas, options?: RulerOptions) {
  console.log('修改了12');
  const ruler = new CanvasRuler({
    canvas,
    ...options,
  });

  // 辅助线移动到画板外删除
  let workspace: fabric.Object | undefined = undefined;

  /**
   * 获取workspace
   */
  const getWorkspace = () => {
    workspace = canvas
      .getObjects()
      .find((item) => (item as fabric.Object & { id: string }).id === 'workspace');
  };

  /**
   * 判断target是否在object矩形外
   * @param object
   * @param target
   * @returns
   */
  const isRectOut = (object: fabric.Object, target: fabric.GuideLine): boolean => {
    const { top, height, left, width } = object;

    if (top === undefined || height === undefined || left === undefined || width === undefined) {
      return false;
    }

    const targetRect = target.getBoundingRect(true, true);
    const {
      top: targetTop,
      height: targetHeight,
      left: targetLeft,
      width: targetWidth,
    } = targetRect;

    if (
      target.isHorizontal() &&
      (top > targetTop + 1 || top + height < targetTop + targetHeight - 1)
    ) {
      return true;
    } else if (
      !target.isHorizontal() &&
      (left > targetLeft + 1 || left + width < targetLeft + targetWidth - 1)
    ) {
      return true;
    }

    return false;
  };

  canvas.on('guideline:moving', (e) => {
    if (!workspace) {
      getWorkspace();
      return;
    }
    const { target } = e;
    if (isRectOut(workspace, target)) {
      target.moveCursor = 'not-allowed';
    }
  });

  canvas.on('guideline:mouseup', (e) => {
    if (!workspace) {
      getWorkspace();
      return;
    }
    const { target } = e;
    if (isRectOut(workspace, target)) {
      canvas.remove(target);
      canvas.setCursor(canvas.defaultCursor ?? '');
    }
  });
  return ruler;
}

export default initRuler;
