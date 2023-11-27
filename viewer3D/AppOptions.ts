import MainApp from "./MainApp";

class AppOPtions {
    mainApp: MainApp;
    object: Record<string, any> = {}
    constructor(mainApp: MainApp) {
        this.mainApp = mainApp
    }
    vertexBuffers: any[] = []
    pipeline: GPURenderPipeline;
    vertexBuffer: GPUBuffer;
    // 绘制三角形
    protected async createTriangle(color: string = '(1.0,1.0,1.0,1.0)') {
        const swapChainFormat = "bgra8unorm";
        const swapChain = this.mainApp.context.configure({
            device: this.mainApp.device,
            format: navigator.gpu.getPreferredCanvasFormat(),
            alphaMode: "premultiplied",

        })

        const shaders = this.chusetrigangleShader(color);

        //编译着色器
        const shaderModule = this.mainApp.device.createShaderModule({
            code: shaders,
        })
        const vertices = new Float32Array([
        0.0, 0.6, 0, 1, 1, 0, 0, 1, -0.5, -0.6, 0, 1, 0, 1, 0, 1, 0.5, -0.6, 0, 1, 0,
        0, 1, 1,
    ]);
    this.vertexBuffer = this.mainApp.device.createBuffer({
        size: vertices.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    this.mainApp.device.queue.writeBuffer(this.vertexBuffer, 0, vertices.buffer);
        //
        this.vertexBuffers = [
            {
                attributes: [
                    {
                        shaderLocation: 0, // 位置
                        offset: 0,
                        format: "float32x4",
                    },
                    {
                        shaderLocation: 1, // 颜色
                        offset: 16,
                        format: "float32x4",
                    },
                ],
                arrayStride: 32,
                stepMode: "vertex",
            },
        ];
      const pipelineDescriptor = {
  vertex: {
    module: shaderModule,
    entryPoint: "vertex_main",
    buffers: this.vertexBuffers,
  },
  fragment: {
    module: shaderModule,
    entryPoint: "fragment_main",
    targets: [
      {
        format: navigator.gpu.getPreferredCanvasFormat(),
      },
    ],
  },
  primitive: {
    topology: "triangle-list",
  },
  layout: "auto",
};
        //创建渲染管线
        const pipeline = this.mainApp.device.createRenderPipeline(pipelineDescriptor)
        console.log(pipeline);
        
        this.pipeline = pipeline
    }



    // wgsl
    protected chusetrigangleShader(color: string = '(1.0,1.0,1.0,1.0)') {
        const shaders = `
struct VertexOut {
  @builtin(position) position : vec4f,
  @location(0) color : vec4f
}

@vertex
fn vertex_main(@location(0) position: vec4f,
               @location(1) color: vec4f) -> VertexOut
{
  var output : VertexOut;
  output.position = position;
  output.color = color;
  return output;
}

@fragment
fn fragment_main(fragData: VertexOut) -> @location(0) vec4f
{
  return fragData.color;
}
`;
        return shaders
    }
}



export default AppOPtions;