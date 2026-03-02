import { useContext } from "react";
import { BudgetStateContext } from "../context/BudgetContext";
import { ExpenseDetails } from "./ExpenseDetails";

export const ExpenseList = () => {
    const { expenses, currentCategory } = useContext(BudgetStateContext);

    const filteredExpenses = currentCategory
        ? expenses.filter((expense) => expense.category === currentCategory)
        : expenses;

    const isEmpty = filteredExpenses.length === 0;

    return (
        <div className="mt-10">
            {isEmpty ? (
                <p className="text-gray-600 text-2xl font-bold">No hay gastos</p>
            ) : (
                <>
                    <p className="text-gray-600 text-2xl font-bold my-5">Listado de gastos</p>
                    {filteredExpenses.map((expense) => (
                        <ExpenseDetails key={expense.id} expense={expense} />
                    ))}
                </>
            )}
        </div>
    );
};

export default ExpenseList;
