// Selecting DOM Elements
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("listOfExpenses");

// -------------------------------------------------------------
// 1. LOAD EXPENSES FROM LOCAL STORAGE ON PAGE RELOAD
// -------------------------------------------------------------
window.addEventListener("DOMContentLoaded", function () {
  // Iterate through all keys saved in localStorage
  Object.keys(localStorage).forEach(function (key) {
    try {
      // Parse the JSON string back into a JavaScript object
      const expenseObj = JSON.parse(localStorage.getItem(key));

      // Validate that the retrieved item has the required expense fields
      if (
        expenseObj &&
        expenseObj.amount &&
        expenseObj.description &&
        expenseObj.category
      ) {
        showExpenseOnScreen(expenseObj);
      }
    } catch (error) {
      // Ignore keys that are not valid JSON
      console.warn(`Skipping non-JSON localStorage item for key: ${key}`);
    }
  });
});

// -------------------------------------------------------------
// 2. HANDLE FORM SUBMISSION & ADD EXPENSE
// -------------------------------------------------------------
expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  // Capture input values
  const amount = document.getElementById("expenseAmount").value;
  const description = document.getElementById("expenseDescription").value;
  const category = document.getElementById("expenseCategory").value;

  // Create an expense object
  const expenseObj = {
    amount: amount,
    description: description,
    category: category,
  };

  // Save to Local Storage (using description as the unique key)
  localStorage.setItem(expenseObj.description, JSON.stringify(expenseObj));

  // Display the new expense on the UI
  showExpenseOnScreen(expenseObj);

  // Reset all input fields
  expenseForm.reset();
});

// -------------------------------------------------------------
// 3. RENDER EXPENSE TO UI & BIND EDIT/DELETE EVENTS
// -------------------------------------------------------------
function showExpenseOnScreen(expense) {
  // Create a new list item element
  const li = document.createElement("li");
  li.className =
    "list-group-item d-flex justify-content-between align-items-center py-3";

  // Set inner HTML with expense details and Bootstrap-styled action buttons
  li.innerHTML = `
    <div>
      <strong>₹${expense.amount}</strong> - ${expense.category} (${expense.description})
    </div>
    <div>
      <button class="btn btn-danger btn-sm me-2 delete-btn">Delete Expense</button>
      <button class="btn btn-secondary btn-sm edit-btn">Edit Expense</button>
    </div>
  `;

  // --- DELETE ACTION ---
  const deleteBtn = li.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", function () {
    // Remove item from localStorage
    localStorage.removeItem(expense.description);
    // Remove element from UI
    li.remove();
  });

  // --- EDIT ACTION ---
  const editBtn = li.querySelector(".edit-btn");
  editBtn.addEventListener("click", function () {
    // Populate form fields with current values for editing
    document.getElementById("expenseAmount").value = expense.amount;
    document.getElementById("expenseDescription").value = expense.description;
    document.getElementById("expenseCategory").value = expense.category;

    // Remove old entry from localStorage and UI so it can be re-saved on submit
    localStorage.removeItem(expense.description);
    li.remove();
  });

  // Append the list item to the expenses list container
  expenseList.appendChild(li);
}
