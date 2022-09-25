# Scheduler 调度器源码解读

- 对 React Scheduler 异步调度器源码进行解读
- 以下并发与源码一一对应，简化了部分非核心代码

整体流程图

![loop](./img/5.png)

## scheduleCallback

- 这是创建一个基于优先级的调度任务

```ts
/**
 * 暴露给外部调用，基于调度优先级计划执行回调
 * @param priorityLevel 调度优先级
 * @param callback 回调任务
 * @param options 配置项
 * @returns 调度的任务
 */
function scheduleCallback(
  priorityLevel: PriorityLevel,
  callback: Callback,
  options: Options
) {
  const currentTime = getCurrentTime()
  let startTime = currentTime + (options?.delay || 0)
  // 根据当前调度优先级获取到期时长
  let timeout =
    priorityLevelTimeoutMap[priorityLevel] ||
    priorityLevelTimeoutMap[PriorityLevel.NormalPriority]
  // 获取对应的到期时间点
  let expirationTime = startTime + timeout

  const newTask: Task = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  }

  // 任务开始时间未到则任务入队，并开启等待
  if (startTime > currentTime) {
    newTask.sortIndex = startTime
    push(timerQueue, newTask)
    if (peek(taskQueue) === null && peek(timerQueue) === newTask) {
      // 存在请求 Timeout 的调度
      if (isTimeoutScheduled) {
        clearHostTimeout()
      } else {
        isTimeoutScheduled = true
      }
      // 设置新的请求 Timeout 的调度
      setHostTimeout(startTime - currentTime)
    }
  } else {
    // 任务已经可以开始执行
    newTask.sortIndex = expirationTime
    push(taskQueue, newTask)
    // 不在请求 Callback 调度中，并且不在冲刷任务中则可以开始请求 Callback 调度
    if (!isCallbackScheduled && !isFlushWork) {
      isCallbackScheduled = true
      scheduledFlushWork = flushWork
      // 不在宏任务执行中
      if (!isInMessageLoop) {
        // 开启一个宏任务进行调度
        isInMessageLoop = true
        setHostTimeout(0)
      }
    }
  }
  return newTask
}
```

- 可以看到在创建新的调度任务时，会根据当前创建任务的开始时间添加到不同的队列中（队列其实是根据sortIndex排序的小顶堆）
  - 定时器队列：存放还未到开始时间的任务
  - 任务队列：存放已到达开始时间，但还没被执行的任务
- 当还未到达开始时间时，那么当前任务被添加到定时器队列中
  - 如果任务队列没有任务并且定时器队列中最早开始的任务是当前创建的任务，则重新创建一个基于当前任务开始时间差的定时器（也就是等待这个任务到达开始时间），并标记已经存在计划等待的定时器。否则什么也不做（因为已经存在计划等待的定时器了）
- 当已经到达开始时间时，那么当前任务被添加到任务队列中
  - 如果当前不在计划执行回调的定时器并且不在冲刷工作中，那么标记当前可以计划回调和冲刷任务，如果不在宏任务回调执行中，那么标记执行中，并设置一个宏任务回调

![scheduleCallback](./img/4.png)

## setHostTimeout

- 设置定时任务

```ts
function setHostTimeout(delay: number) {
  if (delay) {
    // 有延时，设置定时回调
    timeoutId = localSetTimeout?.(handleTimeout, delay) || timeoutId
  } else {
    // 无延时，直接执行回调
    schedulePerformWorkUntilDeadline()
  }
}
```

分2种情况：

1. 无延时的任务：启动一个宏任务回调，无delay，相当于 `setTimeout(workUntil, 0)`
2. 有延时的任务：启动一个有delay的宏任务回调，并且在回调任务执行时判断一些逻辑，相当于 `setTimeout(handleTimeout, delay)`

### handleTimeout

- 这个是专门用于有delay的宏任务回调，因为delay了，期间可能有新任务，所以需要重新判断队列情况

