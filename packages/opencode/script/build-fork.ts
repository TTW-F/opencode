#!/usr/bin/env bun
// CS Agent fork 补丁 #1:构建目标裁剪 + 版本标记
//
// 上游 build.ts 默认编译 13 个目标(linux/darwin/win32 × arch × abi),对本工程(单机部署 linux-x64、
// 开发机 win32-x64)纯属浪费,且每次构建都要下载全部平台的原生依赖。
// 用法:bun run packages/opencode/script/build.ts --targets=linux-x64,win32-x64
// 不带 --targets 时保持上游行为(全量目标)。
//
// 版本标记:上游版本号来自 Script.version(构建期注入 OPENCODE_VERSION),源码运行时为 "local"。
// 这里统一加 `-cs.N` 后缀,使 `opencode --version` 能证明"跑的是本工程的构建"。

import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
process.chdir(path.resolve(__dirname, ".."))

const targetsArg = process.argv.find((a) => a.startsWith("--targets="))
if (targetsArg) {
  process.env.CS_FORK_TARGETS = targetsArg.slice("--targets=".length).trim()
}
if (!process.env.OPENCODE_VERSION) {
  const base = "1.18.35" // 与 submodule 钉住的 tag 一致
  process.env.OPENCODE_VERSION = `${base}-cs.1`
}

await import("./build.ts")
