'use strict';

// Проект с получением данных из аттрибутов

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
	/* получаем элементы из шапки ресторана: */
	restaurantTitle = document.querySelector('.restaurant-title'), // название ресторана
	rating = document.querySelector('.rating'), // рейтинг
	minPrice = document.querySelector('.price'), // цена
	category = document.querySelector('.category'); // категория

let login = localStorage.getItem('login'); // получаем логин из localStorage, если есть

// ассинхронное получение данных из БД. async перед функцией гарантирует, что эта функция в любом случае вернёт промис (обещание).
const getData = async function (url) { // принимает путь до БД
	const response = await fetch(url); // await, можно использовать только внутри async-функций. Await ожидаем когда выполнится fetch и после сохраняем ответ в response
	if (!response.ok) { // если статус ответа false
		throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}!`) // throw сбрасываем ошибку, сбрасываем выполнение кода, создаем ее описание
	}
	return await response.json(); // дождемся когда выполнится метод json() и вернем результат
};

// функция переключатель: Открываем-Закрываем модальное окно
function toggleModal() {
	modal.classList.toggle("is-open");
}

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

// проверяем авторизован ли пользователь
function checkAuth() {
	if (login) { // если переменная login не пустая
		authorized();
	} else { // если переменная login пустая
		notAuthorized();
	}
}

// валидация полей формы авторизации
function maskInput(value) {
	const nameReg = /^[a-zA-Z][a-zA-Z0-9-_\.]{1,20}$/; // задаем регулярное выражение для логина
	if (value.trim().length > 2 && nameReg.test(value)) return !!value; // если логин больше 2 букв и соответствует рег. выражению; !! переводит в тип boolean
	else return false; // иначе false
}

// авторизован
function authorized() {
	console.log('авторизован');

	// функция выхода из системы
	function logOut() {
		login = null; // обнуляем логин
		localStorage.removeItem('login'); // удаляем логин из localStorage
		buttonAuth.style.display = ''; // показываем кнопку Войти
		userName.style.display = ''; // скрываем имя пользователя в шапке
		buttonOut.style.display = ''; // скрываем кнопку Выйти
		buttonOut.removeEventListener('click', logOut); // удаляем слушатель кнопки Выйти
		checkAuth(); // проверяем авторизацию
		returnMain(); // возврат на начальную страницу
	}

	userName.textContent = login; // записываем логин
	buttonAuth.style.display = 'none'; // скрываем кнопку Войти
	userName.style.display = 'inline'; // показываем имя пользователя в шапке
	buttonOut.style.display = 'block'; // показываем кнопку Выйти
	buttonOut.addEventListener('click', logOut); // клик по кнопке Выйти
}

// не авторизован
function notAuthorized() {
	console.log('не авторизован');

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
	/* Что бы каждый раз не обращаться через restaurant.name или restaurant.price вытащим данные с помощью деструктуризации */
	const {
		image,
		kitchen,
		name,
		price,
		products,
		stars,
		time_of_delivery: timeOfDelivery // переименование во время деструктуризации, time_of_delivery больше не существует
	} = restaurant; // деструктуризация. то же, что и {image: 'image', name: 'name'}

	// в card сохраняем карточку ресторана. products и info записываем в data аттрибут
	const card = `
		<a class="card card-restaurant" data-products="${products}" data-info="${[name, price, stars, kitchen]}">
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
		</a>
	`;
	cardsRestaurants.insertAdjacentHTML('afterbegin', card); // вставляем карточку ресторана на страницу в начало блока из второго варианта
}

// Открываем меню ресторана
function openGoods(event) {
	const target = event.target;
	if (login) { // если пользователь залогинился открываем карточку
		const restaurant = target.closest('.card-restaurant'); // поднимаемся до карточки ресторана
		if (restaurant) { // если карточка существует
			const info = restaurant.dataset.info.split(','); // получаем данные из аттрибута info и преобразовываем из строки в массив
			const [name, price, stars, kitchen] = info; // деструктурируем массив
			cardsMenu.textContent = ''; // очищаем меню ресторана
			containerPromo.classList.add('hide'); // скрываем секцию слайдер-реклама
			restaurants.classList.add('hide'); // скрываем все карточки ресторанов с заголовком и поиском
			menu.classList.remove('hide'); // показываем меню ресторана (заголовок и карточки товара)
			restaurantTitle.textContent = name; // записываем название ресторана в шапку
			rating.textContent = stars; // записываем рейтинг ресторана в шапку
			minPrice.textContent = `от ${price} ₽`; // записываем ценник ресторана в шапку
			category.textContent = kitchen; // записываем категорию ресторана в шапку
			getData(`./db/${restaurant.dataset.products}`).then(function (data) { // в getData передаем аттрибут products, метод then() обрабатывает промисы, в callback функцию передаем ответ в виде data
				data.forEach(createCardGood); // перебираем data и передаем каждый елемент в функцию createCardGood (создаем карточку товара и выводим на страницу)
			});
		}
	} else toggleModalAuth(); // если пользователь не залогинился открываем мод. окно авторизации
}

// создаем карточку товара и выводим на страницу
function createCardGood({description, name, id, price, image}) { // деструктурируем ответ сразу при получении из функции getData и обрабатываем
	const card = `
		<div class="card">
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
					<strong class="card-price-bold">${price} ₽</strong>
				</div>
			</div>
		</div>
	`;
	cardsMenu.insertAdjacentHTML('beforeend', card); // вставляем карточку товара в меню ресторана
}

// инициализация проекта
function init() {
	getData('./db/partners.json').then(function (data) { // метод then() обрабатывает промисы, в callback функцию передаем ответ в виде data
		data.forEach(createCardRestaurant) // перебираем data и передаем каждый елемент в функцию createCardRestaurant (Рендер карточек ресторанов)
	});

// вызовы событий
	cartButton.addEventListener("click", toggleModal); // клик по кнопке Корзина
	close.addEventListener("click", toggleModal); // клик по крестику Закрыть
	cardsRestaurants.addEventListener('click', openGoods); // переходим в ресторан при клике по карточке
	logo.addEventListener('click', returnMain); // при клике по логотипу переходим на начальную страницу

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