```ts
function handleTimeout() {
  const currentTime = getCurrentTime()
  isTimeoutScheduled = false
  // 重新整理队列，可能在delay期间有新任务进来
  advanceTimers(currentTime)
  if (!isCallbackScheduled) {
    // 任务队列不为空
    if (peek(taskQueue) !== null) {
      isCallbackScheduled = true
      // 请求执行任务
      requestFlushWork()
    } else {
      // 不存在需要立即执行的任务，则等待执行最早开始的任务
      requestSetTimeoutWork(currentTime)
    }
  }
}
```

- 执行callback任务的请求只能有一个，如果重复请求将不生效，直到这个请求的任务进入执行中
- 等待timeout任务的请求也只会存在一个，如果重复请求，将会清除上一个timeout并重新设置一个

以上这些是为了保障只会有一个callback请求和timeout请求，也就意味着只通过一个callback和timeout宏任务回调来完成异步调度

### requestFlushWork

- 请求执行任务，并在下一次宏任务（无延迟）回调中执行workUntil

```ts
function requestFlushWork() {
  // 到这一步说明有确切的任务需要冲刷（也就是遍历执行），这里就是设置了冲刷方法
  scheduledFlushWork = flushWork
  // 当前不在任务执行中
  if (!isInMessageLoop) {
    isInMessageLoop = true
    // 安排宏任务
    setHostTimeout(0)
  }
}
```

- 在这里就明确有冲刷任务的需求，但是是否立即安排冲刷取决于当前是否已经在一个冲刷安排中了，这是为了避免安排多个同时存在的冲刷任务，实际上只需要一个就够，并且动态读取scheduledFlushWork冲刷任务就能实现更新
- 这里就体现了异步回调的处理方式，不仅要考虑当前执行的情况，还要考虑其他任务对当前执行的影响，无论有多少次请求，都能保证调度的一致性

### requestSetTimeoutWork

- 这个函数就是保证一直都有等待执行的任务，直到双队列都为空为止

```ts
function requestSetTimeoutWork(currentTime: number) {
  // 最早开始的任务
  const task = peek(timerQueue)
  if (task !== null) {
    // 设置一个定时器，在预期开始时间执行任务
    setHostTimeout(task.startTime - currentTime)
  }
}
```

## workUntil

- 这个就是执行任务的回调入口

```ts
function workUntil() {
  // 当前存在预定执行的任务，判断待执行的冲刷任务
  if (scheduledFlushWork !== null) {
    const currentTime = getCurrentTime()
    // 设置可执行到的最晚时刻
    deadline = currentTime + yieldInterval
    let hasMoreWorker = true
    try {
      hasMoreWorker = scheduledFlushWork(true, currentTime)
    } finally {
      // 有需要继续执行的任务
      if (hasMoreWorker) {
        // 设置一个宏任务，继续执行剩余任务（这里主要用于处理过期后需要继续执行的任务）
        // 下一个宏任务是还有isInMessageLoop和scheduledFlushWork的，并没有重置，所以可以直接再次进入workUntil
        setHostTimeout(0)
      } else {
        // 重置标志
        isInMessageLoop = false
        // 重置预定任务，说明请求的任务执行完成了
        scheduledFlushWork = null
      }
    }
  } else {
    // 执行完成，退出宏任务回调
    isInMessageLoop = false
  }
}
```

## flushWork

- 这才是实际冲刷任务的函数

```ts
function flushWork(inWorkUntil: boolean, beginTime: number) {
  // 清除执行任务请求标识，说明已经进入执行任务，并非处于事件循环等待宏任务调度中
  isCallbackScheduled = false
  if (isTimeoutScheduled) {
    isTimeoutScheduled = false
    clearHostTimeout()
  }

  // 开始冲刷
  isFlushWork = true

  // 保留冲刷前的优先级，用于冲刷后恢复优先级
  const prePriority = currentPriorityLevel

  try {
    // 冲刷开始
    return workLoop(inWorkUntil, beginTime)
  } finally {
    currentTask = null
    currentPriorityLevel = prePriority
    isFlushWork = false
  }
}
```

## workLoop

- 这是遍历执行任务的函数，是调度实际任务和blocked的地方

