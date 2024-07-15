const customers = [
  { id: 1, name: "Ahmed Ali" },
  { id: 2, name: "Aya Elsayed" },
  { id: 3, name: "Mina Adel" },
  { id: 4, name: "Sarah Reda" },
  { id: 5, name: "Mohamed Sayed" },
];

const transactions = [
  { id: 1, customer_id: 1, date: "2022-01-01", amount: 1000 },
  { id: 2, customer_id: 1, date: "2022-01-02", amount: 2000 },
  { id: 3, customer_id: 2, date: "2022-01-01", amount: 550 },
  { id: 4, customer_id: 3, date: "2022-01-01", amount: 500 },
  { id: 5, customer_id: 2, date: "2022-01-02", amount: 1300 },
  { id: 6, customer_id: 4, date: "2022-01-01", amount: 750 },
  { id: 7, customer_id: 3, date: "2022-01-02", amount: 1250 },
  { id: 8, customer_id: 5, date: "2022-01-01", amount: 2500 },
  { id: 9, customer_id: 5, date: "2022-01-02", amount: 875 },
];

let currentFilteredTransactions = [...transactions];

function populateTable() {
  const tableBody = document.getElementById("transactionsBody");
  tableBody.innerHTML = "";

  currentFilteredTransactions.forEach((transaction) => {
    const customerName = customers.find(
      (customer) => customer.id === transaction.customer_id
    ).name;
    const row = `<tr><td>${customerName}</td><td>${transaction.date}</td><td>${transaction.amount}</td></tr>`;
    tableBody.innerHTML += row;
  });
}

function filterTable() {
  const filterName = document.getElementById("filterName").value.toLowerCase();
  const filterAmount =
    parseFloat(document.getElementById("filterAmount").value) || 0;

  currentFilteredTransactions = transactions.filter((transaction) => {
    const customerName = customers
      .find((customer) => customer.id === transaction.customer_id)
      .name.toLowerCase();
    const amount = parseFloat(transaction.amount);

    return customerName.includes(filterName) && amount >= filterAmount;
  });

  populateTable();
  updateChart(filterName, filterAmount);
}

function updateChart(filterName, filterAmount) {
  const ctx = document.getElementById("transactionChart").getContext("2d");
  const customersData = {};

  currentFilteredTransactions.forEach((transaction) => {
    const customerName = customers.find(
      (customer) => customer.id === transaction.customer_id
    ).name;
    if (!customersData[customerName]) {
      customersData[customerName] = {};
    }
    if (!customersData[customerName][transaction.date]) {
      customersData[customerName][transaction.date] = 0;
    }
    customersData[customerName][transaction.date] += transaction.amount;
  });

  const dates = [
    ...new Set(
      currentFilteredTransactions.map((transaction) => transaction.date)
    ),
  ];
  const datasets = [];

  Object.keys(customersData).forEach((customerName) => {
    const data = dates.map((date) => customersData[customerName][date] || 0);
    datasets.push({
      label: customerName,
      backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      borderWidth: 1,
      data: data,
    });
  });
  const chartData = {
    labels: dates,
    datasets: datasets,
  };

  let coloText = document
    .getElementById("transactionChart")
    .getAttribute("class");

  const chartOptions = {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontColor: coloText,
          },
        },
      ],
      xAxes: [
        {
          ticks: {
            fontColor: coloText,
          },
        },
      ],
    },
    legend: {
      labels: {
        fontColor: coloText,
      },
    },
    title: {
      display: true,
      text: "Total Transaction Amount",
      fontColor: coloText,
    },
  };

  if (window.myChart) {
    window.myChart.destroy();
  }

  window.myChart = new Chart(ctx, {
    type: "bar",
    data: chartData,
    options: chartOptions,
  });
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

populateTable();
updateChart();
filterName.addEventListener("input", function () {
  filterTable();
});
filterAmount.addEventListener("input", function () {
  filterTable();
});

const modeBtn = document.getElementById("mode");

if (localStorage.getItem("theme")) {
  const theme = localStorage.getItem("theme");
  console.log(theme);
  document.documentElement.dataset.theme = localStorage.getItem("theme");
  if (theme === "light") {
    modeBtn.classList.replace("fa-sun", "fa-moon");
  } else {
    modeBtn.classList.replace("fa-moon", "fa-sun");
  }
}

modeBtn.addEventListener("click", function (e) {
  theme(e.target);
});

function theme(element) {
  const rootElement = document.documentElement;
  if (element.classList.contains("fa-sun")) {
    element.classList.replace("fa-sun", "fa-moon");
    rootElement.dataset.theme = "light";
    localStorage.setItem("theme", "light");
  } else {
    element.classList?.replace("fa-moon", "fa-sun");
    rootElement.dataset.theme = "dark";
    localStorage.setItem("theme", "dark");
  }
}
