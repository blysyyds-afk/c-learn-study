const store = {
  get(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
};

const defaultState = {
  currentDay: 1,
  completedDays: [],
  answers: {},
  recallChecks: {},
  mistakes: {},
  reviewTarget: "",
  minutes: 0,
  activeDate: "",
  streak: 0,
  reminder: "20:30"
};
const saved = store.get("c-learn-v2", {});
let state = { ...defaultState, ...saved };
if (!Array.isArray(state.completedDays)) state.completedDays = [];
if (!state.answers || typeof state.answers !== "object") state.answers = {};
if (!state.recallChecks || typeof state.recallChecks !== "object") state.recallChecks = {};
if (!state.mistakes || typeof state.mistakes !== "object") state.mistakes = {};
state.currentDay = Math.min(28, Math.max(1, Number(state.currentDay) || 1));

const qs = (selector) => document.querySelector(selector);
const qsa = (selector) => [...document.querySelectorAll(selector)];
const u = (value) => value;

const lessons = [
  {
    id: 1,
    short: "Output",
    title: u("\u7b2c 1 \u5929\uff1a\u8ba9\u7535\u8111\u8bf4\u51fa\u7b2c\u4e00\u53e5\u8bdd"),
    story: u("\u60f3\u8c61\u7535\u8111\u662f\u4e00\u4f4d\u975e\u5e38\u8ba4\u771f\u3001\u4f46\u4ece\u4e0d\u731c\u610f\u601d\u7684\u5c0f\u52a9\u624b\u3002\u4f60\u60f3\u8ba9\u5b83\u8bf4\u201c\u4f60\u597d\u201d\uff0c\u5c31\u8981\u628a\u8fd9\u53e5\u8bdd\u548c\u201c\u8bf7\u663e\u793a\u5b83\u201d\u5199\u6e05\u695a\u3002"),
    bridge: u("\u53ea\u8bb0\u4f4f\u8fd9\u4e2a\u987a\u5e8f\uff1a\u51c6\u5907\u5de5\u5177\uff0c\u5f00\u59cb\u5de5\u4f5c\uff0c\u4e0b\u4e00\u6761\u6307\u4ee4\uff0c\u7136\u540e\u7ed3\u675f\u3002"),
    code: '#include <stdio.h>\n\nint main() {\n  printf("Hello, C!");\n  return 0;\n}',
    parts: [["#include", u("\u5148\u62ff\u5230\u201c\u663e\u793a\u6587\u5b57\u201d\u8fd9\u9879\u5de5\u5177\u3002")], ["main()", u("\u544a\u8bc9\u7535\u8111\uff1a\u4ece\u8fd9\u91cc\u5f00\u5de5\u3002")], ["printf()", u("\u628a\u5f15\u53f7\u91cc\u7684\u8bdd\u663e\u793a\u51fa\u6765\u3002")], [";", u("\u4e00\u6761\u6307\u4ee4\u8bf4\u5b8c\u4e86\u3002")]],
    memory: u("\u51c6\u5907\u5de5\u5177 -> \u5f00\u59cb -> \u8bf4\u4e00\u53e5\u8bdd -> \u7ed3\u675f"),
    tryTitle: u("\u628a\u8f93\u51fa\u7684\u8bdd\u6362\u6210\u4f60\u7684\u8bdd"),
    tryPrompt: u("\u53ea\u6539\u5f15\u53f7\u91cc\u7684\u5185\u5bb9\u3002\u8fd0\u884c\u540e\uff0c\u5b83\u5e94\u8be5\u539f\u6837\u8bf4\u51fa\u6765\u3002"),
    coach: u("\u4eca\u5929\u7684\u76ee\u6807\u4e0d\u662f\u80cc\u4ee3\u7801\uff0c\u800c\u662f\u7406\u89e3\uff1a\u6307\u4ee4\u4f1a\u8ba9\u7535\u8111\u505a\u4ec0\u4e48\u3002")
  },
  {
    id: 2,
    short: "Variables",
    title: u("\u7b2c 2 \u5929\uff1a\u7ed9\u6570\u636e\u8d77\u4e00\u4e2a\u540d\u5b57"),
    story: u("\u60f3\u8c61\u684c\u4e0a\u6709\u4e00\u4e2a\u5199\u7740\u201c\u5e74\u9f84\u201d\u7684\u76d2\u5b50\u3002\u628a 18 \u653e\u8fdb\u53bb\u540e\uff0c\u4f60\u4e0d\u5fc5\u6bcf\u6b21\u90fd\u5199 18\uff0c\u53ea\u8981\u8bf4\u201c\u628a age \u62ff\u6765\u201d\u3002"),
    bridge: u("\u53d8\u91cf\u5c31\u662f\u6709\u540d\u5b57\u7684\u5c0f\u76d2\u5b50\uff1bint \u8868\u793a\u5b83\u91cc\u9762\u5148\u653e\u6574\u6570\u3002"),
    code: 'int age = 18;\nprintf("%d", age);',
    parts: [["int", u("\u5148\u8bf4\u76d2\u5b50\u653e\u7684\u662f\u6574\u6570\u3002")], ["age", u("\u76d2\u5b50\u7684\u540d\u5b57\u3002")], ["= 18", u("\u628a 18 \u653e\u8fdb\u8fd9\u4e2a\u76d2\u5b50\u3002")], ["%d", u("\u8ba9 printf \u7528\u6574\u6570\u7684\u65b9\u5f0f\u8bfb\u51fa\u5b83\u3002")]],
    memory: u("int \u662f\u76d2\u5b50\u7c7b\u578b\uff0cage \u662f\u76d2\u5b50\u540d\u5b57\uff0c18 \u662f\u91cc\u9762\u7684\u4e1c\u897f"),
    tryTitle: u("\u7ed9\u8fd9\u4e2a\u5c0f\u76d2\u5b50\u8bbe\u5b9a\u4e00\u4e2a\u6570\u5b57"),
    tryPrompt: u("\u5728\u8f93\u5165\u6846\u5199\u4e00\u4e2a\u6574\u6570\uff0c\u770b\u770b\u76d2\u5b50\u91cc\u4f1a\u8bb0\u4f4f\u4ec0\u4e48\u3002"),
    coach: u("\u53d8\u91cf\u4e0d\u662f\u7a7a\u6d1e\u7684\u7b26\u53f7\uff1a\u5b83\u662f\u4e00\u4e2a\u80fd\u88ab\u4f60\u968f\u65f6\u62ff\u51fa\u6765\u7528\u7684\u3001\u6709\u540d\u5b57\u7684\u76d2\u5b50\u3002")
  },
  {
    id: 3,
    short: "Input",
    title: u("\u7b2c 3 \u5929\uff1a\u8ba9\u7535\u8111\u542c\u4f60\u8bf4\u8bdd"),
    story: u("printf \u662f\u4f60\u5bf9\u5c4f\u5e55\u8bf4\u8bdd\uff1bscanf \u5219\u50cf\u628a\u4e00\u652f\u8bdd\u7b52\u9012\u7ed9\u7528\u6237\u3002\u4f46\u4f60\u8981\u5148\u544a\u8bc9\u5b83\uff1a\u542c\u5230\u7684\u7b54\u6848\u8be5\u653e\u8fdb\u54ea\u4e2a\u76d2\u5b50\u3002"),
    bridge: u("&age \u4e0d\u662f\u96be\u7684\u65b0\u4e1c\u897f\uff1b\u5b83\u53ea\u662f\u4e3a\u4e86\u7cbe\u786e\u5730\u544a\u8bc9 scanf\uff1a\u628a\u7b54\u6848\u653e\u5230 age \u8fd9\u4e2a\u76d2\u5b50\u3002"),
    code: 'int age;\nprintf("Age: ");\nscanf("%d", &age);',
    parts: [["int age", u("\u5148\u51c6\u5907\u4e00\u4e2a\u7a7a\u76d2\u5b50\u3002")], ["scanf", u("\u63a5\u6536\u7528\u6237\u8f93\u5165\u7684\u6307\u4ee4\u3002")], ["%d", u("\u671f\u5f85\u5f97\u5230\u4e00\u4e2a\u6574\u6570\u3002")], ["&age", u("\u7cbe\u786e\u6307\u5411\u8981\u653e\u7b54\u6848\u7684\u76d2\u5b50\u3002")]],
    memory: u("printf \u662f\u8bf4\uff0cscanf \u662f\u542c\uff0c&age \u662f\u7b54\u6848\u7684\u6536\u7eb3\u5730\u5740"),
    tryTitle: u("\u8f93\u5165\u4e00\u4e2a\u5e74\u9f84"),
    tryPrompt: u("\u8bd5\u7740\u8f93\u5165\u6570\u5b57\uff0c\u60f3\u8c61 scanf \u6b63\u5728\u628a\u5b83\u653e\u8fdb age \u76d2\u5b50\u3002"),
    coach: u("\u8f93\u5165\u662f\u7a0b\u5e8f\u548c\u4eba\u7684\u7b2c\u4e00\u6b21\u5bf9\u8bdd\u3002\u4e0d\u53ea\u8981\u542c\u5230\u7b54\u6848\uff0c\u8fd8\u8981\u77e5\u9053\u5b83\u8be5\u88ab\u653e\u5230\u54ea\u91cc\u3002")
  },
  {
    id: 4,
    short: "Choices",
    title: u("\u7b2c 4 \u5929\uff1a\u8ba9\u7a0b\u5e8f\u5b66\u4f1a\u9009\u62e9"),
    story: u("\u6bcf\u5929\u51fa\u95e8\u524d\uff0c\u4f60\u90fd\u4f1a\u770b\u770b\u5916\u9762\u662f\u4e0d\u662f\u4e0b\u96e8\u3002\u5982\u679c\u4e0b\u96e8\uff0c\u5e26\u4f1e\uff1b\u5426\u5219\uff0c\u4e0d\u5e26\u3002if \u5c31\u662f\u628a\u8fd9\u79cd\u6c7a\u5b9a\u5199\u7ed9\u7535\u8111\u3002"),
    bridge: u("\u6761\u4ef6\u4e3a\u771f\u65f6\u8d70 if \u91cc\u7684\u8def\uff0c\u5426\u5219\u8d70 else \u91cc\u7684\u8def\u3002"),
    code: 'if (score >= 60) {\n  printf("Pass");\n} else {\n  printf("Try again");\n}',
    parts: [["if", u("\u5148\u63d0\u51fa\u4e00\u4e2a\u8981\u68c0\u67e5\u7684\u95ee\u9898\u3002")], [">= 60", u("\u5206\u6570\u662f\u4e0d\u662f\u8fbe\u5230 60\uff1f")], ["else", u("\u6761\u4ef6\u4e0d\u6210\u7acb\u65f6\u7684\u5907\u9009\u8def\u3002")], ["{ }", u("\u628a\u540c\u4e00\u6761\u8def\u4e0a\u7684\u4e8b\u653e\u5728\u4e00\u8d77\u3002")]],
    memory: u("if \u95ee\u4e00\u4e2a\u662f\u975e\u9898\uff0celse \u5904\u7406\u53e6\u4e00\u79cd\u60c5\u51b5"),
    tryTitle: u("\u5224\u65ad\u4e00\u4e2a\u5206\u6570"),
    tryPrompt: u("\u8f93\u5165\u4e00\u4e2a\u5206\u6570\uff0c\u770b\u770b\u7a0b\u5e8f\u4f1a\u9009\u54ea\u4e00\u6761\u8def\u3002"),
    coach: u("\u5199\u6761\u4ef6\u524d\uff0c\u5148\u7528\u4eba\u8bdd\u8bf4\u4e00\u904d\u201c\u5982\u679c...\u90a3\u4e48...\u5426\u5219...\u201d\uff0c\u518d\u7ffb\u8bd1\u6210\u4ee3\u7801\u3002")
  },
  {
    id: 5,
    short: "Loops",
    title: u("\u7b2c 5 \u5929\uff1a\u8ba9\u7535\u8111\u91cd\u590d\u505a\u4e8b"),
    story: u("\u5982\u679c\u4f60\u8981\u8ba9\u7535\u8111\u6570 1 \u5230 5\uff0c\u4e0d\u9700\u8981\u5199\u4e94\u6b21 printf\u3002for \u5c31\u50cf\u4e00\u5f20\u89c4\u5219\u6e05\u5355\uff1a\u4ece\u54ea\u5f00\u59cb\uff0c\u4ec0\u4e48\u65f6\u5019\u505c\uff0c\u6bcf\u6b21\u600e\u4e48\u8d70\u4e00\u6b65\u3002"),
    bridge: u("for \u62ec\u53f7\u91cc\u7684\u4e09\u4ef6\u4e8b\uff1a\u51fa\u53d1\u70b9\uff0c\u7ee7\u7eed\u6761\u4ef6\uff0c\u6bcf\u6b21\u53d8\u5316\u3002"),
    code: 'for (int i = 1; i <= 5; i++) {\n  printf("%d\\n", i);\n}',
    parts: [["int i = 1", u("\u4ece 1 \u5f00\u59cb\u6570\u3002")], ["i <= 5", u("\u8fd8\u6ca1\u6570\u5230 5 \u5c31\u7ee7\u7eed\u3002")], ["i++", u("\u6bcf\u6b21\u6570\u5b8c\u5f80\u524d\u8d70 1\u3002")], ["\\n", u("\u8f93\u51fa\u540e\u6362\u5230\u4e0b\u4e00\u884c\u3002")]],
    memory: u("\u51fa\u53d1 -> \u68c0\u67e5 -> \u505a\u4e8b -> \u5411\u524d\u8d70\u4e00\u6b65"),
    tryTitle: u("\u8f93\u5165\u4e00\u4e2a\u7ec8\u70b9"),
    tryPrompt: u("\u8f93\u5165 1 \u5230 9 \u7684\u6570\u5b57\uff0c\u770b\u770b\u8ba1\u6570\u4f1a\u7ed3\u675f\u5728\u54ea\u91cc\u3002"),
    coach: u("\u9047\u5230\u91cd\u590d\u52a8\u4f5c\u65f6\uff0c\u5148\u95ee\uff1a\u6bcf\u4e00\u6b21\u662f\u4ec0\u4e48\u4e0d\u540c\uff1f\u7b54\u6848\u901a\u5e38\u5c31\u662f\u5faa\u73af\u91cc\u7684\u53d8\u91cf\u3002")
  },
  {
    id: 6,
    short: "Functions",
    title: u("\u7b2c 6 \u5929\uff1a\u628a\u5e38\u7528\u52a8\u4f5c\u5305\u8d77\u6765"),
    story: u("\u505a\u83dc\u65f6\uff0c\u4f60\u4e0d\u4f1a\u6bcf\u6b21\u90fd\u4ece\u5934\u89e3\u91ca\u600e\u4e48\u716e\u6c34\u3002\u4f60\u4f1a\u8bf4\u201c\u5148\u716e\u6c34\u201d\u3002\u51fd\u6570\u5c31\u662f\u7ed9\u4e00\u6bb5\u5e38\u7528\u6b65\u9aa4\u53d6\u4e00\u4e2a\u540d\u5b57\u3002"),
    bridge: u("\u5b9a\u4e49\u51fd\u6570\u662f\u5199\u597d\u6b65\u9aa4\uff1b\u8c03\u7528\u51fd\u6570\u662f\u8bf7\u5b83\u73b0\u5728\u5e2e\u5fd9\u3002"),
    code: 'void greet() {\n  printf("Hi!\\n");\n}\n\nint main() {\n  greet();\n}',
    parts: [["void", u("\u8fd9\u4e2a\u51fd\u6570\u4e0d\u9700\u8981\u5e26\u56de\u4e00\u4e2a\u7b54\u6848\u3002")], ["greet", u("\u8fd9\u6bb5\u52a8\u4f5c\u7684\u540d\u5b57\u3002")], ["{ }", u("\u88ab\u540d\u5b57\u5305\u8d77\u6765\u7684\u6b65\u9aa4\u3002")], ["greet()", u("\u771f\u6b63\u53bb\u6267\u884c\u8fd9\u6bb5\u6b65\u9aa4\u3002")]],
    memory: u("\u5b9a\u4e49\u662f\u5199\u597d\uff0c\u8c03\u7528\u662f\u4f7f\u7528"),
    tryTitle: u("\u8f93\u5165\u4e00\u4e2a\u95ee\u5019\u8bed"),
    tryPrompt: u("\u628a\u5b83\u60f3\u6210 greet() \u4f1a\u66ff\u4f60\u8bf4\u51fa\u8fd9\u53e5\u8bdd\u3002"),
    coach: u("\u53ea\u8981\u4e00\u6bb5\u4ee3\u7801\u6709\u91cd\u590d\u4ef7\u503c\uff0c\u5c31\u503c\u5f97\u7ed9\u5b83\u4e00\u4e2a\u540d\u5b57\u3002")
  },
  {
    id: 7,
    short: "Review",
    title: u("\u7b2c 7 \u5929\uff1a\u628a\u4e00\u5468\u7684\u77e5\u8bc6\u4e32\u8d77\u6765"),
    story: u("\u4eca\u5929\u4e0d\u5f15\u5165\u592a\u591a\u65b0\u7b26\u53f7\u3002\u4f60\u8981\u505a\u7684\u662f\u770b\u89c1\u4e00\u4e2a\u5c0f\u7a0b\u5e8f\u91cc\uff0c\u8f93\u5165\u3001\u53d8\u91cf\u3001\u5224\u65ad\u548c\u8f93\u51fa\u662f\u5982\u4f55\u914d\u5408\u7684\u3002"),
    bridge: u("\u8bfb\u4ee3\u7801\u65f6\u6309\u987a\u5e8f\u95ee\uff1a\u5148\u6536\u5230\u4e86\u4ec0\u4e48\uff1f\u5b83\u4fdd\u5b58\u5728\u54ea\uff1f\u7528\u5b83\u5224\u65ad\u4e86\u4ec0\u4e48\uff1f\u6700\u540e\u8bf4\u51fa\u4e86\u4ec0\u4e48\uff1f"),
    code: 'int score;\nscanf("%d", &score);\nif (score >= 60) {\n  printf("Pass");\n}',
    parts: [["score", u("\u7528\u4e00\u4e2a\u53d8\u91cf\u8bb0\u5f55\u5206\u6570\u3002")], ["scanf", u("\u8ba9\u7528\u6237\u4ea4\u51fa\u6570\u5b57\u3002")], ["if", u("\u6839\u636e\u5206\u6570\u505a\u51b3\u5b9a\u3002")], ["printf", u("\u628a\u51b3\u5b9a\u663e\u793a\u51fa\u6765\u3002")]],
    memory: u("\u8f93\u5165 -> \u4fdd\u5b58 -> \u5224\u65ad -> \u8f93\u51fa"),
    tryTitle: u("\u8f93\u5165\u4e00\u4e2a\u5206\u6570\u505a\u590d\u4e60"),
    tryPrompt: u("\u8f93\u5165 0 \u5230 100 \u7684\u5206\u6570\uff0c\u7528\u4eba\u8bdd\u5148\u731c\u5b83\u4f1a\u8f93\u51fa\u4ec0\u4e48\u3002"),
    coach: u("\u80fd\u628a\u4ee3\u7801\u7ffb\u8bd1\u6210\u4eba\u8bdd\uff0c\u5c31\u8bf4\u660e\u4f60\u5df2\u7ecf\u5728\u7406\u89e3\u5b83\uff0c\u800c\u4e0d\u53ea\u662f\u8bb0\u4f4f\u5b83\u3002")
  }
];

const extensionLessons = [
  [8, "Arrays", "第 8 天：把一组数据排进同一排抽屉", "int scores[3] = {86, 92, 78};\nprintf(\"%d\", scores[0]);", "数组就是一排同类型的小抽屉；编号从 0 开始。", "int scores[3]", "准备 3 个整型抽屉", "scores[0]", "取出第一个抽屉里的值"],
  [9, "Array loops", "第 9 天：逐个检查一排数据", "int scores[3] = {86, 92, 78};\nfor (int i = 0; i < 3; i++) {\n  printf(\"%d \", scores[i]);\n}", "循环变量 i 像手指，依次指向每个数组位置。", "i < 3", "只访问编号 0 到 2", "scores[i]", "取出当前编号的抽屉"],
  [10, "Strings", "第 10 天：让文字成为数据", "char name[] = \"Mia\";\nprintf(\"Hello, %s\", name);", "字符串是一串字符；C 用 \"\\0\" 标记文字的终点。", "char", "文字由字符组成", "%s", "按字符串方式显示文字"],
  [11, "Pointers", "第 11 天：认识变量的地址", "int score = 88;\nint *p = &score;\nprintf(\"%d\", *p);", "变量像盒子，& 是盒子的地址，*p 是顺着地址拿到盒子里的值。", "&score", "拿到 score 的地址", "*p", "通过地址读取 score"],
  [12, "Pointer arrays", "第 12 天：数组和指针如何配合", "int nums[3] = {2, 4, 6};\nint *p = nums;\nprintf(\"%d\", *(p + 1));", "数组名可以理解为第一格的起点；指针移动一格，就是看下一个元素。", "int *p", "准备一个地址指针", "p + 1", "向后一格"],
  [13, "Parameters", "第 13 天：把数据交给函数处理", "int add(int a, int b) {\n  return a + b;\n}\nprintf(\"%d\", add(2, 3));", "参数像交给函数的材料；return 是函数交回来的答案。", "int a, int b", "函数收到两个材料", "return", "把计算结果交回去"],
  [14, "Week review", "第 14 天：用一个小程序复盘第二周", "int max(int a, int b) {\n  if (a > b) return a;\n  return b;\n}", "先拆问题，再让函数完成一件小事；这是写程序最重要的习惯。", "max", "给小任务一个名字", "if", "选择较大的数"],
  [15, "Structs", "第 15 天：把一条记录装进一个资料卡", "struct Student {\n  char name[20];\n  int score;\n};", "结构体把不同类型、但属于同一件事的数据放在一起。", "struct Student", "定义学生资料卡", "int score", "资料卡中的一个字段"],
  [16, "Struct arrays", "第 16 天：管理多张资料卡", "struct Student list[2];\nlist[0].score = 90;", "数组负责很多张卡，. 负责打开某一张卡上的字段。", "list[0]", "第一张学生卡", ".score", "这张卡上的分数字段"],
  [17, "Files", "第 17 天：把数据保存到文件", "FILE *fp = fopen(\"notes.txt\", \"w\");\nfprintf(fp, \"Hello\");\nfclose(fp);", "文件操作有固定节奏：打开、读写、关闭。", "fopen", "打开文件", "fclose", "完成后关好文件"],
  [18, "File reading", "第 18 天：从文件中读回信息", "FILE *fp = fopen(\"notes.txt\", \"r\");\nchar text[50];\nfgets(text, 50, fp);", "读文件前先确认文件已成功打开；每次读到的数据都要有去处。", "\"r\"", "以读取方式打开", "fgets", "读取一行文字"],
  [19, "Sorting", "第 19 天：让数据按规则排队", "for (int i = 0; i < 3; i++) {\n  for (int j = 0; j < 2; j++) {\n    if (a[j] > a[j + 1]) { /* swap */ }\n  }\n}", "排序不是魔法：反复比较相邻元素，把不合适的位置交换掉。", "if (a[j] > a[j + 1])", "发现顺序不对", "swap", "交换两个位置"],
  [20, "Searching", "第 20 天：在有序数据中更快地找", "int mid = (left + right) / 2;\nif (a[mid] < target) left = mid + 1;", "二分查找每次排除一半范围，但前提是数据已经有序。", "mid", "中间位置", "left = mid + 1", "目标在右半边"],
  [21, "Week review", "第 21 天：把数据处理流程串起来", "// 输入 -> 保存 -> 处理 -> 输出\nint total = 0;\nfor (int i = 0; i < n; i++) total += a[i];", "看程序时先追踪数据：它从哪里来、在哪里变、最后去了哪里。", "total", "累积结果的盒子", "total += a[i]", "把当前数据加入结果"],
  [22, "Dynamic memory", "第 22 天：需要多少空间，就申请多少", "int *a = malloc(n * sizeof(int));\n/* use a */\nfree(a);", "动态内存是临时租来的空间；用完必须 free，像离开房间要关灯。", "malloc", "申请一段空间", "free", "归还用完的空间"],
  [23, "Linked lists", "第 23 天：用链接把数据串成队列", "struct Node {\n  int value;\n  struct Node *next;\n};", "链表的每个节点都保存数据和下一站地址，像一节节车厢。", "value", "当前车厢的数据", "next", "下一节车厢的地址"],
  [24, "Debugging", "第 24 天：像侦探一样定位错误", "printf(\"value: %d\\n\", value);\n// 观察变量在每一步的变化", "调试不是猜；先复现，再缩小范围，再观察关键变量。", "printf", "把关键状态打印出来", "value", "需要追踪的变量"],
  [25, "Calculator", "第 25 天：做一个小计算器", "char op;\nscanf(\"%d %c %d\", &a, &op, &b);\nif (op == '+') printf(\"%d\", a + b);", "项目开始于清楚的输入、规则和输出；先让最小版本跑通。", "op", "保存运算符", "op == '+'", "判断用户选择的运算"],
  [26, "Score manager", "第 26 天：做一个成绩管理小项目", "struct Student list[30];\n// 输入、计算平均分、输出结果", "把项目拆成小函数：录入、计算、展示，每个函数只做一件事。", "list[30]", "最多保存 30 条记录", "平均分", "需要单独计算的结果"],
  [27, "Mock exam", "第 27 天：限时复盘与查漏补缺", "// 读题 -> 写输入输出 -> 拆步骤 -> 编码 -> 自测", "考试题先写清思路再编码；卡住时回到最小可验证的一步。", "输入输出", "先定义问题边界", "自测", "用样例验证程序"],
  [28, "Capstone", "第 28 天：完成你的第一个 C 小作品", "int main() {\n  // 选择一个真实小问题并完成它\n  return 0;\n}", "真正的进步是能把一个模糊需求拆成可验证的小步骤。", "main", "项目从入口开始", "return 0", "完成并正常结束"]
];

function makeExtensionLesson([id, short, title, code, memory, firstLabel, firstText, secondLabel, secondText]) {
  return {
    id, short, title, code, memory,
    story: `今天不靠死记：把“${short}”想成你已经会用的生活动作，再把它翻译成 C 的步骤。`,
    bridge: `先说清楚这段代码要解决什么，再观察 ${firstLabel} 和 ${secondLabel} 分别负责哪一步。`,
    parts: [[firstLabel, firstText], [secondLabel, secondText], ["步骤", "先让最小例子成立，再逐步加入变化"], ["检查", "用一个小样例验证你是否真的理解"]],
    tryTitle: "先预测，再验证你的理解",
    tryPrompt: "输入一个自己的例子。这里是概念演练，不是在线 C 编译器。",
    coach: "如果一段代码看起来复杂，就把它切成：数据从哪里来、经过什么处理、最后去哪。"
  };
}
lessons.push(...extensionLessons.map(makeExtensionLesson));

const questions = [
  { id:"d1q1", day:1, q:u("\u54ea\u4e2a\u51fd\u6570\u8d1f\u8d23\u628a\u6587\u5b57\u663e\u793a\u5230\u5c4f\u5e55\uff1f"), a:["scanf()","printf()","main()","return"], correct:1, why:u("printf() \u662f\u201c\u8bf4\u201d\u7684\u6307\u4ee4\uff1bscanf() \u624d\u662f\u7528\u6765\u201c\u542c\u201d\u8f93\u5165\u7684\u3002") },
  { id:"d1q2", day:1, q:u("\u4e00\u4e2a C \u7a0b\u5e8f\u901a\u5e38\u4ece\u54ea\u91cc\u5f00\u59cb\u6267\u884c\uff1f"), a:["printf()","main()","#include","return 0"], correct:1, why:u("main() \u662f\u7a0b\u5e8f\u7684\u8d77\u70b9\u3002") },
  { id:"d2q1", day:2, q:u("int age = 18; \u91cc\u7684 age \u6700\u50cf\u4ec0\u4e48\uff1f"), a:[u("\u4e00\u4e2a\u6709\u540d\u5b57\u7684\u76d2\u5b50"),u("\u4e00\u53e5\u8f93\u51fa\u6307\u4ee4"),u("\u4e00\u4e2a\u5206\u53f7"),u("\u4e00\u5f20\u6ce8\u91ca")], correct:0, why:u("age \u662f\u53d8\u91cf\u540d\uff0c\u5c31\u50cf\u4e00\u4e2a\u53ef\u4ee5\u653e\u4e1c\u897f\u3001\u53c8\u53ef\u4ee5\u4e4b\u540e\u518d\u62ff\u51fa\u6765\u7684\u76d2\u5b50\u3002") },
  { id:"d2q2", day:2, q:u("\u60f3\u663e\u793a\u4e00\u4e2a int \u53d8\u91cf\uff0cprintf \u91cc\u5e38\u7528\u54ea\u4e2a\u5360\u4f4d\u7b26\uff1f"), a:["%s","%d","%c","%f"], correct:1, why:u("%d \u4ee3\u8868\u6574\u6570 decimal\uff0c\u7528\u5b83\u6765\u663e\u793a int \u3002") },
  { id:"d3q1", day:3, q:u("scanf(\"%d\", &age); \u91cc\u7684 &age \u4f5c\u7528\u662f\u4ec0\u4e48\uff1f"), a:[u("\u544a\u8bc9 scanf \u7b54\u6848\u8be5\u5b58\u5728\u54ea\u4e2a\u53d8\u91cf"),u("\u8ba9 age \u81ea\u52a8\u52a0 1"),u("\u663e\u793a age"),u("\u7ed3\u675f\u7a0b\u5e8f")], correct:0, why:u("scanf \u4e0d\u4ec5\u8981\u77e5\u9053\u8bfb\u4ec0\u4e48\u6837\u7684\u8f93\u5165\uff0c\u8fd8\u8981\u77e5\u9053\u628a\u5b83\u653e\u5230\u54ea\u91cc\u3002") },
  { id:"d3q2", day:3, q:u("\u5982\u679c\u7a0b\u5e8f\u8981\u8bfb\u53d6\u4e00\u4e2a\u6574\u6570\uff0cscanf \u4e2d\u5e94\u8be5\u4f7f\u7528\uff1f"), a:["%d","%s","%f","%c"], correct:0, why:u("int \u5bf9\u5e94\u7684\u662f %d\u3002") },
  { id:"d4q1", day:4, q:u("if (score >= 60) \u7684\u610f\u601d\u662f\uff1f"), a:[u("\u5206\u6570\u662f\u5426\u81f3\u5c11\u4e3a 60"),u("\u5206\u6570\u662f\u5426\u521a\u597d\u4e3a 60"),u("\u5206\u6570\u662f\u5426\u5c0f\u4e8e 60"),u("\u5206\u6570\u52a0 60")], correct:0, why:u(">= \u8868\u793a\u201c\u5927\u4e8e\u6216\u7b49\u4e8e\u201d\u3002") },
  { id:"d4q2", day:4, q:u("else \u4f1a\u5728\u4ec0\u4e48\u65f6\u5019\u88ab\u6267\u884c\uff1f"), a:[u("if \u7684\u6761\u4ef6\u4e0d\u6210\u7acb\u65f6"),u("\u6bcf\u6b21\u90fd\u6267\u884c"),u("\u7a0b\u5e8f\u5f00\u59cb\u65f6"),u("\u53ea\u6709\u5206\u6570\u662f 0 \u65f6")], correct:0, why:u("if \u548c else \u662f\u4e24\u6761\u4e92\u65a5\u7684\u8def\u3002") },
  { id:"d5q1", day:5, q:u("for (int i = 1; i <= 5; i++) \u91cc\uff0ci++ \u8868\u793a\uff1f"), a:[u("i \u6bcf\u6b21\u589e\u52a0 1"),u("i \u76f4\u63a5\u53d8\u6210 1"),u("i \u51cf\u5c11 1"),u("\u7ed3\u675f\u5faa\u73af")], correct:0, why:u("++ \u5c31\u662f\u5728\u539f\u6765\u7684\u57fa\u7840\u4e0a\u52a0 1\u3002") },
  { id:"d5q2", day:5, q:u("\u5faa\u73af\u5185\u7684\u6307\u4ee4\u4f1a\u91cd\u590d\u6267\u884c\u5230\u4ec0\u4e48\u65f6\u5019\uff1f"), a:[u("\u7ee7\u7eed\u6761\u4ef6\u4e0d\u6210\u7acb\u65f6"),u("\u6c38\u8fdc\u4e0d\u4f1a\u505c"),u("\u53ea\u6267\u884c\u4e00\u6b21"),u("\u9047\u5230 printf \u65f6")], correct:0, why:u("\u5faa\u73af\u6bcf\u4e00\u8f6e\u90fd\u4f1a\u68c0\u67e5\u6761\u4ef6\uff1b\u4e0d\u6ee1\u8db3\u5c31\u505c\u4e0b\u3002") },
  { id:"d6q1", day:6, q:u("\u5b9a\u4e49\u4e86 greet() \u4e4b\u540e\uff0c\u600e\u6837\u8ba9\u5b83\u771f\u6b63\u8fd0\u884c\uff1f"), a:["greet();","int greet;","#include greet","return greet;"], correct:0, why:u("\u51fd\u6570\u540d\u540e\u9762\u52a0 () \u5c31\u662f\u8c03\u7528\u5b83\u3002") },
  { id:"d6q2", day:6, q:u("\u628a\u4e00\u6bb5\u5e38\u7528\u6b65\u9aa4\u5199\u6210\u51fd\u6570\u7684\u597d\u5904\u662f\uff1f"), a:[u("\u53ef\u4ee5\u91cd\u590d\u4f7f\u7528\uff0c\u4ee3\u7801\u66f4\u6e05\u6670"),u("\u4e0d\u9700\u8981\u5199\u5206\u53f7"),u("\u8ba9\u7a0b\u5e8f\u6c38\u8fdc\u4e0d\u505c"),u("\u53ef\u4ee5\u4e0d\u5199 main")], correct:0, why:u("\u597d\u51fd\u6570\u8ba9\u4f60\u53ef\u4ee5\u7528\u540d\u5b57\u590d\u7528\u4e00\u6bb5\u6b65\u9aa4\u3002") },
  { id:"d7q1", day:7, q:u("\u8fd9\u5468\u5c0f\u7a0b\u5e8f\u7684\u5e38\u89c1\u987a\u5e8f\u662f\uff1f"), a:[u("\u8f93\u5165 -> \u4fdd\u5b58 -> \u5224\u65ad -> \u8f93\u51fa"),u("\u8f93\u51fa -> \u5224\u65ad -> \u8f93\u5165"),u("\u53ea\u8981\u8f93\u51fa"),u("\u5148\u7ed3\u675f\u518d\u5f00\u59cb")], correct:0, why:u("\u8fd9\u662f\u4e00\u4e2a\u5f88\u5e38\u89c1\u7684\u7a0b\u5e8f\u6d41\u7a0b\uff1a\u5148\u83b7\u53d6\u4fe1\u606f\uff0c\u518d\u5904\u7406\u5b83\u3002") },
  { id:"d7q2", day:7, q:u("\u8bfb\u4e0d\u61c2\u4ee3\u7801\u65f6\uff0c\u6700\u597d\u7684\u7b2c\u4e00\u6b65\u662f\uff1f"), a:[u("\u7528\u4eba\u8bdd\u8bf4\u51fa\u6bcf\u4e00\u884c\u5728\u505a\u4ec0\u4e48"),u("\u76f4\u63a5\u80cc\u4e0b\u6240\u6709\u7b26\u53f7"),u("\u8df3\u8fc7\u5b83"),u("\u5220\u6389\u4ee3\u7801")], correct:0, why:u("\u80fd\u7ffb\u8bd1\u6210\u4eba\u8bdd\uff0c\u4f60\u5c31\u5f00\u59cb\u7406\u89e3\u4ee3\u7801\u4e86\u3002") }
];

function keywordBank(lesson) {
  const descriptions = lesson.parts.map((part) => part[1]);
  return lesson.parts.map((part, index) => {
    const correctPosition = (lesson.id + index) % 4;
    const wrong = descriptions.filter((_, itemIndex) => itemIndex !== index).slice(0, 3);
    const answers = [...wrong];
    answers.splice(correctPosition, 0, part[1]);
    return {
      id: `d${lesson.id}k${index + 1}`,
      day: lesson.id,
      type: u("\u5173\u952e\u5b57\u914d\u5bf9"),
      q: u("\u5728\u4eca\u5929\u7684\u4ee3\u7801\u4e2d\uff0c") + part[0] + u("\u662f\u505a\u4ec0\u4e48\u7684\uff1f"),
      a: answers,
      correct: correctPosition,
      why: part[1]
    };
  });
}
const dayOneDrills = [
  { id:"d1r1", day:1, type:u("\u8bed\u6cd5\u586b\u7a7a"), q:u("\u4e00\u6761 C \u8bed\u53e5\u901a\u5e38\u7528\u4ec0\u4e48\u7b26\u53f7\u7ed3\u675f\uff1f"), a:[",",":",";","."], correct:2, why:u("\u5206\u53f7 ; \u5c31\u50cf\u4e00\u6761\u6307\u4ee4\u7684\u53e5\u53f7\u3002") },
  { id:"d1r2", day:1, type:u("\u8fd0\u884c\u9884\u6d4b"), q:u("printf(\"Hello\"); \u8fd0\u884c\u540e\uff0c\u5c4f\u5e55\u4f1a\u51fa\u73b0\u4ec0\u4e48\uff1f"), a:["Hello","printf","\"Hello\"",u("\u4ec0\u4e48\u90fd\u4e0d\u4f1a\u51fa\u73b0")], correct:0, why:u("printf \u4f1a\u628a\u5f15\u53f7\u91cc\u7684\u6587\u5b57\u663e\u793a\u51fa\u6765\u3002") },
  { id:"d1r3", day:1, type:u("\u627e\u9519\u9898"), q:u("printf(\"Hello\") \u6700\u660e\u663e\u7f3a\u5c11\u7684\u662f\uff1f"), a:[u("\u5de6\u62ec\u53f7"),u("\u5206\u53f7"),u("\u5f15\u53f7"),u("\u5b57\u6bcd p")], correct:1, why:u("\u5b8c\u6574\u7684\u8bed\u53e5\u9700\u8981\u7528\u5206\u53f7\u7ed3\u5c3e\uff1aprintf(\"Hello\");") },
  { id:"d1r4", day:1, type:u("\u4ee3\u7801\u987a\u5e8f"), q:u("\u8981\u5199\u4e00\u4e2a\u6700\u5c0f C \u7a0b\u5e8f\uff0c\u4e0b\u5217\u987a\u5e8f\u6700\u5408\u7406\u7684\u662f\uff1f"), a:[u("\u5148 main\uff0c\u518d #include"),u("\u5148 #include\uff0c\u518d main\uff0c\u6700\u540e return"),u("\u53ea\u5199 printf"),u("\u5148 return\uff0c\u518d main")], correct:1, why:u("\u7b2c\u4e00\u4e2a\u7a0b\u5e8f\u7684\u9aa8\u67b6\u662f\uff1a\u5148\u51c6\u5907\u5de5\u5177\uff0c\u7136\u540e\u5728 main \u91cc\u6267\u884c\u6307\u4ee4\u3002") }
];
function reinforcementBank(lesson) {
  return [
    { id:`d${lesson.id}m`, day:lesson.id, type:u("记忆锚"), q:u("用一句话记住今天的关键逻辑，哪一项最准确？"), a:[lesson.memory, u("先背下所有符号，不必理解"), u("跳过练习，明天再说"), u("只要把代码复制一遍")], correct:0, why:lesson.memory },
    { id:`d${lesson.id}p`, day:lesson.id, type:u("学习策略"), q:u("遇到今天这类新代码时，最有效的第一步是？"), a:[u("先用人话说出数据、步骤和结果"), u("马上背完整段代码"), u("只看答案不动手"), u("删掉看不懂的行")], correct:0, why:u("先翻译成自己的话，才能判断每一行究竟在做什么；这比机械背诵更稳。") }
  ];
}
questions.push(...lessons.flatMap(keywordBank), ...lessons.flatMap(reinforcementBank), ...dayOneDrills);

let questionIndex = 0;
let locked = false;

function dateKey() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}
function syncDate() {
  const today = dateKey();
  if (state.activeDate && state.activeDate !== today) state.minutes = 0;
}
function addDays(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}
function todayISO() { return new Date().toISOString().slice(0, 10); }
function mistakeEntries() {
  return Object.entries(state.mistakes).map(([id, value]) => ({ id, ...value })).filter((item) => questions.some((question) => question.id === item.id));
}
function dueMistakes() { return mistakeEntries().filter((item) => item.due <= todayISO()); }
function save() { store.set("c-learn-v2", state); }
function addMinutes(amount) {
  const today = dateKey();
  if (state.activeDate !== today) {
    state.activeDate = today;
    state.streak += 1;
  }
  state.minutes = Math.min(45, state.minutes + amount);
}
function currentLesson() { return lessons.find((lesson) => lesson.id === state.currentDay) || lessons[0]; }
function currentQuestions() { return questions.filter((question) => question.day === state.currentDay); }
function completed(day) { return state.completedDays.includes(day); }
function score() {
  const entries = Object.values(state.answers);
  return { answered: entries.length, correct: entries.filter((entry) => entry.correct).length };
}
function codeHTML(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/(#include|int|return|void)/g, "<em>$1</em>")
    .replace(/("[^"]*")/g, "<span>$1</span>");
}
function lessonOutput(lesson, rawValue) {
  const value = rawValue.trim() || "Hello, C!";
  if (lesson.id === 2) return `age = ${value.replace(/[^0-9-]/g, "") || "18"}`;
  if (lesson.id === 3) return `age received: ${value.replace(/[^0-9-]/g, "") || "18"}`;
  if (lesson.id === 4 || lesson.id === 7) return Number(value) >= 60 ? "Pass" : "Try again";
  if (lesson.id === 5) {
    const end = Math.min(9, Math.max(1, Number(value) || 5));
    return Array.from({ length:end }, (_, i) => i + 1).join(" ");
  }
  return value;
}
function outputTip(lesson) {
  const tips = [
    u("\u5f15\u53f7\u91cc\u7684\u5185\u5bb9\u53d8\u4e86\uff0c\u4f46 printf \u8fd9\u6761\u6307\u4ee4\u6ca1\u53d8\u3002"),
    u("\u4f60\u653e\u8fdb\u53d8\u91cf\u76d2\u5b50\u7684\u6570\u5b57\uff0c\u4ee5\u540e\u53ef\u4ee5\u88ab\u540d\u5b57 age \u627e\u56de\u6765\u3002"),
    u("\u8fd9\u5c31\u662f\u8f93\u5165\u88ab\u6536\u8fdb\u53d8\u91cf\u540e\u7684\u7ed3\u679c\u3002"),
    u("\u5148\u770b\u6761\u4ef6\uff0c\u518d\u51b3\u5b9a\u8981\u663e\u793a\u54ea\u53e5\u8bdd\u3002"),
    u("\u5faa\u73af\u6bcf\u6b21\u8ba1\u6570\u90fd\u4f1a\u5f80\u524d\u8d70\u4e00\u6b65\u3002"),
    u("\u8c03\u7528\u51fd\u6570\u5c31\u50cf\u6309\u4e0b\u4e00\u4e2a\u5df2\u7ecf\u547d\u540d\u7684\u52a8\u4f5c\u3002"),
    u("\u4f60\u5df2\u7ecf\u628a\u8f93\u5165\u3001\u4fdd\u5b58\u3001\u5224\u65ad\u548c\u8f93\u51fa\u4e32\u8d77\u6765\u4e86\u3002")
  ];
  return tips[lesson.id - 1] || u("这是一个概念模拟：先用自己的话预测数据如何变化，再到真实编译器验证。");
}

function recallPlan(lesson) {
  if (lesson.id === 1) {
    return {
      intro: u("\u7b2c\u4e00\u8bfe\u7684\u76ee\u6807\u4e0d\u53ea\u662f\u201c\u770b\u8fc7\u201d\u4ee3\u7801\uff1a\u5148\u7406\u89e3\u9aa8\u67b6\uff0c\u7136\u540e\u4e0d\u770b\u63d0\u793a\u5199\u51fa\u5b83\u3002"),
      blankTitle: u("\u56db\u4e2a\u5173\u952e\u4f4d\u7f6e"),
      blankPrompt: u("\u5148\u8bb0\u8d77\u6765\u6bcf\u4e00\u4e2a\u4f4d\u7f6e\u8be5\u5199\u4ec0\u4e48\u3002"),
      blanks: [[u("\u6253\u5370\u5de5\u5177\u7684\u5934\u6587\u4ef6"),"stdio.h"],[u("\u7a0b\u5e8f\u5165\u53e3"),"main"],[u("\u8f93\u51fa\u6307\u4ee4"),"printf"],[u("return \u540e\u9762\u7684\u6570\u5b57"),"0"]],
      writeTitle: u("\u4e0d\u770b\u4e0a\u9762\uff0c\u5199\u5b8c\u6574\u9aa8\u67b6"),
      writePrompt: u("\u4e0d\u8981\u8ffd\u6c42\u7f8e\u89c2\u3002\u5148\u5199\u51fa\u7ed3\u6784\uff0c\u518d\u8865\u6807\u70b9\u548c\u7a7a\u683c\u3002"),
      required: ["#include<stdio.h>","intmain()","printf(\"hello,c!\");","return0;"]
    };
  }
  return {
    intro: u("\u8fd9\u4e00\u8bfe\u7684\u76ee\u6807\u662f\uff1a\u80fd\u8bf4\u51fa\u6bcf\u4e2a\u5173\u952e\u5b57\u7684\u610f\u4e49\uff0c\u5e76\u5199\u51fa\u6838\u5fc3\u4ee3\u7801\u9aa8\u67b6\u3002"),
    blankTitle: u("\u5173\u952e\u5b57\u56de\u5fc6"),
    blankPrompt: u("\u7528\u4e0a\u9762\u521a\u5b66\u7684\u5173\u952e\u5b57\u586b\u7a7a\u3002"),
    blanks: lesson.parts.slice(0, 3).map((part) => [part[1], part[0].replace(/[^A-Za-z0-9_#&+<>=]/g, "")]),
    writeTitle: u("\u5199\u51fa\u6838\u5fc3\u4ee3\u7801"),
    writePrompt: u("\u8bd5\u7740\u4e0d\u770b\u4e0a\u65b9\u4ee3\u7801\u91cd\u5efa\u8fd9\u4e2a\u5c0f\u7247\u6bb5\u3002"),
    required: lesson.code.replace(/\s+/g, "").split(/[{};]/).filter((part) => part.length > 3).slice(0, 3)
  };
}
function cleanCode(value) { return value.toLowerCase().replace(/\s+/g, ""); }
function markRecall(key) {
  if (!state.recallChecks[key]) {
    state.recallChecks[key] = true;
    addMinutes(4);
  }
}
function renderRecall() {
  const lesson = currentLesson();
  const plan = recallPlan(lesson);
  qs("#recallTitle").textContent = lesson.id === 1 ? u("\u7b2c 1 \u8bfe\uff1a\u770b\u61c2\u540e\uff0c\u8981\u80fd\u5199\u51fa\u6765\u3002") : u("\u5148\u56de\u5fc6\uff0c\u518d\u5bf9\u7167\u3002");
  qs("#recallStatus").textContent = state.recallChecks[`d${lesson.id}:write`] ? u("\u5df2\u5b8c\u6210\u9ed8\u5199") : u("\u4e24\u6b65\u5f3a\u5316\u8bb0\u5fc6");
  qs("#recallIntro").textContent = plan.intro;
  qs("#blankTitle").textContent = plan.blankTitle;
  qs("#blankPrompt").textContent = plan.blankPrompt;
  qs("#writeTitle").textContent = plan.writeTitle;
  qs("#writePrompt").textContent = plan.writePrompt;
  qs("#recallBlanks").innerHTML = plan.blanks.map((blank, index) => `<label>${blank[0]}<input data-answer="${blank[1].toLowerCase()}" data-blank="${index}" autocomplete="off"></label>`).join("");
  qs("#codeRecall").value = "";
  qs("#blanksFeedback").className = "recall-feedback";
  qs("#blanksFeedback").textContent = "";
  qs("#recallFeedback").className = "recall-feedback";
  qs("#recallFeedback").textContent = "";
}

function renderLesson() {
  const lesson = currentLesson();
  renderDayList();
  qs("#lessonKicker").textContent = `DAY ${String(lesson.id).padStart(2, "0")} / 25 MIN`;
  qs("#lessonTitle").textContent = lesson.title;
  qs("#lessonStory").textContent = lesson.story;
  qs("#lessonBridge").textContent = lesson.bridge;
  qs("#lessonCode").innerHTML = codeHTML(lesson.code);
  qs("#lineExplanations").innerHTML = lesson.parts.map(([label, text]) => `<div><b>${label}</b><span>${text}</span></div>`).join("");
  qs("#memoryHook").textContent = lesson.memory;
  qs("#tryTitle").textContent = lesson.tryTitle;
  qs("#tryPrompt").textContent = lesson.tryPrompt;
  qs("#customText").value = lesson.id === 1 || lesson.id === 6 ? "Hello, C!" : lesson.id === 4 || lesson.id === 7 ? "72" : lesson.id === 5 ? "5" : "18";
  qs("#consoleOutput").textContent = u("\u7b49\u5f85\u4f60\u8fd0\u884c\u4ee3\u7801...");
  qs("#demoTeacher").textContent = u("\u5148\u731c\u4e00\u731c\u7ed3\u679c\uff0c\u518d\u70b9\u8fd0\u884c\u3002");
  qs("#coachNote").textContent = lesson.coach;
  renderRecall();
  const isDone = completed(lesson.id);
  qs("#lessonState").textContent = isDone ? u("\u5df2\u5b8c\u6210") : u("\u672a\u5b8c\u6210");
  qs("#lessonState").classList.toggle("finished", isDone);
  qs("#completeLesson").innerHTML = isDone ? u("\u8fd9\u4e00\u8bfe\u5df2\u5b8c\u6210 <span>OK</span>") : u("\u5b8c\u6210\u8fd9\u4e00\u8bfe <span>OK</span>");
  qsa("#dayList button").forEach((button) => {
    const day = Number(button.dataset.day);
    button.classList.toggle("active", day === lesson.id);
    button.classList.toggle("complete", completed(day));
  });
}
function renderDayList() {
  qs("#weekLabel").textContent = `WEEK ${String(Math.ceil(state.currentDay / 7)).padStart(2, "0")}`;
  qs("#dayList").innerHTML = lessons.map((lesson) => `<button type="button" data-day="${lesson.id}" class="${lesson.id === state.currentDay ? "active" : ""} ${completed(lesson.id) ? "complete" : ""}"><b>DAY ${String(lesson.id).padStart(2, "0")}</b><span>${lesson.short}</span></button>`).join("");
}
function renderReviewPanel() {
  const due = dueMistakes();
  const all = mistakeEntries();
  const button = qs("#startReview");
  qs("#reviewCount").textContent = due.length;
  if (due.length) {
    qs("#reviewHint").textContent = `今天有 ${due.length} 道错题等待你重新理解。`;
    qs("#reviewPanelText").textContent = `今天复习 ${due.length} 道错题，用“回忆”替代重看答案。`;
    button.disabled = false;
  } else if (all.length) {
    qs("#reviewHint").textContent = `已记录 ${all.length} 道错题，下一次会按间隔出现。`;
    qs("#reviewPanelText").textContent = "今天没有到期错题；先继续本课练习。";
    button.disabled = false;
  } else {
    qs("#reviewHint").textContent = "答错的题会自动进入复习队列。";
    qs("#reviewPanelText").textContent = "还没有错题；答错后会在这里安排复习。";
    button.disabled = true;
  }
}
function renderMilestones() {
  const projects = [
    [7, "第一周小作业", "写一个“分数是否及格”的互动程序"],
    [14, "函数小工具", "完成一个能复用的两数比较函数"],
    [21, "数据处理练习", "读入一组成绩，计算平均值并找出最高分"],
    [28, "结课作品", "选择真实小问题，完成一个可演示的 C 小程序"]
  ];
  qs("#projectMilestones").innerHTML = projects.map(([day, title, text]) => `<article class="${state.completedDays.includes(day) ? "done" : ""}"><span>DAY ${String(day).padStart(2, "0")}</span><h3>${title}</h3><p>${text}</p></article>`).join("");
}
function renderOverview() {
  const { answered, correct } = score();
  const day = currentLesson();
  const coursePercent = Math.round(state.completedDays.length / lessons.length * 100);
  const practicePercent = Math.round(answered / questions.length * 100);
  const minutePercent = Math.round(state.minutes / 45 * 100);
  qs("#courseProgress").textContent = `${state.completedDays.length} / ${lessons.length} days`;
  qs("#courseProgressNote").textContent = state.completedDays.length === 0 ? u("\u4ece\u7b2c 1 \u5929\u5f00\u59cb\uff0c\u5b8c\u6210\u540e\u4f1a\u7559\u4e0b\u8bb0\u5f55\u3002") : u("\u6bcf\u5b8c\u6210\u4e00\u5929\uff0c\u5c31\u589e\u52a0\u4e00\u4e2a\u7a33\u5b9a\u8282\u70b9\u3002");
  qs("#courseMeter").style.width = `${coursePercent}%`;
  qs("#chapterLabel").textContent = `Day ${day.id}: ${day.short}`;
  qs("#todayTopic").textContent = day.title;
  qs("#practiceProgress").textContent = `${answered} / ${questions.length}`;
  qs("#practiceMeter").style.width = `${practicePercent}%`;
  qs("#accuracyHint").textContent = answered ? `${u("\u7b54\u5bf9")} ${correct} / ${answered}` : u("每课都有概念、预测、找错与记忆强化题。");
  qs("#streakCount").textContent = state.streak;
  qs("#streakLabel").textContent = u("\u5929\u8fde\u7eed\u5b66\u4e60");
  qs("#todayGoal").textContent = `${state.minutes} / 45 ${u("\u5206\u949f")}`;
  qs("#sessionMinutes").textContent = state.minutes;
  qs("#goalMeter").style.width = `${minutePercent}%`;
  qs("#heroPromise").textContent = u("\u4e0d\u53ea\u662f\u770b\u4e00\u4e2a\u77e5\u8bc6\u70b9\u3002\u6bcf\u5929\u90fd\u6709\u4e00\u4e2a\u5b8c\u6574\u7684\u5c0f\u76ee\u6807\uff1a\u542c\u61c2\u3001\u52a8\u624b\u3001\u7ec3\u4e60\u3001\u7ed9\u81ea\u5df1\u4e00\u4e2a\u53ef\u89c1\u7684\u8fdb\u5ea6\u3002");
  qs("#reminderTime").value = state.reminder;
  renderReviewPanel();
  renderMilestones();
}
function renderPractice() {
  const dayQuestions = currentQuestions();
  if (questionIndex >= dayQuestions.length) questionIndex = 0;
  const question = dayQuestions[questionIndex];
  const existing = state.answers[question.id];
  locked = Boolean(existing);
  qs("#practiceHeading").textContent = `${currentLesson().title} - ${u("\u6982\u5ff5\u3001\u8bed\u6cd5\u3001\u8fd0\u884c\u9884\u6d4b\u548c\u627e\u9519\u9898\u5e93\u3002")}`;
  qs("#practiceLevel").textContent = `Day ${state.currentDay}`;
  qs("#questionCounter").textContent = `${u("\u672c\u8bfe\u9898\u5e93")} ${questionIndex + 1} / ${dayQuestions.length}`;
  qs("#questionType").textContent = question.type || u("\u6982\u5ff5\u7406\u89e3");
  qs("#questionText").textContent = question.q;
  qs("#answers").innerHTML = question.a.map((answer, index) => `<button type="button" data-index="${index}">${String.fromCharCode(65 + index)}. ${answer}</button>`).join("");
  if (existing) {
    qsa("#answers button").forEach((button) => {
      const index = Number(button.dataset.index);
      if (index === question.correct) button.classList.add("correct");
      else if (index === existing.choice) button.classList.add("wrong");
    });
    const feedback = qs("#feedback");
    feedback.className = `feedback ${existing.correct ? "good" : "bad"}`;
    feedback.textContent = `${existing.correct ? u("\u8fd9\u9898\u7b54\u5bf9\u4e86\u3002") : u("\u518d\u770b\u4e00\u904d\u8fd9\u4e2a\u903b\u8f91\u3002")} ${question.why}`;
  } else {
    qs("#feedback").className = "feedback";
    qs("#feedback").textContent = u("\u9009\u4e00\u4e2a\u7b54\u6848\u3002\u7b54\u9519\u4e5f\u4f1a\u544a\u8bc9\u4f60\u539f\u56e0\u3002");
  }
  const summary = score();
  qs("#scoreText").textContent = `${u("\u7d2f\u8ba1\u7b54\u5bf9")}: ${summary.correct}`;
}
function renderAll() { syncDate(); renderLesson(); renderOverview(); renderPractice(); save(); }

qs("#dayList").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-day]");
  if (!button) return;
  state.currentDay = Number(button.dataset.day);
  questionIndex = 0;
  renderAll();
});

qs("#runDemo").addEventListener("click", () => {
  const lesson = currentLesson();
  qs("#consoleOutput").textContent = lessonOutput(lesson, qs("#customText").value);
  qs("#demoTeacher").textContent = outputTip(lesson);
  addMinutes(4);
  renderOverview();
  save();
});

qs("#completeLesson").addEventListener("click", () => {
  const day = state.currentDay;
  if (!completed(day)) {
    state.completedDays.push(day);
    addMinutes(15);
  }
  renderAll();
});

qs("#answers").addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || locked) return;
  const question = currentQuestions()[questionIndex];
  const choice = Number(button.dataset.index);
  const correct = choice === question.correct;
  state.answers[question.id] = { choice, correct };
  if (!correct) {
    const previous = state.mistakes[question.id];
    state.mistakes[question.id] = { day: question.day, due: addDays(previous ? 2 : 1), stage: (previous?.stage || 0) + 1 };
  } else if (state.reviewTarget === question.id) {
    delete state.mistakes[question.id];
    state.reviewTarget = "";
  }
  addMinutes(5);
  renderAll();
});

