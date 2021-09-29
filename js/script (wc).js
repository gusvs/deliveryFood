'use strict';

// Проект с получением данных из свойств элементов

const cartButton = document.querySelector("#cart-button"), // кнопка Корзина
	modal = document.querySelector(".modal"), // модальное окно корзины
	close = document.querySelector(".close"), // крестик Закрыть в модальном окне корзины
	buttonAuth = document.querySelector('.button-auth'), // кнопка Войти
	modalAuth = document.querySelector('.modal-auth'), // модальное окно авторизации
	closeAuth = document.querySelector('.close-auth'), // крестик Закрыть в модальном окне авторизации
	logInForm = document.querySelector('#logInForm'), // форма мод.окна авторизации
	loginInput = document.querySelector('#login'), // поле для ввода логина
	userName = document.querySelector('.user-name'), // имя пользователя в шапке
	buttonOut = document.querySelector('.button-out'), // кнопка Выйти
	cardsRestaurants = document.querySelector('.cards-restaurants'), // карточки ресторанов
	containerPromo = document.querySelector('.container-promo'), // секция слайдер-реклама
	restaurants = document.querySelector('.restaurants'), // все карточки ресторанов с заголовком и поиском
	menu = document.querySelector('.menu'), // меню ресторана (заголовок и карточки товара)
	logo = document.querySelector('.logo'), // логотип сайта
	cardsMenu = document.querySelector('.cards-menu'), // карточки товара в ресторане
	modalBody = document.querySelector('.modal-body'), // тело мод. окна Корзины
	modalPrice = document.querySelector('.modal-pricetag'), // Общая сумма в Корзине
	clearCart = document.querySelector('.clear-cart'), // кнопка Отмена в мод. окне корзины
	restaurantTitle = document.querySelector('.restaurant-title'), // название ресторана
	cardInfo = document.querySelector('.card-info'), // инфо в шапке ресторана (рейтинг, цена, категория)
	rating = document.querySelector('.rating'), // рейтинг
	minPrice = document.querySelector('.price'), // цена
	category = document.querySelector('.category'), // категория
	inputSearch = document.querySelector('.input-search'), // поле поиска
	modalFooter = document.querySelector('.modal-footer'), // подвал мод.окна корзины
	cart = []; // хранилище корзины

let login = localStorage.getItem('login'); // получаем логин из localStorage, если есть

// проверяем авторизован ли пользователь
const checkAuth = () => login ? authorized(): notAuthorized(); // тернарный оператор

// загружаем корзину из localStorage
const loadCart = () => {
	if (localStorage.getItem(login)) {
		JSON.parse(localStorage.getItem(login)).forEach(item => cart.push(item));
	}
};

// сохраняем корзину в localStorage
const saveCart = () => localStorage.setItem(login, JSON.stringify(cart));

