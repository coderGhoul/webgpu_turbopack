import AppOPtions from "./AppOptions";
import { WEBGPU } from '../const/index '
class MainApp {
    _canvas: HTMLCanvasElement;

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    set canvas(value: HTMLCanvasElement) {
        this._canvas = value;
    }
    //adater
    adapter: GPUAdapter;
    //device
    device: GPUDevice;
    //context
    context: GPUCanvasContext;

    app_options: AppOPtions
    constructor(canvasId: string) {
        this.initCanvas(canvasId);
        // this.initWebGPU();
    }

    //初始化canvas
    private initCanvas(canvasId: string) {
        let _cavnas = this.checkDom(canvasId);

        if (_cavnas) {
            this._canvas = _cavnas as HTMLCanvasElement;
        }
    }

    //检查dom
    private checkDom(id: string) {
        let dom = document.getElementById(id);
        if (dom)
            return dom;
        else
            return null
    }
    async initWebGPUConfig() {
        this.adapter = await navigator.gpu.requestAdapter();
        this.device = await this.adapter.requestDevice();
        this.context = this._canvas.getContext('webgpu');
        return this
    }
    //初始化webgl
    initWebGPU(string: string = WEBGPU) {
        console.log(string);

        let result = `good!your can use ${string}`;
        switch (string) {
            case WEBGPU:
                if (!navigator.gpu) {
                    result = `sorry,your browser can't support ${string}`;
                }
                break;
            default:
                if (!this._canvas.getContext(string))
                    result = `sorry,your browser can't support webgl`;
                break;
        }
        this.app_options = new AppOPtions(this);
        return result;
    }


    Update() {
        if (this === undefined) return
        const commandEncoder = this.device.createCommandEncoder();
        const clearColor = { r: 1.0, g: 0.0, b: 0.0, a: 1.0 };

     const renderPassDescriptor = {
  colorAttachments: [
    {
      clearValue: clearColor,
      loadOp: "clear",
      storeOp: "store",
      view: this.context.getCurrentTexture().createView(),
    },
  ],
};

    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);
   passEncoder.setPipeline(this.app_options.pipeline);
passEncoder.setVertexBuffer(0, this.app_options.vertexBuffer);
passEncoder.draw(3);
        // this.device.queue.submit([commandEncoder.finish()]);
        passEncoder.end();

this.device.queue.submit([commandEncoder.finish()]);
        requestAnimationFrame(this.Update.bind(this));

    }


}

export default MainApp;