qs("#nextQuestion").addEventListener("click", () => {
  questionIndex = (questionIndex + 1) % currentQuestions().length;
  renderPractice();
});

qs("#startReview").addEventListener("click", () => {
  const item = dueMistakes()[0] || mistakeEntries().sort((a, b) => a.due.localeCompare(b.due))[0];
  if (!item) return;
  state.currentDay = item.day;
  const index = currentQuestions().findIndex((question) => question.id === item.id);
  questionIndex = index >= 0 ? index : 0;
  delete state.answers[item.id];
  state.reviewTarget = item.id;
  renderAll();
  qs("#practice").scrollIntoView({ behavior: "smooth", block: "start" });
});

qs("#checkBlanks").addEventListener("click", () => {
  const lesson = currentLesson();
  const inputs = qsa("#recallBlanks input");
  let correctCount = 0;
  inputs.forEach((input) => {
    const correct = input.value.trim().toLowerCase().replace(/\s+/g, "") === input.dataset.answer.replace(/\s+/g, "");
    input.classList.toggle("good", correct);
    input.classList.toggle("bad", !correct);
    if (correct) correctCount += 1;
  });
  const feedback = qs("#blanksFeedback");
  if (correctCount === inputs.length) {
    feedback.className = "recall-feedback good";
    feedback.textContent = u("\u5173\u952e\u4f4d\u7f6e\u90fd\u60f3\u8d77\u6765\u4e86\u3002\u73b0\u5728\u8fdb\u5165\u5b8c\u6574\u9ed8\u5199\u3002");
    markRecall(`d${lesson.id}:blank`);
    renderOverview();
    save();
  } else {
    feedback.className = "recall-feedback bad";
    feedback.textContent = `${u("\u76ee\u524d\u5bf9\u4e86")} ${correctCount} / ${inputs.length}${u("\u4e2a\u3002\u5bf9\u7167\u4e0a\u65b9\u4ee3\u7801\u540e\uff0c\u7acb\u5373\u518d\u8bd5\u4e00\u6b21\u3002")}`;
  }
});