// ассинхронное получение данных из БД. async перед функцией гарантирует, что эта функция в любом случае вернёт промис (обещание).
const getData = async (url) => { // принимает путь до БД
	const response = await fetch(url); // await, можно использовать только внутри async-функций. Await ожидаем когда выполнится fetch и после сохраняем ответ в response
	if (!response.ok) { // если статус ответа false
		throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`) // throw сбрасываем ошибку, сбрасываем выполнение кода, создаем ее описание
	}
	return await response.json(); // дождемся когда выполнится метод json() и вернем результат
};

// функция переключатель: Открываем-Закрываем модальное окно
const toggleModal = () => modal.classList.toggle('is-open');

// функция переключатель: Открываем-Закрываем модальное окно
function toggleModalAuth() {
	modalAuth.classList.toggle('is-open');
	loginInput.style.borderColor = ''; // убираем красную рамку поля ввода логина
	logInForm.reset();
}

// возврат на начальную страницу
function returnMain() {
	containerPromo.classList.remove('hide'); // показываем секцию слайдер-реклама
	restaurants.classList.remove('hide'); // показываем все карточки ресторанов с заголовком и поиском
	menu.classList.add('hide'); // скрываем меню ресторана (заголовок и карточки товара)
}

// валидация полей формы авторизации
function maskInput(value) {
	const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/; // задаем регулярное выражение для логина
	if (value.trim().length > 2 && nameReg.test(value)) return !!value; // если логин больше 2 букв и соответствует рег. выражению; !! переводит в тип boolean
	else return false; // иначе false
}

// авторизован
function authorized() {
	// функция выхода из системы
	function logOut() {
		login = null; // обнуляем логин
		cart.length = 0; //очищаем корзину
		localStorage.removeItem('login'); // удаляем логин из localStorage
		buttonAuth.style.display = ''; // показываем кнопку Войти
		userName.style.display = ''; // скрываем имя пользователя в шапке
		buttonOut.style.display = ''; // скрываем кнопку Выйти
		cartButton.style.display = ''; // скрываем кнопку Корзина
		buttonOut.removeEventListener('click', logOut); // удаляем слушатель кнопки Выйти
		checkAuth(); // проверяем авторизацию
		returnMain(); // возврат на начальную страницу
	}

	userName.textContent = login; // записываем логин
	buttonAuth.style.display = 'none'; // скрываем кнопку Войти
	userName.style.display = 'inline'; // показываем имя пользователя в шапке
	buttonOut.style.display = 'flex'; // показываем кнопку Выйти
	cartButton.style.display = 'flex'; // показываем кнопку Корзина
	buttonOut.addEventListener('click', logOut); // клик по кнопке Выйти
	loadCart(); // загружаем корзину
}

// не авторизован
function notAuthorized() {
	// функция входа в систему
	function logIn(event) {
		event.preventDefault(); // откл. перезагрузку страницы
		if (maskInput(loginInput.value)) { // проверяем валидность логина и если верно, то
			login = loginInput.value.trim(); // сохраняем логин в переменную login
			localStorage.setItem('login', login); // сохраняем логин в localStorage
			toggleModalAuth(); // закрываем мод. окно авторизации
			buttonAuth.removeEventListener('click', toggleModalAuth); // удаляем слушатель кнопки Войти
			closeAuth.removeEventListener('click', toggleModalAuth); // удаляем слушатель крестика Закрыть
			logInForm.removeEventListener('submit', logIn); // удаляем слушатель отправки формы авторизации
			logInForm.reset(); // очищаем поля формы
			checkAuth(); // проверяем авторизацию
		} else { // если логин не введен
			loginInput.style.borderColor = 'red'; // окрашиваем поле ввода логина красной рамкой
			loginInput.value = ''; // очищаем поле
		}
	}

	buttonAuth.addEventListener('click', toggleModalAuth); // клик по кнопке войти
	closeAuth.addEventListener('click', toggleModalAuth); // клик по крестику Закрыть
	logInForm.addEventListener('submit', logIn); // событие при отправке формы авторизации
}

// Рендер карточек ресторанов
function createCardRestaurant(restaurant) { // принимаем ответ из функции getData и обрабатываем.
	/* Что бы каждый раз не обращаться через restaurant.name или restaurant.price вытащим данные с помощью деструктуризации
	* time_of_delivery: timeOfDelivery - переименование во время деструктуризации, time_of_delivery больше не существует
	* деструктуризация - то же, что и {image: 'restaurant.image', name: 'restaurant.name'}
	*/
	const {image, kitchen, name, price, products, stars, time_of_delivery: timeOfDelivery} = restaurant;
	const card = document.createElement('a'); // создаем элемент a
	card.className = 'card card-restaurant'; // в элемент добавляем классы
	card.products = products; // т.к. элемент это ОБЪЕКТ то создаем свойство(ключ) products и сохраняем туда данные
	card.info = [name, price, stars, kitchen]; // т.к. элемент это ОБЪЕКТ то создаем свойство(ключ) info и сохраняем туда данные
	card.insertAdjacentHTML('afterbegin', `
			<img src="${image}" alt="${name}" class="card-image"/>
			<div class="card-text">
				<div class="card-heading">
					<h3 class="card-title">${name}</h3>
					<span class="card-tag tag">${timeOfDelivery} мин</span>
				</div>
				<div class="card-info">
					<div class="rating">
						${stars}
					</div>
					<div class="price">От ${price} ₽</div>
					<div class="category">${kitchen}</div>
				</div>
			</div>
	`);
	cardsRestaurants.insertAdjacentElement('beforeend', card); // вставляем карточку ресторана на страницу в конец блока
}

// Открываем меню ресторана
function openGoods(event) {
	const target = event.target;
	if (login) { // если пользователь залогинился открываем карточку
		const restaurant = target.closest('.card-restaurant'); // поднимаемся до карточки ресторана
		if (restaurant) { // если карточка существует
			const [name, price, stars, kitchen] = restaurant.info; // получаем свойство info в виде массива и деструктурируем его
			cardsMenu.textContent = ''; // очищаем меню ресторана
			containerPromo.classList.add('hide'); // скрываем секцию слайдер-реклама
			restaurants.classList.add('hide'); // скрываем все карточки ресторанов с заголовком и поиском
			menu.classList.remove('hide'); // показываем меню ресторана (заголовок и карточки товара)
			restaurantTitle.textContent = name; // записываем название ресторана в шапку
			rating.textContent = stars; // записываем рейтинг ресторана в шапку
			minPrice.textContent = `от ${price} ₽`; // записываем ценник ресторана в шапку
			category.textContent = kitchen; // записываем категорию ресторана в шапку
			getData(`./db/${restaurant.products}`).then(function (data) { // в getData передаем products свойтво элемента, метод then() обрабатывает промисы, в callback функцию передаем ответ в виде data
				data.forEach(createCardGood); // перебираем data и передаем каждый елемент в функцию createCardGood (создаем карточку товара и выводим на страницу)
			});
		}
	} else toggleModalAuth(); // если пользователь не залогинился открываем мод. окно авторизации
}

// создаем карточку товара и выводим на страницу
function createCardGood({description, name, id, price, image}) { // деструктурируем ответ сразу при получении из функции getData и обрабатываем
	const card = document.createElement('div'); // создаем элемент div и сохраняем в card
	card.className = 'card'; // добавляем в div класс card
	card.id = id; // добавляем id как свойство элемента
	card.insertAdjacentHTML('beforeend', `
		<img src="${image}" alt="${name}" class="card-image"/>
		<div class="card-text">
			<div class="card-heading">
				<h3 class="card-title card-title-reg">${name}</h3>
			</div>
			<div class="card-info">
				<div class="ingredients">${description}</div>
			</div>
			<div class="card-buttons">
				<button class="button button-primary button-add-cart">
					<span class="button-card-text">В корзину</span>
					<span class="button-cart-svg"></span>
				</button>
				<strong class="card-price card-price-bold">${price} ₽</strong>
			</div>
		</div>
	`);
	cardsMenu.insertAdjacentElement('afterbegin', card); // вставляем карточку товара в меню ресторана
}

// поиск товара
function searchGood(event) {
	if (event.keyCode === 13) { // если нажимаем Enter то
		if (login) {
			const target = event.target; // получаем поле поиска
			const value = target.value.toLowerCase().trim(); // получаем значение поля поиска и переводим в нижний регистр и удаляем лишние пробелы
			target.value = ''; // очищаем поле поиска
			if (!value || value.length < 3) { // если ничего не введено или введено короткое название
				target.style.backgroundColor = 'tomato'; // окрашиваем поле в красный цвет
				setTimeout(function () { // запускаем таймер на 2 секунды и после:
					target.style.backgroundColor = ''; // убираем окрашивание
				}, 2000);
				return; // останавливаем поиск
			}
			const goods = []; // создаем хранилище для всех продуктов
			getData('./db/partners.json').then(function (data) { // получаем из БД все рестораны
				const products = data.map(item => item.products); // из БД ресторанов получаем данные меню
				products.forEach(function (product) { // перебираем меню каждого ресторана
					getData(`./db/${product}`)
						.then(function (data) { // получаем все блюда из меню ресторана
							console.log(...data);
							goods.push(...data); // помещаем блюдо в хранилище через спред оператор (...) - распаковывает массив
							const searchGoods = goods.filter(item => item.name.toLowerCase().includes(value)); // ищем в названиях товаров введеный текст и сохраняем
							cardsMenu.textContent = ''; // очищаем меню ресторана
							containerPromo.classList.add('hide'); // скрываем секцию слайдер-реклама
							restaurants.classList.add('hide'); // скрываем все карточки ресторанов с заголовком и поиском
							menu.classList.remove('hide'); // показываем меню ресторана (заголовок и карточки товара)
							restaurantTitle.textContent = 'Результат поиска'; // записываем строку в шапку
							cardInfo.textContent = ''; // очищаем шапку в результатах поиска
							return searchGoods; // возвращаем найденные продукты
						})
						.then(function (data) { // принимаем найденные продукты и выводим
							data.forEach(createCardGood); // формируем карточку с каждым полученным продуктом
						})
				})
			});
		} else { // если пользователь не залогинился
			inputSearch.value = ''; // Очищаем поле поиска
			toggleModalAuth(); // открываем мод. окно авторизации
		}
	}
}

// добавляем товар в корзину
function addToCart(event) {
	const target = event.target; // получаем элемент по которому кликнули
	const buttonAddToCart = target.closest('.button-add-cart'); // определяем клик по кнопке В корзину
	if (buttonAddToCart) { // и если кликнули
		const card = target.closest('.card'); // поднимаемся до самой карточки
		const title = card.querySelector('.card-title-reg').textContent; // и получаем название блюда
		const cost = card.querySelector('.card-price').textContent; // и цену
		const id = card.id; // получаем id товара
		const food = cart.find(function (item) { // ищем в корзине товары с одиннаковыми id
			return item.id === id; // если id уже находящегося в корзине товара совпадает с id добавляемого товара, то сохраняем это товар в  food
		});
		if (food) {
			food.count += 1; // и увеличиваем количество товара
		} else { // если такого id нет в корзине, то добавляем его с количеством 1
			cart.push({
				id, //если значения совпадают, то можно писать просто id. Тоже что и id: id,
				title,
				cost,
				count: 1
			});
		}
	}
	saveCart(); // сохраняем корзину в localStorage
}

// формируем корзину
function renderCart() {
	modalBody.textContent = ''; // очищаем тело корзины
	if (cart.length !== 0) {
		modalFooter.classList.remove('hide');
		cart.forEach(function ({ id, title, cost, count }) { // перебираем корзину и сразу деструктурируем входящие данные
			const itemCart = document.createElement('div'); // создаем элемент
			itemCart.className = 'food-row'; // добавляем ему класс
			/* вставляем верстку с товаром в элемент */
			itemCart.insertAdjacentHTML('afterbegin', `
			<span class="food-name">${title}</span>
			<strong class="food-price">${cost}</strong>
			<div class="food-counter">
				<button class="counter-button counter-minus" data-id=${id}>-</button>
				<span class="counter">${count}</span>
				<button class="counter-button counter-plus" data-id=${id}>+</button>
			</div>
		`);
			modalBody.insertAdjacentElement('afterbegin', itemCart); // вставляем элемент в мод.окно Корзины
		});
		const totalPrice = cart.reduce(function (acc, item) { // считаем общую сумму товаров в Корзине
			return acc + (parseFloat(item.cost)) * item.count; // переводим строку в число
		}, 0);
		modalPrice.textContent = totalPrice + ' ₽'; // выводим общую сумму в окно
	} else {
		modalFooter.classList.add('hide');
		modalBody.textContent = 'Корзина пуста';
	}
}

// подсчитываем количество товаров в Корзине
function changeCount(event) {
	const target = event.target;
	if (target.classList.contains('counter-button')) {
		const food = cart.find(function (item) { // перебираем корзину
			return item.id === target.dataset.id; // ищем id убавленного товара и сравниваем с id товаров в Корзине и возвращаем найденный результат
		});
		// если нажали на кнопку минус или плюс
		if (target.classList.contains('counter-minus')) {
			food.count--; // убавляем количество у найденного товара
			if (food.count === 0) { // если количество товара равно 0
				cart.splice(cart.indexOf(food), 1); // находим индекс этого товара и удаляем его из корзины
			}
		}
		if (target.classList.contains('counter-plus')) food.count++; // убавляем количество у найденного товара
		renderCart(); // и формируем корзину заново
	}
	saveCart(); // сохраняем корзину в localStorage
}

// инициализация проекта
function init() {
	getData('./db/partners.json').then(function (data) { // метод then() обрабатывает промисы, в callback функцию передаем ответ в виде data
		data.forEach(createCardRestaurant) // перебираем data и передаем каждый елемент в функцию createCardRestaurant (Рендер карточек ресторанов)
	});

// вызовы событий
	cartButton.addEventListener("click", function () { // клик по кнопке Корзина
		renderCart(); // собираем корзину
		toggleModal(); // открываем мод.окно Корзины
	});
	close.addEventListener("click", toggleModal); // клик по крестику Закрыть
	cardsRestaurants.addEventListener('click', openGoods); // переходим в ресторан при клике по карточке
	logo.addEventListener('click', returnMain); // при клике по логотипу переходим на начальную страницу
	inputSearch.addEventListener('keydown', searchGood); // при вводе запускаем функцию поиска
	cardsMenu.addEventListener('click', addToCart); // при клике по карточке товара запускаем функцию addToCard
	modalBody.addEventListener('click', changeCount); // при клике в мод. окне Корзины
	clearCart.addEventListener('click', function () { // при клике по кнопке Отмена в мод. окне корзины
		localStorage.removeItem(login);
		cart.length = 0; // очищаем корзину
		renderCart(); // формируем корзину заново
	})
	checkAuth(); // проверяем авторизован ли пользователь

// инициализация Swiper Slider
	new Swiper('.swiper-container', {
		loop: true,
		autoplay: {
			delay: 3000,
		}
	})
}

init();