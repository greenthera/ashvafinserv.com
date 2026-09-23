import { useEffect, useRef } from 'react';
import { money } from '../lib/financeMath.js';

/** Draws the branded canvas line chart, exactly mirroring the original drawLineChart(). */
export default function useLineChart(values, color, pointsPerYear = 1) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !values.length) return;

    const yearLabel = (index) => `Year ${Math.max(1, Math.ceil((index + 1) / pointsPerYear))}`;

    const context = canvas.getContext('2d');
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    context.scale(ratio, ratio);
    context.clearRect(0, 0, width, height);

    const padding = { top: 24, right: 18, bottom: 30, left: 94 };
    const plotWidth = width - padding.left - padding.right;
    const plotHeight = height - padding.top - padding.bottom;
    const maximum = Math.max(...values, 1);
    const minimum = Math.min(...values, 0);
    const range = maximum - minimum || 1;
    const point = (amount, index) => ({
      x: padding.left + (index / Math.max(values.length - 1, 1)) * plotWidth,
      y: padding.top + plotHeight - ((amount - minimum) / range) * plotHeight,
    });
    const graphValue = (amount) => money.format(Math.round(amount));

    context.strokeStyle = '#dce8f2';
    context.lineWidth = 1;
    context.font = '9px Inter, system-ui, sans-serif';
    context.fillStyle = '#6e7f91';
    context.textAlign = 'right';
    context.textBaseline = 'middle';
    for (let line = 0; line < 4; line += 1) {
      const y = padding.top + (plotHeight / 3) * line;
      const lineValue = maximum - (range / 3) * line;
      context.beginPath();
      context.moveTo(padding.left, y);
      context.lineTo(width - padding.right, y);
      context.stroke();
      context.fillText(graphValue(lineValue), padding.left - 7, y);
    }

    const points = values.map(point);
    const fill = context.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    fill.addColorStop(0, `${color}33`);
    fill.addColorStop(1, `${color}00`);
    context.beginPath();
    context.moveTo(points[0].x, height - padding.bottom);
    points.forEach(({ x, y }) => context.lineTo(x, y));
    context.lineTo(points.at(-1).x, height - padding.bottom);
    context.closePath();
    context.fillStyle = fill;
    context.fill();

    context.beginPath();
    points.forEach(({ x, y }, index) => (index ? context.lineTo(x, y) : context.moveTo(x, y)));
    context.strokeStyle = color;
    context.lineWidth = 2.5;
    context.stroke();
    context.fillStyle = color;
    [points[0], points.at(-1)].forEach(({ x, y }) => {
      context.beginPath();
      context.arc(x, y, 3.5, 0, Math.PI * 2);
      context.fill();
    });

    context.font = '10px Inter, system-ui, sans-serif';
    context.fillStyle = '#52677b';
    context.textBaseline = 'middle';
    context.textAlign = 'left';
    context.fillText(yearLabel(0), padding.left, height - 9);
    context.textAlign = 'center';
    context.fillText(yearLabel(Math.floor(values.length / 2)), width / 2, height - 9);
    context.textAlign = 'right';
    context.fillText(yearLabel(values.length - 1), width - padding.right, height - 9);
    context.fillStyle = color;
    context.font = 'bold 10px Inter, system-ui, sans-serif';
    context.textAlign = 'left';
    context.fillText(graphValue(values[0]), points[0].x + 6, Math.max(13, points[0].y - 10));
    const middlePoint = points[Math.floor(points.length / 2)];
    context.textAlign = 'center';
    context.fillText(
      graphValue(values[Math.floor(values.length / 2)]),
      middlePoint.x,
      Math.max(13, middlePoint.y - 10),
    );
    context.textAlign = 'right';
    context.fillText(graphValue(values.at(-1)), points.at(-1).x - 6, Math.max(13, points.at(-1).y - 10));
    context.textAlign = 'left';
  }, [values, color, pointsPerYear]);

  return canvasRef;
}