qs("#checkRecall").addEventListener("click", () => {
  const lesson = currentLesson();
  const plan = recallPlan(lesson);
  const value = cleanCode(qs("#codeRecall").value);
  const missing = plan.required.filter((piece) => !value.includes(cleanCode(piece)));
  const feedback = qs("#recallFeedback");
  if (!missing.length) {
    feedback.className = "recall-feedback good";
    feedback.textContent = u("\u9ed8\u5199\u901a\u8fc7\uff1a\u4f60\u5df2\u7ecf\u5199\u51fa\u4e86\u8fd9\u4e00\u8bfe\u7684\u6838\u5fc3\u9aa8\u67b6\u3002\u6709\u4e86\u9aa8\u67b6\uff0c\u7ec6\u8282\u5c31\u80fd\u6162\u6162\u53d8\u719f\u3002");
    qs("#recallStatus").textContent = u("\u5df2\u5b8c\u6210\u9ed8\u5199");
    markRecall(`d${lesson.id}:write`);
    renderOverview();
    save();
  } else {
    feedback.className = "recall-feedback bad";
    feedback.textContent = `${u("\u9aa8\u67b6\u8fd8\u5c11")} ${missing.length} ${u("\u5904\u5173\u952e\u5185\u5bb9\u3002\u5148\u770b\u4e00\u904d\u5c11\u7684\u90e8\u5206\uff0c\u7136\u540e\u5173\u6389\u63d0\u793a\u91cd\u5199\u3002")}`;
  }
});

qs("#reminderForm").addEventListener("submit", (event) => {
  event.preventDefault();
  state.reminder = qs("#reminderTime").value;
  qs("#reminderStatus").textContent = `${u("\u5df2\u4fdd\u5b58\uff1a\u6bcf\u5929")} ${state.reminder} ${u("\u8fdb\u884c 45 \u5206\u949f\u5b66\u4e60\u3002")}`;
  save();
});

qs("#gmailDraft").addEventListener("click", () => {
  const time = qs("#reminderTime").value;
  const subject = encodeURIComponent(`C Learn - ${time} study reminder`);
  const body = encodeURIComponent(`It is ${time}. Open C Learn and complete one guided C lesson plus two questions.`);
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${subject}&body=${body}`, "_blank", "noopener");
  qs("#reminderStatus").textContent = u("\u5df2\u6253\u5f00 Gmail \u8349\u7a3f\u3002");
});

qs("#resetProgress").addEventListener("click", () => {
  if (confirm("Reset all saved learning progress?")) {
    localStorage.removeItem("c-learn-v2");
    location.reload();
  }
});

renderAll();

