const initialBudget = () => {
    const localStorageBudget = localStorage.getItem('budget');
    return localStorageBudget ? parseFloat(localStorageBudget) : 0;
};

const localStorageExpenses = () => {
    const localStorageExpenses = localStorage.getItem('expenses');
    return localStorageExpenses ? JSON.parse(localStorageExpenses) : [];
};

const sumExpenses = (expenses) =>
    expenses.reduce((total, expense) => total + Number(expense.amount || 0), 0);

export const initialState = {
    budget: initialBudget(),
    modal: false,
    expenses: localStorageExpenses(),
    editingId: "",
    currentCategory: "",
    error: ""
}

export const budgetReducer = (state, action) => {
    switch (action.type) {
        case "add-budget":
            return { ...state, budget: action.payload.budget, error: "" }
        case "show-modal":
            return { ...state, modal: true, error: "" }
        case "close-modal":
            return { ...state, modal: false, editingId: "", error: "" }
        case "add-expense": {
            const totalAfterAdd = sumExpenses([...state.expenses, action.payload.expense]);
            if (totalAfterAdd > state.budget) {
                return { ...state, error: "Esta cantidad sobrepasa el presupuesto." };
            }
            return {
                ...state,
                expenses: [
                    ...state.expenses,
                    { ...action.payload.expense, id: new Date().getTime() }
                ],
                modal: false,
                error: "" 
            };
        }
        case "remove-expense":
            return{
                ...state,
                expenses: state.expenses.filter(expense => expense.id !== action.payload.id),
                error: ""
            }
        case "get-expense-by-id":
            return{
                ...state,
                editingId: action.payload.id,
                modal: true,
                error: ""
            }
        case "update-expense": {
            const updatedExpense = action.payload.expense;
            const remainingExpenses = state.expenses.filter(expense => expense.id !== updatedExpense.id);
            const totalAfterUpdate = sumExpenses([...remainingExpenses, updatedExpense]);

            if (totalAfterUpdate > state.budget) {
                return { ...state, error: "Esta cantidad sobrepasa el presupuesto." };
            }

            return {
                ...state,
                expenses: state.expenses.map(expense => expense.id === action.payload.expense.id ?
                    action.payload.expense :
                    expense),
                modal: false,
                editingId: "",
                error: ""
            }
        }
        case "add-filter-category":
            return { ...state, currentCategory: action.payload.categoryId }
        case "reset-app":
            localStorage.removeItem("budget");
            localStorage.removeItem("expenses");
            return {
                budget: 0,
                modal: false,
                expenses: [],
                editingId: "",
                currentCategory: "",
                error: ""
            };  
        default:
            return state;
    }
}

export default budgetReducer;