```ts
function workLoop(inWorkUntil: boolean, beginTime: number) {
  let currentTime = beginTime
  advanceTimers(currentTime)
  // 获取第一个任务
  currentTask = peek(taskQueue)
  while (currentTask !== null) {
    // 当前任务未到期，并且不需要被打断
    if (
      currentTask.expirationTime > currentTime &&
      (!inWorkUntil || shouldBreak())
    ) {
      break
    }

    const callback = currentTask.callback
    if (typeof callback === 'function') {
      currentTask.callback = null
      currentPriorityLevel = currentTask.priorityLevel
      // 执行任务回调，传入当前任务是否到期执行标志，用于回调内部判断到期后是否需要继续执行
      const returnValue = callback(currentTime >= currentTask.expirationTime)
      currentTime = getCurrentTime()
      if (typeof returnValue === 'function') {
        currentTask.callback = returnValue
      } else {
        // 没有返回新任务则执行下一个任务
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue)
        }
      }
      advanceTimers(currentTime)
    } else {
      pop(taskQueue)
    }
    currentTask = peek(taskQueue)
  }

  // 被打断后，当前还有任务未执行
  if (currentTask !== null) {
    // 需要继续执行，但是在下一个宏任务中执行
    return true
  } else {
    // 没有，则开始等待剩余任务中最早要执行的任务
    requestSetTimeoutWork(currentTime)
    return false
  }
}

// 这个函数，默认以时间片维度来blocked，也可以自己定制blocked逻辑
function shouldBreak() {
  return getCurrentTime() >= deadline
}
```

- 这个函数核心逻辑就是遍历执行taskQueue任务，并且在每执行一个task之前都判断一下是否还有时间片，如果没有那么就直接中断本次冲刷任务（所以可能还有部分task还未执行完成，需要到下一轮的冲刷中执行）。
- 这里其实是把每次冲刷任务的时间用时间片（基于配置的yieldInterval，默认5ms）来划分，也就是在一轮宏任务冲刷过程中最长执行时间是5ms左右， 其实就是为了尽可能保证在16ms内只抽出5ms时间执行冲刷，保证画面渲染时间。但是不一定会刚好5ms，如果一个task占用了大量时间，那么也得等待这个task执行完成，毕竟每个task执行中是不可分割的，只是每次冲刷任务是可以中断的
- 当然如果存在一个执行时间超过5ms的任务，并且一直都会重复创建（也就是存在常驻的大于5ms的任务），那么随着时间积累，taskQueue的task数量只会不断递增，导致实际消费速度跟不上生产速度，最终就会造成内存爆炸。当然目前如果只是react内部渲染时产生的task我们可以不必担心会存在超过5ms的任务，除非我们自己单独使用scheduler库来做一些异步调度的事情，这时就要小心了

## 全流程

![scheduler](./img/6.png)

## 0.23.0 最新源码解读

- 这里的是原原本本的源码内容

