"use client"

import { useState } from 'react';

export default function SolarPanelCalculator() {
  const [panelType, setPanelType] = useState<'silicon' | 'thinFilm'>('silicon');
  const [numPanels, setNumPanels] = useState<number>(1);
  const [includeJunctionBox, setIncludeJunctionBox] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<{ totalCarbon: number; totalRecycledValue: number } | null>(null);

  const materialData = {
    GLASS: {
      S: 0.76,
      T: 0.89,
      carbonFootprint: { ci: 1.1 },
      recycledPrice: { P1: 100, P2: 600, P3: 5 },
    },
    PLASTIC: {
      S: 0.1,
      T: 0.04,
      carbonFootprint: { ci: 2.5 },
      recycledPrice: { P1: 0 },
    },
    ALUMINUM: {
      S: 0.08,
      T: 0.06,
      carbonFootprint: { ci: 10 },
      recycledPrice: { P1: 1500 },
    },
    SILICON: {
      S: 0.05,
      T: 0,
      carbonFootprint: { ci: 12 },
      recycledPrice: { P1: 50, P2: 300 },
    },
    SILVER: {
      S: 0.0003,
      T: 0.0003,
      carbonFootprint: { ci: 458 },
      recycledPrice: { P1: 10 },
    },
    COPPER: {
      S: 0.01,
      T: 0.01,
      carbonFootprint: { ci: 4.1 },
      recycledPrice: { P3: 12 },
    },
  };

  const calculateTotals = () => {
    return new Promise<{ totalCarbon: number; totalRecycledValue: number }>((resolve) => {
      let totalCarbon = 0;
      let totalRecycledValue = 0;

      Object.keys(materialData).forEach((key) => {
        const mat = materialData[key as keyof typeof materialData];
        const fraction = panelType === 'silicon' ? mat.S : mat.T;
        const carbon = fraction * mat.carbonFootprint.ci * numPanels;
        totalCarbon += carbon;

        const avgPrice = Object.values(mat.recycledPrice).reduce((a, b) => a + b, 0) / (Object.keys(mat.recycledPrice).length || 1);
        totalRecycledValue += fraction * avgPrice * numPanels;
      });

      if (includeJunctionBox) totalRecycledValue += numPanels * 3;

      setTimeout(() => {
        resolve({ totalCarbon, totalRecycledValue });
      }, 800); // tiny suspense
    });
  };

  const handleCalculate = async () => {
    setLoading(true);
    const totals = await calculateTotals();
    setResults(totals);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center p-8 space-y-6 w-full mx-auto py-20 bg-tertiary">
      <div className='max-w-3xl bg-white py-10 px-20 rounded-xl shadow-md'>
        <h1 className="text-2xl font-roboto font-bold text-center py-5">Solar Panel Recycling & Carbon Calculator</h1>

        <div className="w-full space-y-3">
          <label className="block font-medium">Number of Panels</label>
          <input
            type="number"
            min={1}
            value={numPanels}
            onChange={(e) => setNumPanels(Number(e.target.value))}
            className="border p-2 rounded w-full"
          />

          <label className="block font-medium">Panel Type</label>
          <select
            value={panelType}
            onChange={(e) => setPanelType(e.target.value as 'silicon' | 'thinFilm')}
            className="border p-2 rounded w-full"
          >
            <option value="silicon">Silicon-Based</option>
            <option value="thinFilm">Thin Film</option>
          </select>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={includeJunctionBox}
              onChange={() => setIncludeJunctionBox(!includeJunctionBox)}
            />
            <span>Include Junction Box</span>
          </label>
        </div>

        <button
          onClick={handleCalculate}
          className="mt-6 bg-primary text-white px-6 py-2 w-full cursor-pointer rounded hover:bg-secondary transition"
        >
          {loading ? "Calculating..." : "Calculate"}
        </button>

        {results && !loading && (
          <div className="rounded-lg p-4 w-full text-left pt-10">
            <p className="font-semibold">Estimated Total Carbon Footprint:</p>
            <p>{results.totalCarbon.toFixed(2)} kg CO₂e</p>

            <p className="font-semibold mt-2">Estimated Recycled Material Value:</p>
            <p>${results.totalRecycledValue.toFixed(2)} USD</p>
          </div>
        )}

        {loading && (
          <div className="pt-10 text-center text-gray-500">
            Crunching the eco-guilt numbers...
          </div>
        )}
      </div>
    </div>
  );
}
