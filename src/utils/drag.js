import Vue from "vue";

/**
 * v-dialogDrag 弹窗拖拽指令
 */

function fn(el, binding, vnode, oldVnode) {
  // 获取弹窗的头部
  const dialogHeaderEl = el.querySelector(".el-dialog__header");
  // 设置鼠标悬浮在弹窗头部的样式
  dialogHeaderEl.style.cursor = "move";

  // 获取弹窗的整体
  const dragDom = el.querySelector(".el-dialog");
  // 获取弹窗整体的样式（兼容写法）
  // ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
  const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null);

  // 弹窗头部设置鼠标按下事件
  dialogHeaderEl.onmousedown = (e) => {
    // 获取事件对象，兼容全浏览器
    const event = e || window.event;
    // 鼠标按下，获取鼠标在盒子内的坐标
    const disX = event.clientX - dialogHeaderEl.offsetLeft;
    const disY = event.clientY - dialogHeaderEl.offsetTop;
    // console.log("disY:", disY); // 101
    // 获取到的值带px 正则匹配替换
    let styL;
    let styT;
    // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
    if (sty.left.includes("%")) {
      styL = +document.body.clientWidth * (+sty.left.replace(/\%/g, "") / 100);
      styT = +document.body.clientHeight * (+sty.top.replace(/\%/g, "") / 100);
    } else {
      styL = +sty.left.replace(/\px/g, "");
      styT = +sty.top.replace(/\px/g, "");
    }
    // console.log("styT:", styT); // 0
    // 鼠标移动的时候，把鼠标在页面中的坐标，减去鼠标在盒子内的坐标就是模态框的left和top值
    document.onmousemove = function (e) {
      // 获取事件对象，兼容全浏览器
      const event = e || window.event;
      // 通过事件委托，计算移动的距离 （开始拖拽至结束拖拽的距离）
      const l = event.clientX - disX;
      const t = event.clientY - disY;

      let finallyL = l + styL;
      let finallyT = t + styT;
      // console.log("finallyT:", finallyT);
      // 边界值判定 注意clientWidth scrollWidth区别 要减去之前的top left值
      let limitL =
        (document.documentElement.clientWidth - dragDom.clientWidth) / 2;
      if (finallyL < -limitL) {
        finallyL = -limitL;
      } else if (finallyL > limitL) {
        finallyL = limitL;
      }
      /*
        影响触发方法时finallyT = 0，弹窗头部直接去到最顶部
        // let limitT = (document.documentElement.clientHeight * 15) / 100;
        // let limitB =
        //   document.documentElement.clientHeight - dragDom.clientHeight - limitT;
        // if (finallyT < -limitT) {
        //   finallyT = -limitT;
        // } else if (finallyT > limitB) {
        //   finallyT = limitB;
        // }
      */
      // 移动当前元素
      dragDom.style.left = `${finallyL}px`;
      dragDom.style.top = `${finallyT}px`;
    };
    // 鼠标松开按键的回调
    document.onmouseup = function (e) {
      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
}

Vue.directive("dialogDrag", {
  // 钩子函数，第一次绑定到目标元素时调用
  bind(el, binding, vnode, oldVnode) {
    fn(el, binding, vnode, oldVnode);
  },
  update(el, binding, vnode, oldVnode) {
    fn(el, binding, vnode, oldVnode);
  },
});
