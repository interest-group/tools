(function() {
  /**
 * 数组
 */

  let arrays = Object.create(null)

  // 布尔全等判断  arrays.all([1, 2, 3], x => x > 1)
  arrays.all = (arr, fn = Boolean) => arr.every(fn)

  // 检查数组各项相等  arrays.allEqual([1, 1, 1]) => true
  arrays.allEqual = arr => arr.every(v => v === arr[0])

  // 约等于  arrays.approximatelyEqual(Math.PI / 2.0, 1.5708) => true
  arrays.approximatelyEqual = (v1, v2, epsilon = 0.001) => Math.abs(v1 - v2) < epsilon;

  // 平均数  arrays.average(...[1, 2, 3]) || arrays.average(1, 2, 3)
  arrays.average = (...nums) => nums.reduce((acc, val) => acc + val, 0) / nums.length;

  // 数组对象属性平均数  arrays.averageBy([{ n: 1 }, { n: 2 }], o => o.n) || arrays.averageBy([{ n: 1 }, { n: 2 }], 'n')
  arrays.averageBy = (arr, fn) => 
      arrays.average(...arr.map(typeof fn === 'function' ? fn : val => val[fn]))

  // 其它类型转数组  arrays.castArray('1', '2', ...) || arrays.castArray([1, ...])
  arrays.castArray = (val, ...others) => (Array.isArray(val) ? val : [val, ...others])

  // 去除数组中的无效/无用值  arrays.compact([0, 1, false, 2, '', 3, 'a', 'e' * 23, NaN, 's', 34]) => [ 1, 2, 3, 'a', 's', 34 ]
  arrays.compact = arr => arr.filter(Boolean)

  // 检测数值出现次数  arrays.countOccurrences([1, 1, 2, 1, 2, 3], 1) => 3
  arrays.countOccurrences = (arr, val) => arr.reduce((v, c) => (c === val ? v + 1 : v), 0)

  //递归扁平化数组  arrays.deepFlatten([1, [2], [[3], 4], 5]) => [1, 2, 3, 4, 5]
  arrays.deepFlatten = arr => [].concat(...arr.map(v => (Array.isArray(v) ? arrays.deepFlatten(v) : v)))

  // 删除不符合条件的值  arrays.dropWhile([1, 2, 3, 4], n => n >= 3) => [3,4] || arrays.dropWhile([{n: 1}, {n: 2}], v => v.n > 1)
  arrays.dropWhile = (arr, func) => arr.filter(func)

  // 返回数组中某值的所有索引  arrays.indexOfAll([1, 2, 3, 1, 2, 3], 1) || arrays.indexOfAll({n: 1}, {n: 2}, {n: 1}, 1, v => v.n)
  arrays.indexOfAll = (arr, val, fn) => 
                  (fn && typeof fn === 'function' ? 
                  arr.map(fn).reduce((acc, v, i) => (v === val ? [...acc, i] : acc), []) 
                  : arr.reduce((acc, v, i) => (v === val ? [...acc, i] : acc), []))

  // 生成两数之间指定长度的随机数组 
  arrays.randomIntArrayInRange = (min, max, n = 1) => 
                  Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min);

  // 根据parent_id生成树结构 
  arrays.nest = (items, id = null, link = 'parent_id') => 
                  items
                  .filter(item => item[link] === id)
                  .map(item => ({...item, children: nest(items, item.id)}))



  /**
   * 函数
   */

  let funs = Object.create(null)
  
  // 推迟执行
  funs.defer = (fn, ...args) => setTimeout(fn, 1, ...args)

  // 转驼峰
  funs.toHump = (str, fmt = '-') => str.replace(new RegExp(`${s}(\\w)`, 'g'), ($0, $1) => $1.toUpperCase())



  /**
    * 字符串
    */
  let strs = Object.create(null)

  // 返回字符串的字节长度  strs.byteSize('Hello World')
  strs.byteSize = str => new Blob([str]).size

  // 首字母大写  strs.capitalize('foafasf')
  strs.capitalize = ([first, ...rest]) => first.toUpperCase() + rest.join('')

  // 每个单词首字母大写  capitalizeEveryWord('hello world!') => Hello World!
  strs.capitalizeEveryWord = str => str.replace(/\b[a-z]/g, char => char.toUpperCase())

  // 首字母小写
  strs.decapitalize = ([first, ...rest]) => first.toLowerCase() + rest.join('')

  // 银行卡号码校验  strs.luhnCheck('4485275742308327') || strs.luhnCheck(4485275742308327), 参考luhn算法
  strs.luhnCheck = num => {
      let arr = (num + '')
      .split('')
      .reverse()
      .map(x => parseInt(x));
      let lastDigit = arr.splice(0, 1)[0];
      let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
      sum += lastDigit;
      return sum % 10 === 0;
  }

  // 删除字符串中的HTMl标签  strs.stripHTMLTags('<p><em>lorem</em> <strong>ipsum</strong></p>') => 'lorem ipsum'
  strs.stripHTMLTags = str => str.replace(/<[^>]*>/g, '')

  /**
    * 对象
    */

  let objects = Object.create(null)

  // 格式化日期参数
  objects.formatDatetime = (validDate, fmt) => {
    /**
     * 
     * @param {} validDate 任何可以new Date()的有效日期
     * @param {*} fmt 形如 "yyyy-MM-dd hh:mm:ss", "MM月-dd日" 等字符串
     */
    if (typeof validDate === 'string') {
      validDate = validDate.replace('T', ' ').replace(/-/g, '\/');
    } else if (!validDate) {
        return '--';
    }
    let date = new Date(validDate);
    let o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (let k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt
  }

  // 返回当前24小时制时间的字符串 objects.getColonTimeFromDate(new Date()) => 08:38:00
  objects.getColonTimeFromDate = date => date.toTimeString().slice(0, 8)

  // 返回日期间的天数  objects.getDaysDiffBetweenDates(new Date('2019-01-01'), new Date('2019-10-14')) => 286
  objects.getDaysDiffBetweenDates = (dateInitial, dateFinal) => (dateFinal - dateInitial) / (1000 * 3600 * 24);

  // 检查值是否为特定类型。
  objects.is = (type, val) => ![, null].includes(val) && val.constructor === type
  /**
   * is(Array, [1]); // true
    is(ArrayBuffer, new ArrayBuffer()); // true
    is(Map, new Map()); // true
    is(RegExp, /./g); // true
    is(Set, new Set()); // true
    is(WeakMap, new WeakMap()); // true
    is(WeakSet, new WeakSet()); // true
    is(String, ''); // true
    is(String, new String('')); // true
    is(Number, 1); // true
    is(Number, new Number(1)); // true
    is(Boolean, true); // true
    is(Boolean, new Boolean(true)); // true
  */

  // 获取明天的字符串格式时间
  objects.tomorrow = () => {
    let t = new Date();
    t.setDate(t.getDate() + 1);
    return t.toISOString().split('T')[0];
  }

  // 全等判断  equals({ a: [2, { e: 3 }], b: [4], c: 'foo' }, { a: [2, { e: 3 }], b: [4], c: 'foo' }) => true
  objects.equals = (a, b) => {
    if (a === b) return true;
    if (a instanceof Date && b instanceof Date) return a.getTime() === b.getTime();
    if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) return a === b;
    if (a.prototype !== b.prototype) return false;
    let keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;
    return keys.every(k => equals(a[k], b[k]));
  }

  // 对象深复制
  objects.deepClone = obj => {
    function isClass(o) { 
      if (o === null) return "Null"; 
      if (o === undefined) return "Undefined"; 
      return Object.prototype.toString.call(o).slice(8, -1); 
    } 
    let result; 
    let oClass = isClass(obj); 
    if (oClass === "Object") { 
      result = {}; 
    } else if (oClass === "Array") {
      result = []; 
    } else { 
      return obj; 
    } 
    for (let key in obj) { 
      let copy = obj[key]; 
      if (isClass(copy) == "Object") { 
        result[key] = arguments.callee(copy);//递归调用 
      } else if (isClass(copy) == "Array") { 
      result[key] = arguments.callee(copy); 
      } else { 
      result[key] = obj[key]; 
      } 
    } 
      return result;
  }



  /**
   * 数字
   */

  let nums = Object.create(null)

  // 生成指定范围的随机整数
  nums.randomIntegerInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

  // 生成指定范围的随机小数
  nums.randomNumberInRange = (min, max) => Math.random() * (max - min) + min

  // 四舍五入到指定位数
  nums.round = (n, decimals = 0) => Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`)

  // 计算数组或多个数字的总和   sum(1, 2, 3, 4) || sum(...[1, 2, 3, 4])
  nums.sum = (...arr) => [...arr].reduce((acc, val) => acc + val, 0)



  /**
    * 浏览器操作及其它
    */

  let plugins = Object.create(null)

  // 检查页面底部是否可见
  plugins.bottomVisible = () =>
          document.documentElement.clientHeight + window.scrollY >=
          (document.documentElement.scrollHeight || document.documentElement.clientHeight)

  // 返回当前链接url
  plugins.currentURL = () => window.location.href

  // 检查是否包含子元素
  plugins.elementContains = (parent, child) => 
          (parent instanceof HTMLElement) && parent !== child && parent.contains(child)

  // 返回指定元素的生效样式  getStyle(document.querySelector('p'), 'width')
  plugins.getStyle = (el, ruleName, pseudoElt = '') => getComputedStyle(el, pseudoElt)[ruleName]

  // 返回值或变量的类型名  getType([1, 2, 3]) => 'array'
  plugins.getType = v =>
          v === undefined ? 'undefined' : v === null ? 'null' : v.constructor.name.toLowerCase()

  // 校验指定元素的类名
  plugins.hasClass = (el, className) => el.classList.contains(className)

  // 隐藏所有的指定标签
  plugins.hideEle = (...el) => [...el].forEach(e => (e.style.display = 'none'))

  // 在指定元素之后插入新元素 insertAfter(document.getElementById('myId'), '<p>after</p>')
  plugins.insertAfter = (el, htmlString) => el.insertAdjacentHTML('afterend', htmlString);

  // 在指定元素之前插入新元素
  plugins.insertBefore = (el, htmlString) => el.insertAdjacentHTML('beforebegin', htmlString)

  // 检查是否为浏览器环境
  plugins.isBrowser = () => ![typeof window, typeof document].includes('undefined')

  // 随机十六进制颜色
  plugins.randomHexColorCode = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return '#' + n.slice(0, 6);
  }

  // 平滑滚动至顶部   scrollToTop(1 - ~~) , 数值越大， 速度就越慢
  plugins.scrollToTop = (rate = 8) => {
    const c = document.documentElement.scrollTop || document.body.scrollTop;
    if (c > 0) {
      window.requestAnimationFrame(plugins.scrollToTop.bind(this, rate));
      window.scrollTo(0, c - c / rate);
    }
  }

  // 滚动到指定元素区域  smoothScroll('.id')
  plugins.smoothScroll = element =>
          document.querySelector(element).scrollIntoView({behavior: 'smooth'})

  // 检测移动/PC设备
  plugins.detectDeviceType = _ => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                                  ? 'Mobile'
                                  : 'Desktop'

  // 返回当前的滚动位置  getScrollPosition(el)
  plugins.getScrollPosition = (el = window) => ({
    x: el.pageXOffset !== undefined ? el.pageXOffset : el.scrollLeft,
    y: el.pageYOffset !== undefined ? el.pageYOffset : el.scrollTop
  })

  // 获取 URL 中的参数
  plugins.getUrlParams = param => {
    const query = window.location.search.substring(1)
    const params = query.split("&")
    for (let i = 0; i < params.length; i++) { 
      let pair = params[i].split("="); 
      if(pair[0] == param){return pair[1];} 
    } 
      return(false)
  }

  // 禁止右键、选择、复制 contextmenu / selectstart / copy
  plugins.disabledOperate = (...args) => {
    args.map(function(ev){
      document.addEventListener(ev, function(event){
        return event.returnValue = false
      })
    })
  }

  // 压缩CSS样式代码
  plugins.compressCss = (s) => {
    s = s.replace(/\/\*(.|\n)*?\*\//g, ""); //删除注释
    s = s.replace(/\s*([\{\}\:\;\,])\s*/g, "$1");
    s = s.replace(/\,[\s\.\#\d]*\{/g, "{"); //容错处理
    s = s.replace(/;\s*;/g, ";"); //清除连续分号
    s = s.match(/^\s*(\S+(\s+\S+)*)\s*$/); //去掉首尾空白
    return s == null ? "" : s[1];
  }

  // 检验URL链接是否有效
  plugins.getUrlState = (url) => {
    const xmlhttp = new ActiveXObject("microsoft.xmlhttp");
    xmlhttp.Open("GET", url, false);
    try {
      xmlhttp.Send();
    } catch (e) {
    } finally {
      let result = xmlhttp.responseText;
      if (result) {
        if (xmlhttp.Status == 200) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  }

  // 获取窗体可见范围的宽与高
  plugins.getViewSize = () => {
    const de = document.documentElement;
    const db = document.body;
    const viewW = de.clientWidth == 0 ? db.clientWidth : de.clientWidth;
    const viewH = de.clientHeight == 0 ? db.clientHeight : de.clientHeight;
    return {
      w: viewW,
      h: viewH
    };
  }


  /**
   * 正则
   */

  let regs = Object.create(null)

  // 必须带端口号的网址(或ip)
  regs.tps = new RegExp(/^(((ht|f)tps?):\/\/)?[\w\-]+(\.[\w\-]+)+:\d{0,5}\/?/)

  // 统一社会信用代码
  regs.npqr = new RegExp(/^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/)

  // 迅雷链接
  regs.thunderx = new RegExp(/^thunderx?:\/\/[a-zA-Z\d]+=$/)

  // html注释
  regs.notes = new RegExp(/^<!--[\s\S]*?-->$/)

  // 版本号格式必须为X.Y.Z
  regs.version = new RegExp(/^\d+(?:\.\d+){2}$/)

  // 视频链接地址
  regs.videoUrl = new RegExp(/^https?:\/\/.*?(?:swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4)$/i)

  // 图片链接地址
  regs.photooUrl = new RegExp(/^https?:\/\/.*?(?:gif|png|jpg|jpeg|webp|svg|psd|bmp|tif)$/i)

  // 24小时制时间（HH:mm:ss）
  regs.twentyFour = new RegExp(/^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/)

  // 12小时制时间（hh:mm:ss）
  regs.twelve = new RegExp(/^(?:1[0-2]|0?[1-9]):[0-5]\d:[0-5]\d$/)

  // base64格式
  regs.base64 = new RegExp(/^\s*data:(?:[a-z]+\/[a-z0-9-+.]+(?:;[a-z-]+=[a-z0-9-]+)?)?(?:;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)\s*$/i)

  // 银行卡号
  regs.backCardNo = new RegExp(/^[1-9]\d{9,29}$/)

  // 中文姓名
  regs.chineseName = new RegExp(/^(?:[\u4e00-\u9fa5·]{2,16})$/)

  // 英文姓名
  regs.engName = new RegExp(/(^[a-zA-Z]{1}[a-zA-Z\s]{0,20}[a-zA-Z]{1}$)/)

  // 车牌号(新能源+非新能源)
  regs.plateNumber = new RegExp(/^(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-HJ-NP-Z]{1}(?:(?:[0-9]{5}[DF])|(?:[DF](?:[A-HJ-NP-Z0-9])[0-9]{4})))|(?:[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]{1})$/)

  // 中国手机号(严谨), 根据工信部2019年最新公布的手机号段
  regs.phoneStrict = new RegExp(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/)

  // 中国手机号(宽松), 只要是13,14,15,16,17,18,19开头即可

  regs.phoneEasy = new RegExp(/^(?:(?:\+|00)86)?1[3-9]\d{9}$/)

  // 中国手机号(最宽松), 只要是1开头即可, 如果你的手机号是用来接收短信, 优先建议选择这一条
  regs.phone = new RegExp(/^(?:(?:\+|00)86)?1\d{10}$/)

  // 座机
  regs.landline = new RegExp(/^0\d{2,3}-\d{7,8}$/)

  // 邮箱地址
  regs.email = new RegExp(/^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/)

  // 身份证号, 支持1/2代(15位/18位数字)
  regs.card = new RegExp(/(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/)

  // 护照
  regs.passport = new RegExp(/(^[EeKkGgDdSsPpHh]\d{8}$)|(^(([Ee][a-fA-F])|([DdSsPp][Ee])|([Kk][Jj])|([Mm][Aa])|(1[45]))\d{7}$)/)

  // 帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线组合
  regs.accountNumber = new RegExp(/^[a-zA-Z][a-zA-Z0-9_]{4,15}$/)

  // 纯中文/汉字
  regs.allChinese = new RegExp(/^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/)

  // 是否小数
  regs.isDecimal = new RegExp(/^\d+\.\d+$/)

  // 纯数字
  regs.pureNumber = new RegExp(/^\d{1,}$/)

  // 是否html标签
  regs.isHtml = new RegExp(/<(.*)>.*<\/\1>|<(.*) \/>/)

  // 是否qq号格式正确
  regs.isQQ = new RegExp(/^[1-9][0-9]{4,10}$/)

  // 是否由数字和字母组成
  regs.numbersOrLetters = new RegExp(/^[A-Za-z0-9]+$/)

  // 纯英文
  regs.pureEnglish = new RegExp(/^[a-zA-Z]+$/)

  // 纯小写英文字母组成
  regs.pureLowercaseEnglish = new RegExp(/^[a-z]+$/)

  // 纯大写英文字母
  regs.pureCapitalizedEnglish = new RegExp(/^[A-Z]+$/)

  // 密码强度正则，最少6位，包括至少1个大写字母，1个小写字母，1个数字，1个特殊字符
  regs.pass = new RegExp(/^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*? ]).*$/)

  // 中国邮政编码
  regs.zipCode = new RegExp(/^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/)

  window.tools = {
    arrays,
    funs,
    strs,
    objects,
    nums,
    plugins,
    regs
  }
})(window)