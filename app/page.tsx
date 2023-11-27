'use client'

import { useEffect, useRef } from "react"
import MainApp from "../viewer3D/MainApp"
import {INIT_CANVAS} from '../const/index '
import styles from  '../css/page.module.css'

console.log(styles);

export default function Page() { 
  const mainApp = useRef(null)
  const initResult = useRef(null)
useEffect(() => {
  const initializeWebGPU = async () => {
      mainApp.current = new MainApp(INIT_CANVAS);

    if (!initResult.current) return;

    initResult.current.innerHTML = mainApp.current.initWebGPU();
    await mainApp.current.initWebGPUConfig();
    mainApp.current.app_options.createTriangle()
    mainApp.current.Update();
  };

  initializeWebGPU();
}, []);
  return(
    <>
      <p id="init_result"  ref={initResult}></p>
      <canvas id={INIT_CANVAS} width="640" height="480" className={styles.page_canvas}/>
    </>
  ) }


/**0
 * 现在目前两种模式编写 代码 
 * 一种是 比较新的使用 wgsl 语言编写的 (我们优先使用) webgpu不同于以前是个异步api
 * 一种是 旧的使用 glsl 语言编写的 然后编译转换为 wgsl 语言
 * **/