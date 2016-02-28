http://lightcss.com/all-about-clear-float/
https://www.qianduan.net/universal-to-remove-floating-style/
http://stackoverflow.com/questions/211383/which-method-of-clearfix-is-best
1. 触发BFC的条件
满足下面任一条件的元素，会触发为 BFC ：
    * 浮动元素，float 除 none 以外的值
    * 绝对定位元素，position（absolute，fixed）
    * display 为以下其中之一的值 inline-blocks，table-cells，table-captions
    * overflow 除了 visible 以外的值（hidden，auto，scroll）