```js
import type {PriorityLevel} from '../SchedulerPriorities';

import {
  enableSchedulerDebugging,
  enableProfiling,
  enableIsInputPending,
  enableIsInputPendingContinuous,
  frameYieldMs,
  continuousYieldMs,
  maxYieldMs,
} from '../SchedulerFeatureFlags';

import {push, pop, peek} from '../SchedulerMinHeap';

import {
  ImmediatePriority,
  UserBlockingPriority,
  NormalPriority,
  LowPriority,
  IdlePriority,
} from '../SchedulerPriorities';
import {
  markTaskRun,
  markTaskYield,
  markTaskCompleted,
  markTaskCanceled,
  markTaskErrored,
  markSchedulerSuspended,
  markSchedulerUnsuspended,
  markTaskStart,
  stopLoggingProfilingEvents,
  startLoggingProfilingEvents,
} from '../SchedulerProfiling';

export type Callback = boolean => ?Callback;

type Task = {
  id: number,
  callback: Callback | null,
  priorityLevel: PriorityLevel,
  startTime: number,
  expirationTime: number,
  sortIndex: number,
  isQueued?: boolean,
};

// 初始化 getCurrentTime 方法，调用此方法将返回从代码执行到当前进过的毫秒数
let getCurrentTime: () => number | DOMHighResTimeStamp;
const hasPerformanceNow =
  typeof performance === 'object' && typeof performance.now === 'function';
// polyfill
if (hasPerformanceNow) {
  const localPerformance = performance;
  getCurrentTime = () => localPerformance.now();
} else {
  const localDate = Date;
  const initialTime = localDate.now();
  getCurrentTime = () => localDate.now() - initialTime;
}

// 最大整数
// Math.pow(2, 30) - 1
// 0b111111111111111111111111111111
var maxSigned31BitInt = 1073741823;

// 立刻超时
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
// 超时时间
var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000;
// 永不超时
var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt;

// 任务存储在最小堆上
var taskQueue = [];
var timerQueue = [];

// 任务递增计数器，用于维护插入顺序
var taskIdCounter = 1;

// 调试时暂停调度
var isSchedulerPaused = false;

// 当前任务
var currentTask = null;
// 当前优先级
var currentPriorityLevel = NormalPriority;

// 这是在执行工作时设置的，以防止重新进入
var isPerformingWork = false;

// 是否安排了回调，以防多次安排回调
var isHostCallbackScheduled = false;
// 是否安排了超时，以防多次安排超时
var isHostTimeoutScheduled = false;

// 捕获对本地 API 的本地引用，以防 polyfill 覆盖它们
const localSetTimeout = typeof setTimeout === 'function' ? setTimeout : null;
const localClearTimeout =
  typeof clearTimeout === 'function' ? clearTimeout : null;
const localSetImmediate =
  typeof setImmediate !== 'undefined' ? setImmediate : null; // IE and Node.js + jsdom

// 是否有待处理的输入
const isInputPending =
  typeof navigator !== 'undefined' &&
  navigator.scheduling !== undefined &&
  navigator.scheduling.isInputPending !== undefined
    ? navigator.scheduling.isInputPending.bind(navigator.scheduling)
    : null;

const continuousOptions = {includeContinuous: enableIsInputPendingContinuous};

// 检查不再延迟的任务并将它们添加到任务队列中
function advanceTimers(currentTime) {
  let timer = peek(timerQueue);
  while (timer !== null) {
    if (timer.callback === null) {
      // 任务被取消
      pop(timerQueue);
    } else if (timer.startTime <= currentTime) {
      // 第一个timer任务，被添加到task queue
      pop(timerQueue);
      timer.sortIndex = timer.expirationTime;
      push(taskQueue, timer);
      if (enableProfiling) {
        markTaskStart(timer, currentTime);
        timer.isQueued = true;
      }
    } else {
      // 剩余的任务，还需要等待，不能直接调用
      return;
    }
    timer = peek(timerQueue);
  }
}

// 等待超时后，处理
function handleTimeout(currentTime) {
  // 重置安排超时
  isHostTimeoutScheduled = false;
  advanceTimers(currentTime);

  // 没有安排回调，如果已经有安排回调，那这里就不能再安排了
  if (!isHostCallbackScheduled) {
    if (peek(taskQueue) !== null) {
      // 存在就绪的任务，安排回调
      isHostCallbackScheduled = true;
      // 回调中进行冲刷工作
      requestHostCallback(flushWork);
    } else {
      const firstTimer = peek(timerQueue);
      if (firstTimer !== null) {
        // 存在超时任务，安排超时
        requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
      }
    }
  }
}

// 冲刷工作
function flushWork(hasTimeRemaining, initialTime) {
  // 进入冲刷工作，回调完成，重置回调，用于下次安排回调
  isHostCallbackScheduled = false;
  if (isHostTimeoutScheduled) {
    // 如果我们安排了超时，并且还没执行，那么取消它，因为当前已经进入冲刷工作了，避免超时后重复进入
    isHostTimeoutScheduled = false;
    cancelHostTimeout();
  }

  // 开始冲刷
  isPerformingWork = true;
  // 保存当前上下文优先级
  const previousPriorityLevel = currentPriorityLevel;
  try {
    // 工作循环
    return workLoop(hasTimeRemaining, initialTime);
  } finally {
    currentTask = null;
    // 恢复优先级
    currentPriorityLevel = previousPriorityLevel;
    isPerformingWork = false;
  }
}

// 工作循环
function workLoop(hasTimeRemaining, initialTime) {
  let currentTime = initialTime;
  advanceTimers(currentTime);
  currentTask = peek(taskQueue);
  // 只有在当前没有任务，或者在调试模式下暂停时才不继续循环
  while (
    currentTask !== null &&
    !(enableSchedulerDebugging && isSchedulerPaused)
  ) {
    // 任务未到期，并且没有足够时间或者需要打断时，跳出循环
    if (
      currentTask.expirationTime > currentTime &&
      (!hasTimeRemaining || shouldYieldToHost())
    ) {
      // 这个 currentTask 还没有过期，我们已经到了最后期限
      break;
    }
    const callback = currentTask.callback;
    if (typeof callback === 'function') {
      currentTask.callback = null;
      // 设置当前优先级为任务优先级
      currentPriorityLevel = currentTask.priorityLevel;
      const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
      // 执行任务回调
      const continuationCallback = callback(didUserCallbackTimeout);
      currentTime = getCurrentTime();
      if (typeof continuationCallback === 'function') {
        // 如果继续返回回调，那么立刻让出线程，不管是否还有时间片
        currentTask.callback = continuationCallback;
        advanceTimers(currentTime);
        return true;
      } else {
        if (currentTask === peek(taskQueue)) {
          pop(taskQueue);
        }
        advanceTimers(currentTime);
      }
    } else {
      pop(taskQueue);
    }
    currentTask = peek(taskQueue);
  }
  // 有额外的工作还需要继续执行
  if (currentTask !== null) {
    return true;
  } else {
    // 没有额外的工作，则安排超时
    const firstTimer = peek(timerQueue);
    if (firstTimer !== null) {
      requestHostTimeout(handleTimeout, firstTimer.startTime - currentTime);
    }
    return false;
  }
}

// 基于优先级，执行回调
function unstable_runWithPriority<T>(
  priorityLevel: PriorityLevel,
  eventHandler: () => T,
): T {
  switch (priorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
    case LowPriority:
    case IdlePriority:
      break;
    default:
      priorityLevel = NormalPriority;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

// 高优先级减低到正常优先级执行
function unstable_next<T>(eventHandler: () => T): T {
  var priorityLevel;
  switch (currentPriorityLevel) {
    case ImmediatePriority:
    case UserBlockingPriority:
    case NormalPriority:
      //  高优降低到正常
      priorityLevel = NormalPriority;
      break;
    default:
      // 低优先级继续保存低优
      priorityLevel = currentPriorityLevel;
      break;
  }

  var previousPriorityLevel = currentPriorityLevel;
  currentPriorityLevel = priorityLevel;

  try {
    return eventHandler();
  } finally {
    currentPriorityLevel = previousPriorityLevel;
  }
}

// 包装基于当前上下文优先级的函数
function unstable_wrapCallback<T: (...Array<mixed>) => mixed>(callback: T): T {
  var parentPriorityLevel = currentPriorityLevel;
  return function() {
    // 内联函数，为了额外性能
    var previousPriorityLevel = currentPriorityLevel;
    currentPriorityLevel = parentPriorityLevel;

    try {
      return callback.apply(this, arguments);
    } finally {
      currentPriorityLevel = previousPriorityLevel;
    }
  };
}

// 调度
function unstable_scheduleCallback(
  priorityLevel: PriorityLevel,
  callback: Callback,
  options?: {delay: number},
): Task {
  var currentTime = getCurrentTime();

  var startTime;
  if (typeof options === 'object' && options !== null) {
    var delay = options.delay;
    if (typeof delay === 'number' && delay > 0) {
      startTime = currentTime + delay;
    } else {
      startTime = currentTime;
    }
  } else {
    startTime = currentTime;
  }

  var timeout;
  switch (priorityLevel) {
    case ImmediatePriority:
      timeout = IMMEDIATE_PRIORITY_TIMEOUT;
      break;
    case UserBlockingPriority:
      timeout = USER_BLOCKING_PRIORITY_TIMEOUT;
      break;
    case IdlePriority:
      timeout = IDLE_PRIORITY_TIMEOUT;
      break;
    case LowPriority:
      timeout = LOW_PRIORITY_TIMEOUT;
      break;
    case NormalPriority:
    default:
      timeout = NORMAL_PRIORITY_TIMEOUT;
      break;
  }

  // 基于优先级设置过期时间点
  var expirationTime = startTime + timeout;

  var newTask: Task = {
    id: taskIdCounter++,
    callback,
    priorityLevel,
    startTime,
    expirationTime,
    sortIndex: -1,
  };

  if (startTime > currentTime) {
    // 延迟任务
    newTask.sortIndex = startTime;
    push(timerQueue, newTask);
    if (peek(taskQueue) === null && newTask === peek(timerQueue)) {
      // 所有任务都有延迟，这是延迟最早的任务
      if (isHostTimeoutScheduled) {
        // 取消现有的超时任务
        cancelHostTimeout();
      } else {
        isHostTimeoutScheduled = true;
      }
      // 安排超时任务
      requestHostTimeout(handleTimeout, startTime - currentTime);
    }
  } else {
    newTask.sortIndex = expirationTime;
    push(taskQueue, newTask);
    // 如果调度已经开始了，或者在冲刷工作中，那么不再进入调度，而是被动调度
    // 如果未开始调度，则安排调度
    if (!isHostCallbackScheduled && !isPerformingWork) {
      isHostCallbackScheduled = true;
      // 安排回调调度
      requestHostCallback(flushWork);
    }
  }

  return newTask;
}

// 暂停，调试用
function unstable_pauseExecution() {
  isSchedulerPaused = true;
}

// 继续执行，调试用
function unstable_continueExecution() {
  isSchedulerPaused = false;
  // 如果当前未安排调度，并且不在冲刷中，则安排调度开始
  if (!isHostCallbackScheduled && !isPerformingWork) {
    isHostCallbackScheduled = true;
    requestHostCallback(flushWork);
  }
}

// 获取第一个就绪回调任务
function unstable_getFirstCallbackNode(): Task | null {
  return peek(taskQueue);
}

// 取消任务
function unstable_cancelCallback(task: Task) {
  // 不能从队列中删除，因为是基于数组的堆，只能将回调置为空，这样在冲刷的时候就会跳过这个任务
  task.callback = null;
}

// 获取当前上下文优先级
function unstable_getCurrentPriorityLevel(): PriorityLevel {
  return currentPriorityLevel;
}

let isMessageLoopRunning = false;
let scheduledHostCallback = null;
let taskTimeoutID: TimeoutID = (-1: any);


// 调度器会主动让出，防止主线程还有其他工作，比如用户事件，默认调度时长5ms
// 它不会与帧对齐，因为大多数任务不需要帧对齐，如果需要帧对齐就用requestAnimationFrame。
let frameInterval = frameYieldMs;
const continuousInputInterval = continuousYieldMs;
const maxInterval = maxYieldMs;
let startTime = -1;

let needsPaint = false;

function shouldYieldToHost(): boolean {
  const timeElapsed = getCurrentTime() - startTime;
  if (timeElapsed < frameInterval) {
    // 主线程被阻塞时长还小于时间片5ms（这里由帧率控制，默认5ms），可以继续执行，不要中断
    return false;
  }

  // 已经阻塞足够长时间，并且如果有高优任务，比如绘制、输入等，那么需要主动让出，
  // 最长阻塞时间为300ms，为了主动让出，给其他工作执行，比如网络处理
  if (enableIsInputPending) {
    if (needsPaint) {
      // 如果有待处理的绘制请求，那么立刻让出
      return true;
    }
    if (timeElapsed < continuousInputInterval) {
      // 阻塞时长还未达到连续输入时长，并且当前有输入等待，那么立刻返回（解决连续输入情况，主动持续让出）
      if (isInputPending !== null) {
        return isInputPending();
      }
    } else if (timeElapsed < maxInterval) {
      // 有连续输入，并且已经阻塞超过连续输入时长，那么立刻返回
      if (isInputPending !== null) {
        return isInputPending(continuousOptions);
      }
    } else {
      // 已经阻塞很长时间了（300ms），需要主动让出，可能还有其他工作要做，比如处理网络
      return true;
    }
  }

  // 超出最长时间片，主动让出
  return true;
}

// 请求绘制
function requestPaint() {
  if (
    enableIsInputPending &&
    navigator !== undefined &&
    navigator.scheduling !== undefined &&
    navigator.scheduling.isInputPending !== undefined
  ) {
    needsPaint = true;
  }
}

function forceFrameRate(fps: number) {
  if (fps < 0 || fps > 125) {
    // 不支持帧率大于125
    console['error'](
      'forceFrameRate takes a positive int between 0 and 125, ' +
        'forcing frame rates higher than 125 fps is not supported',
    );
    return;
  }
  if (fps > 0) {
    frameInterval = Math.floor(1000 / fps);
  } else {
    // 重置帧率
    frameInterval = frameYieldMs;
  }
}

const performWorkUntilDeadline = () => {
  if (scheduledHostCallback !== null) {
    const currentTime = getCurrentTime();
    // 用于跟踪执行时长
    startTime = currentTime;
    const hasTimeRemaining = true;

    // 如果scheduledHostCallback抛出错误，那么将默认继续执行后面的任务
    let hasMoreWork = true;
    try {
      hasMoreWork = scheduledHostCallback(hasTimeRemaining, currentTime);
    } finally {
      if (hasMoreWork) {
        // 如果还有待执行任务，那么在下一个事件循环宏任务中执行
        schedulePerformWorkUntilDeadline();
      } else {
        isMessageLoopRunning = false;
        scheduledHostCallback = null;
      }
    }
  } else {
    isMessageLoopRunning = false;
  }
  // 如果被绘制让出，那么在这里可以重置绘制标识
  needsPaint = false;
};

let schedulePerformWorkUntilDeadline;
if (typeof localSetImmediate === 'function') {
  // Immediately更早运行，更符合调度，比如在node下优先使用
  schedulePerformWorkUntilDeadline = () => {
    localSetImmediate(performWorkUntilDeadline);
  };
} else if (typeof MessageChannel !== 'undefined') {
  // 在浏览器环境下优先使用MessageChannel，因为setTimeout有最小4ms限制
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;
  schedulePerformWorkUntilDeadline = () => {
    port.postMessage(null);
  };
} else {
  // 回退到最兼容的方式
  schedulePerformWorkUntilDeadline = () => {
    localSetTimeout(performWorkUntilDeadline, 0);
  };
}

// 请求回调任务
function requestHostCallback(callback) {
  scheduledHostCallback = callback;
  if (!isMessageLoopRunning) {
    isMessageLoopRunning = true;
    schedulePerformWorkUntilDeadline();
  }
}

// 请求超时任务
function requestHostTimeout(callback, ms) {
  taskTimeoutID = localSetTimeout(() => {
    callback(getCurrentTime());
  }, ms);
}

// 取消超时任务
function cancelHostTimeout() {
  localClearTimeout(taskTimeoutID);
  taskTimeoutID = ((-1: any): TimeoutID);
}

export {
  ImmediatePriority as unstable_ImmediatePriority,
  UserBlockingPriority as unstable_UserBlockingPriority,
  NormalPriority as unstable_NormalPriority,
  IdlePriority as unstable_IdlePriority,
  LowPriority as unstable_LowPriority,
  unstable_runWithPriority,
  unstable_next,
  unstable_scheduleCallback,
  unstable_cancelCallback,
  unstable_wrapCallback,
  unstable_getCurrentPriorityLevel,
  shouldYieldToHost as unstable_shouldYield,
  requestPaint as unstable_requestPaint,
  unstable_continueExecution,
  unstable_pauseExecution,
  unstable_getFirstCallbackNode,
  getCurrentTime as unstable_now,
  forceFrameRate as unstable_forceFrameRate,
};
```