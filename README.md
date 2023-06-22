# vk-chat-bot
💬 Чат бот для соц-сети ВКОНТАКТЕ отвечающий на сообщения пользователей. Теперь поддерживает мультиаккаунтность. Подключи себя и своих друзей, друзей друзей. <br />
❗ Необходима ОС Windows 10+ или Linux. Рекомендуется ОЗУ от 2 ГБ и процессор от 2 ядер. <br />
____
Инструкция к применению пользователем состоит из 6 шагов: <br /> <br />
Шаг 1. Скачиваем с официального сайта Node.js по ссылке https://nodejs.org/en/ <br /> <br />
Шаг 2. Затем скачиваем сей проект архивом и распаковываем на пк (Зеленая кнопка code<> > Download ZIP). <br />
При наличии git можно просто вбить команды в консольке:

```bash
git clone https://github.com/ckieverentineas/vk-chat-bot.git
cd vk-chat-bot-master
```

Шаг 3. Скачиваем готовую БОЛЬШУЮ базу данных по ссылке https://disk.yandex.ru/d/0oFPdSyZVLkD-g теперь запакованную в zip, тем самым обьем при скачивании сокращен минимум в два раза и закидываем в папку prisma под названием dev.db - относительный путь будет таким vk-chat-bot-master/prisma/dev.db <br /><br />
Шаг 4. Создаем файл .env в корне проекта - относительный путь будет таким vk-chat-bot-master/.env <br />
🆘 Примерная конфигурация проекта файла .env:

```javascript
DATABASE_URL = "file:./dev.db?socket_timeout=600&connection_limit=1"
root = ИДВК #root user
VK_ENTITIES = '[
    {   
        "token": "ТОКЕН ОТ СТРАНИЦЫ VK ADMIN К ПРИМЕРУ",
        "idvk": ИДВК,
        "type": "page"
    },
    {   
        "token": "ТОКЕН ОТ ГРУППЫ",
        "idvk": ИДВК,
        "type": "group"
    }
]'
```

💡 Поясняем: <br />
DATABASE_URL - путь к нашей базе данных с заданными настройками подключения. Оставляем, как в примере. <br />
root - idvk вашей главной страницы не для ботов, а лишь управления ими. <br />
VK_ENTITIES массив записей аккаунтов где указывается данные по примеру, т.е. <br />
- type, строка, вписываете page, если бот страничный, group, если бот для группы; <br />
- token, строка, токен который обеспечивает доступ к вашей странице/группе; <br />
- idvk, число, idvk идентификатор от группы или страницы. <br />
Токен для страницы вы можете получить здесь, выбрав приложение в качестве VK Admin: https://vkhost.github.io/ <br /> <br />

Шаг 5. Просто запустите вначале скрипт init.bat для windows или init.sh для linux, затем по окончанию первого - db.bat для windows или db.sh для linux.
Команды для консоли cmd или другом терминале вручную - открыть корень проекта и применить следующие команды:

```bash
npm i
npx prisma migrate dev --name init
npx prisma generate
```

Шаг 6. Бот полностью готов к эксплуатации, просто запустите скрипт start.bat для windows или start.sh для linux каждый раз, когда надо запустить бота.
Команды для консоли cmd или другом терминале вручную - открыть корень проекта и применить следующие команды:

```bash
npm run dev
```

если сообщения об успешном запуске не появилось, тогда попробуйте еще одну команду:

```bash
npm start
```

