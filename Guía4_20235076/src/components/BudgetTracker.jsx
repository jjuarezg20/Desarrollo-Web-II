import { useContext } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { AmountDisplay } from "./AmountDisplay";
import { BudgetDispatchContext, BudgetStateContext } from "../context/BudgetContext";

export const BudgetTracker = () => {
    const state = useContext(BudgetStateContext);
    const dispatch = useContext(BudgetDispatchContext);

    const totalExpenses = state.expenses.reduce((total, expense) => Number(expense.amount) + total, 0);
    const remainingBudget = state.budget - totalExpenses;
    const percentage = state.budget > 0 ? Number(((totalExpenses / state.budget) * 100).toFixed(2)) : 0;

    const handleResetApp = () => {
        dispatch({ type: "reset-app" });
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex justify-center">
                <CircularProgressbar
                    value={percentage}
                    text={`${percentage}%`}
                    styles={buildStyles({
                        pathColor: percentage < 100 ? "#3b82f6" : "#dc2626",
                        trailColor: "#F5F5F5",
                    })}
                />
            </div>

            <div className="flex flex-col justify-center items-center gap-8">
                <button
                    className="bg-pink-600 w-full p-2 text-white uppercase font-bold rounded-lg"
                    onClick={handleResetApp}
                >
                    Resetear app
                </button>

                <AmountDisplay amount={state.budget} label="Presupuesto" />
                <AmountDisplay amount={remainingBudget} label="Disponible" />
                <AmountDisplay amount={totalExpenses} label="Gastado" />
            </div>
        </div>
    );
};

export default BudgetTracker;
