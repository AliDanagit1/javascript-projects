document.addEventListener('DOMContentLoaded',()=>{
  const expenseform = document.getElementById("expense-form")
  const expensenameinput = document.getElementById("expense-name")
  const expenseamountinput = document.getElementById("expense-amount")
  const expenselist = document.getElementById("expense-list")
  const totalAmountDisplay = document.getElementById("total-amount");


  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
  let totalAmount = calculateTotal()
renderExpenses()
updateTotal()

expenseform.addEventListener('submit',(e)=>{
e.preventDefault()
const name =expensenameinput.value.trim()
const amount = parseFloat(expenseamountinput.value.trim())
if(name!=="" && !isNaN(amount)&& amount>0){
const newExpense = {
  id: Date.now(),
name: name,
amount: amount,
}
expenses.push(newExpense);
saveExpensessToLocal();
renderExpenses()
updateTotal()

//clear the input
expensenameinput.value = ""
expenseamountinput.value = ""
}
})




  function calculateTotal() {
    return expenses.reduce((sum,expense)=>(sum+=expense.amount),0)
  }
  function saveExpensessToLocal() {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }
  function updateTotal() {
    totalAmount = calculateTotal()
    totalAmountDisplay.textContent = totalAmount.toFixed(2)
  }
  function renderExpenses() {
    expenselist.innerHTML = ""
    expenses.forEach(expense =>{
        const li = document.createElement('li')
        li.innerHTML =`${expense.name} : $${expense.amount}
        <button data-id= "${expense.id}">Delete</button>`
        expenselist.appendChild(li)
    })
  }
  expenselist.addEventListener('click',(e)=>{
    if(e.target.tagName=== "BUTTON"){
    const expenseid =  parseInt(e.target.getAttribute("data-id"))
    expenses = expenses.filter(expense => expense.id !== expenseid)
    saveExpensessToLocal()
    renderExpenses()
    updateTotal()
    }
  })
})