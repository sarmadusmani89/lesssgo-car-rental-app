'use client';

interface Specs {
  seats: number;
  type: string;
  fuel: string;
}

interface Props {
  specs: Specs;
}

export default function VehicleSpecifications({ specs }: Props) {
  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="font-semibold text-lg mb-2">Specifications</h2>
      <ul className="list-disc pl-5 text-gray-700">
        <li>Seats: {specs.seats}</li>
        <li>Type: {specs.type}</li>
        <li>Fuel: {specs.fuel}</li>
      </ul>
    </div>
  );
}
