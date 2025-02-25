import { useState, FormEvent } from 'react';
import { addStyles, EditableMathField, StaticMathField } from 'react-mathquill';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

addStyles();

function App() {
  const [equation, setEquation] = useState('\\frac{dy}{dx} + y = x');
  const [solution, setSolution] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await axios({
        url: 'http://localhost:8000/solve',
        params: {
          equation_latex: equation,
        },
        method: 'POST',
      });

      if ('error' in response.data) {
        setError(response.data.error);
        setSolution(null);
        return;
      }

      setSolution(response.data.possible_methods.toString());
      setError(null);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('Here?');
        setError(error.response?.data?.error ?? null);
        setSolution(null);
      }
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Differential Equation Solver</h1>

      <Card>
        <CardHeader>
          <CardTitle>Enter Equation</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='flex flex-col space-y-4'>
            <EditableMathField
              id='equation'
              latex={equation}
              onChange={(mathField) => setEquation(mathField.latex())}
              style={{ minHeight: 100, padding: 16, borderRadius: 8 }}
            />

            {solution && (
              <Card className='mt-4'>
                <CardHeader>
                  <CardTitle>Solution:</CardTitle>
                </CardHeader>
                <CardContent>
                  <StaticMathField>{solution}</StaticMathField>
                </CardContent>
              </Card>
            )}

            {error && (
              <Card className='mt-4'>
                <CardHeader>
                  <CardTitle>Error:</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={'text-red-500'}>{error}</p>
                </CardContent>
              </Card>
            )}

            <Button type='submit'>Solve</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export { App };
