from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sympy import symbols, Function, Eq, diff, classify_ode, dsolve, latex
from sympy.parsing.latex import parse_latex
from antlr4 import *

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("ANTLR4 is working!")


@app.get("/")
def home():
    return {"message": "Send a differential equation in LaTeX format to get possible solution methods and step-by-step solutions."}

@app.post("/solve")
def solve_equation(equation_latex: str, variable: str = "x", function: str = "y"):
    try:
        # Define symbolic variables
        x = symbols(variable)
        y = Function(function)(x)

        # Parse LaTeX input into a SymPy expression
        ode = parse_latex(equation_latex)

        # Ensure the equation is in equality form
        if not isinstance(ode, Eq):
            raise ValueError("Parsed input is not a valid equation.")

        # Get possible solution methods
        methods = classify_ode(ode, y)

        # Solve the equation
        solution = dsolve(ode, y)

        return {
            "equation": str(ode),
            "equation_latex": latex(ode),
            # Determine the order of the equation
            # "order": ode.as_ordered_terms()[0].as_poly(y).degree(),
            "possible_methods": methods,
            "solution": str(solution),
            "solution_latex": latex(solution)
        }

    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
