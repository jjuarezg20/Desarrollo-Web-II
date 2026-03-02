import { useContext, useEffect, useState } from "react";
import DatePicker from "react-date-picker";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import { categories } from "../data/categories";
import { BudgetDispatchContext, BudgetStateContext } from "../context/BudgetContext";
import ErrorMessage from "./ErrorMessage";

export const ExpenseForm = () => {
    const [expense, setExpense] = useState({
        expenseName: "",
        amount: 0,
        category: "",
        date: new Date(),
    });

    const [error, setError] = useState("");
    const dispatch = useContext(BudgetDispatchContext);
    const state = useContext(BudgetStateContext);

    useEffect(() => {
        if (!state.editingId) return;

        const editingExpense = state.expenses.find(
            (currentExpense) => currentExpense.id === state.editingId
        );

        if (editingExpense) {
            setExpense(editingExpense);
        }
    }, [state.editingId, state.expenses]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setExpense({
            ...expense,
            [name]: name === "amount" ? Number(value) : value,
        });
    };

    const handleChangeDate = (value) => {
        setExpense({
            ...expense,
            date: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError("");

        if (!expense.expenseName.trim() || !expense.category || !expense.date || expense.amount <= 0) {
            setError("Todos los campos son obligatorios");
            return;
        }

        if (state.editingId) {
            dispatch({ type: "update-expense", payload: { expense: { ...expense, id: state.editingId } } });
            return;
        }

        dispatch({ type: "add-expense", payload: { expense } });
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            <legend className="uppercase text-center text-2xl font-black border-b-4 border-blue-500 py-2">
                {state.editingId ? "Guardar cambios" : "Nuevo gasto"}
            </legend>

            {state.error && <p className="text-red-500 font-bold text-center">{state.error}</p>}
            {error && <ErrorMessage>{error}</ErrorMessage>}

            <div className="flex flex-col gap-2">
                <label htmlFor="expenseName" className="text-xl">
                    Nombre gasto:
                </label>
                <input
                    type="text"
                    id="expenseName"
                    placeholder="Anade el nombre del gasto"
                    className="bg-slate-100 p-2"
                    name="expenseName"
                    value={expense.expenseName}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="amount" className="text-xl">
                    Cantidad:
                </label>
                <input
                    type="number"
                    id="amount"
                    placeholder="Anade la cantidad del gasto: ej. 300"
                    className="bg-slate-100 p-2"
                    name="amount"
                    value={expense.amount}
                    onChange={handleChange}
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="category" className="text-xl">
                    Categoria:
                </label>
                <select
                    id="category"
                    className="bg-slate-100 p-2"
                    name="category"
                    value={expense.category}
                    onChange={handleChange}
                >
                    <option value="">-- Seleccione --</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-xl">
                    Fecha gasto:
                </label>
                <DatePicker className="bg-slate-100 p-2 border-0" value={expense.date} onChange={handleChangeDate} />
            </div>

            <input
                type="submit"
                className="bg-blue-600 cursor-pointer w-full p-2 text-white uppercase font-bold rounded-lg"
                value={state.editingId ? "Guardar cambios" : "Registrar gasto"}
            />
        </form>
    );
};
