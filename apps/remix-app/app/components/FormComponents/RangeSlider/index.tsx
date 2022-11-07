import { useState } from 'react';

interface RangeSliderProps {
  name: string;
}

export default function RangeSlider({
  name,
}: RangeSliderProps) {
  const [value, setValue] = useState(50);
  return (
    <>
      {/* <section className="range-slider container">
        <span className="output outputOne"></span>
        <span className="output outputTwo"></span>
        <span className="full-range"></span>
        <span className="incl-range"></span>
        <input name="rangeOne" value="10" min="0" max="100" step="1" type="range" />
        <input name="rangeTwo" value="90" min="0" max="100" step="1" type="range" />
      </section> */}
      <div>{value}</div>
      <input
        id="default-range"
        name={name}
        type="range"
        min={1}
        max={100}
        value={value}
        onChange={({ target }) => setValue(Number(target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
    </>
  );
}
