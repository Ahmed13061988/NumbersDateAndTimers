'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(acc.movementsDates[i]);
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0); //Because the month is zero based so we need to add 1
    const year = date.getFullYear();
    const displayDate = `${day}/${month}/${year}`;

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out.toFixed(2))}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

///////////////////////////////////////
// Event handlers
let currentAccount;

//Fake always logged in
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 100;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Current Date and Time
    const now = new Date();
    const day = `${now.getDate()}`.padStart(2, 0);
    const month = `${now.getMonth() + 1}`.padStart(2, 0); //Because the month is zero based so we need to add 1
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const year = now.getFullYear();
    labelDate.textContent = `${day}/${month}/${year}, ${hours}:${minutes} `;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //Add transfer Date
    currentAccount.movementsDates.push(new Date());
    receiverAcc.movementsDates.push(new Date());

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement
    currentAccount.movements.push(amount);

    currentAccount.movementsDates.push(new Date());

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(account1, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

console.log(23 === 23.0);
//All numbers in JavaScript are decimal

console.log(0.1 + 0.2);

console.log(Number('23'));
console.log(+'23');

//Parsing

// console.log(Number.parseInt('30px'));

// console.log(Number.parseFloat('2.5rem'));
// console.log(Number.parseInt('2.5rem'));

//check if value is not a number(NaN)
// console.log(Number.isNaN(20));
// console.log(Number.isNaN(+'20X'));
// console.log(Number.isNaN(20 / 0));

//checking if the value is a number
// console.log(Number.isFinite(20));
// console.log(Number.isFinite('20'));
// console.log(Number.isFinite(20 / 0));

// console.log(Number.isInteger('20'));
// console.log(Number.isInteger(20));
// console.log(Number.isInteger('20X'));
// console.log(Number.isInteger(20 / 0));
// console.log(Number.isInteger(2.2));

// console.log(Math.sqrt(34));
// console.log(8 ** (1 / 3));

// console.log(Math.max(1, 4, 7, 3, 9));
// console.log(Math.max(1, 4, 7, 3, 9, '23'));
// console.log(Math.max(1, 4, 7, 3, 9, '23px'));
// console.log(Math.min(1, 2, 3, 4, 9, 0));

// console.log(Math.PI);
// console.log(Math.PI * parseInt('10px') ** 2);

// console.log(Math.trunc(Math.random() * 6 + 1));

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;

// console.log(randomInt(10, 20));

//Rounding integers
// console.log(Math.trunc(23.33));

// console.log(Math.round(23.55));
// console.log(Math.ceil(23.98));

// console.log(Math.floor(23.9));

// console.log((2.3).toFixed(0));
// console.log(+(2.3).toFixed(3));

//Numeric separators

const diameter = 287_460_000_000;

console.log(diameter);

const prizeCents = 345_99;

console.log(prizeCents);

const transferFee = 15_00;

const PI = 3.1415;

console.log(PI);

console.log(Number('230_000'));

//Reminder operator

console.log(5 % 2);

console.log(5 / 2);

console.log(4 % 2);

// We can check if the number is even or odd

console.log(6 % 2);

console.log(7 % 2);

const isEven = num => (num % 2 === 0 ? true : false);

console.log(isEven(7));
console.log(isEven(8));

labelBalance.addEventListener('click', function (e) {
  e.preventDefault();
  [...document.querySelectorAll('.movements__row')].forEach((row, index) => {
    if (index % 2 === 0) {
      row.style.backgroundColor = 'orangered';
    }

    if (index % 3 === 0) {
      row.style.backgroundColor = 'blue';
    }
  });
});

//Working with BigInt

// console.log(2 ** 53 - 1);
// console.log(Number.MAX_SAFE_INTEGER);
// console.log(2 ** 53 + 5);

// console.log(12424897442389021385703212); // We can't log this number because it's bigger that 2 ** 53 -1

// console.log(12424897442389021385703212n); // this will log the number as a big integer
// console.log(BigInt(12424897442389021385703212));

// console.log(10000n + 10000n);

// console.log(342343412434343124342n * 1090984308945832n);

// const huge = 234343534342n;
// const num = 44;

// console.log(huge * BigInt(num)); // this will throw an error because we cannot mix BigInt with other types

// console.log(20n > 15);
// console.log(20n === 20); // false
// console.log(typeof 20n); // BigInt
// console.log(20n == 20); // true

// console.log(huge + ' is REALLY BIG');

// //Divisions
// console.log(10n / 3n); // it will cut the decimal part here

// console.log(100n / 3n);

// The big integer uses very rare

// Dates and Time in JavaScript

//Create a date

//1 -

// console.log(now);

// console.log(new Date('Oct 18 2022 19:24:56'));

// console.log(new Date('December 24, 2015'));

// console.log(new Date(account1.movementsDates[0]));
// console.log(new Date(2037, 10, 15, 23, 5));
// console.log(new Date(2037, 10, 31)); // JS auto correction
// console.log(new Date(0));
// console.log(new Date(3 * 24 * 60 * 60 * 1000));

//Working with dates

// const future = new Date(2037, 10, 15, 23);
// console.log(future);
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());
// console.log(future.toISOString());
// console.log(future.getTime());
// // console.log(new Date(2141964000000));

// console.log(Date.now());

// future.setFullYear(2024);
// console.log(future);

//Adding comments
//Adding Another comment
//Adding another comments
//Adding another comments
//Adding another comments
//Adding another comments
//Adding another comments

const array = [1, 2, 3];
const target = 3;

const findIndex = function (array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (array[i] + array[j] === target) {
        console.log(array.indexOf(array[i]));
      }
    }
  }
};

findIndex(array);