💡 Если не заработало, пишите мне, да и вообще с любыми стактрейсами пишите: https://vk.com/dj.federation <br /> <br />
____
☠ Команды бота уже сделанные: <br />
⚙ !база - считывает тхт формата: \nВопрос\nОтвет\nОтвет\n\nВопрос\nОтвет\n\nВопрос\nОтвет\nОтвет\nОтвет\nОтвет\n\n..... <br />
⚙ !конфиг - показывает текущую конфигурацию бота и версию бота <br />
⚙ !игнор idvk - где idvk, пишем уникальный идентификатор пользователя вк, для включения или отключения режима его игнорирования <br />
⚙ !инфа - выдает информацию о вас и вашем статусе для релевантности бота, конечно вам покажут не все=) <br />
⚙ !юзердроп - удаляет всех пользователей <br />
⚙ !помощь - напоминалка по командам <br />
⚙ !аптайм - показывает время работы бота со времени старта. <br />
⚙ !обучение - достает неизвестные вопросы, обнаруженные ботом и предлагает их скорректировать и дать ответы на них. <br />
⚙ !дамп - сохраняет txt в корне проекта под названием "questions_and_answers.txt" согласно новому формату для txt документов формату. <br />
____
☠ Возможности бота: <br />
🚀 GLOBAL Поддержка мультиакаунтности, можно подключить как группу, так и страничку VK; <br />
🚀 GLOBAL Авто-добавление в игнор спамеров, игнорирующих предупреждения о том, что они слишком быстро пишут; <br />
🚀 GLOBAL Игнорирование тех, кто повторяет за ботом или повторяется сам; <br />
🚀 GLOBAL Игнорирование тех, кто упоминает не бота; <br />
🚀 CHAT Игнорирование сообщений в беседах, где находятся больше одного подключенного к приложению бота; <br />
🚀 CHAT Игнорирование сообщений в беседах, ответы на которые адресованы не боту; <br />
🚀 CHAT Думает, когда отвечать на сообщения в беседах, т.е. если в сообщении 1 слово и выше, то шанс на ответ 5%, при двух и более - 10%, 3-х и выше, 35%, от 4-х слов - 50%; <br />
🚀 RESEACH Четкий поиск ответа посредством DirectBoost, т.е. нахождения прямого вхождения 1 к 1 для выдачи ответа;  <br />
🚀 RESEACH Нечеткий поиск ответа посредством MultiBoost, самый крутой поисковик по цене/качеству скорости работы, выдает самый ближайщий ответ похожий от 30% и выше, парсит сообщение на предложения и подбирает; <br />
🚀 GROUP Группы помимо всего прочего реагируют на комментарии под своими постами на своей стене; <br />
🚀 GLOBAL Новый формат данных для вопросов и ответов, новый парсер к нему, дампер и адаптация поисковиков; <br />
🚀 EDUCATION Реализована возможность обучать бота, неизведанные вопросы будут добавляться в список неизвестных, а с помощью команды !обучение есть возможность дать ответы на них, и исправить ошибки в вопросах; <br />
🚀 NEW CORRECTION в FP IHA BOT VK Раньше были системные переменные по типу %username% и другие, теперь они задейстованы и подменяются на данные юзеров. <br />
____
💬 Подробнее о команде !база: <br />
Для команды !база по пути vk-chat-bot-master/book/ кладем в директорию (папку) book корня проекта - txt файлы согласно формату, описанному ниже для этой команды.
Пишите боту !база - бот начнет считывать любое количество файлов в данной папке и сохранять ответы в базу данных SQLite <br />
💡 Скорость сохранения 6-7 строк в секунду (если они являются еще неизвестными) <br />
🔧 Формат txt для базы данных ТЕПЕРЬ такого плана:

```javascript
<~Вопрос
~>Ответ
~>Ответ

<~Вопрос
~>Ответ
~>Ответ
~>Ответ
~>Ответ

<~Вопрос
~>Ответ
~>Ответ
~>Ответ

<~Вопрос
~>Ответ
```
💡 Подсказки по команде !база: <br />
- "<&#126;" - означает вопрос, фича чисто визуальная; <br />
- "&#126;>" - означает один из вариантов ответа на вопрос, также является визуальной фичей и при записи в базу изымается; <br />
- Пустая строка означает переход к следующему вопросу. <br />
- В диркетории book лежат образцы файлов для команды !база Да и в целом айха бд уже сконвертирован в новый формат, что удалось достать.
____

💬 Теперь в базе данных есть подмена переменных, в строках ответов на вопросы подменяются следующие переменные: <br />
💫 %userphoto% в строке с выбранным ответом все такие вхождения заменяет на ссылку страницы написавшего в качестве заглушки `https://vk.com/id${user.id}` <br />
💫 %username% в строке с выбранным ответом все такие вхождения заменяет на ИМЯ написавшего пользователя <br />
💫 %usersurname% в строке с выбранным ответом все такие вхождения заменяет на ФАМИЛИЮ написавшего пользователя <br />
💫 %userstatus% в строке с выбранным ответом все такие вхождения заменяет на 'сидит в ВК и листает ленту', 'ищет интересные группы', 'читает свежие новости', 'слушает любимую музыку' ,  'смотрит интересное видео', 'общается с друзьями', 'играет в интересную игру', 'ест вкусную пиццу', 'пьет чай с печеньками', 'мемит и троллит друзей', 'просто скучает', 'ждет выходных', 'мечтает о лете и отпуске', 'хочет спать', 'думает о смысле жизни' или 'слушает "Радио Тапок"'. <br />
💡 Для примера сохранен ответ в базе данных "Привет, %username% %usersurname%, как поживаешь?" на вопрос "Привет, я скучала", ответом будет к примеру: Привет, София Лианская, как поживаешь? <br />
____
☠ Если вы хотите обучить бота сами и с нуля, то удалите dev.db в папке prisma и выполните скрипт db.bat для windows или db.sh для linux <br /> <br />
Обратная прямая связь, вопросы и предложения по адресу: https://vk.com/dj.federation <br />