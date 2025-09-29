import React, { useState, useEffect } from 'react';

interface CheckboxComponentProps {
  initialValue?: boolean;
  apiEndpoint: string;
  labelText?: string;
  onError?: (error: string) => void;
}

const CheckboxComponent: React.FC<CheckboxComponentProps> = ({
  initialValue = false,
  apiEndpoint,
  labelText = 'Toggle',
  onError,
}) => {
  const [isChecked, setIsChecked] = useState<boolean>(initialValue);
  const [error, setError] = useState<string | null>(null);

  // Handle API submission when checkbox value changes
  useEffect(() => {
    const submitCheckboxValue = async () => {
      try {
        const response = await fetch(apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isChecked }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit checkbox value');
        }
        setError(null); // Clear any previous errors
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMessage);
        if (onError) {
          onError(errorMessage);
        }
      }
    };

    submitCheckboxValue();
  }, [isChecked, apiEndpoint, onError]);

  // Handle checkbox change
  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
  };

  return (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={handleCheckboxChange}
        className="w-5 h-5"
      />
      <label className="text-sm text-gray-700">{labelText}</label>
    </div>
  );
};

export default CheckboxComponent;