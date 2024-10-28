import { Stage, Layer, Rect } from 'react-konva';

const Canvas = () => {
  return (
    <Stage width={window.innerWidth} height={window.innerHeight}>
      <Layer>
        <Rect x={20} y={20} width={100} height={50} fill="red" />
      </Layer>
    </Stage>
  );
};

export default Canvas;