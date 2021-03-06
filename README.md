# *Automata(.js)* #

### Dependencies: ###
 TODO написать все сюда

### ENV ###

Для того чтобы все завелось, должны быть созданы и прописаны следующие переменные окружения
 * ENV - глобально определяет с каким окружением мы работаем. Возможные варианты - production/prod если это бой или development/dev если это понятно дело дев-сервер
 * BROKER_HOST - здесь хост сервис-брокера
 * BROKER_PORT - ну понятно
 * ECHO_HOST - аналогично но для эхо сервера. Нода сейчас стучится в зависимости от переменной ENV либо на эхо либо на брокера
 * ECHO_PORT - см. выше
 * APP_PORT_SOCKET - порт самой прилаги для сокетов (для будущей админки которой пока что нет)
 * APP_PORT_HTTP - самое главное, порт на который мы слушаем входящие соединения
 * REDIS_HOST - хост редиски
 * REDIS_PORT - порт редиски
 * REDIS_DB - индекс базы в редиске (лучше делать отдельным чтоб мой FSM ничего не затер)
 * MONGODB_HOST - тоже для монги
 * MONGODB_PORT - ~
 * MONGODB_DB - ~
 * MONGODB_DSN - полный путь подключения к БД монги. формат - mongodb://host:port/database
 * LOGSTASH_HOST - хост сервера логов
 * LOGSTASH_PORT - порт
 * LOGSTASH_PREFIX - префикс (не помню зачем он но он нужен)

### Modules: ###
~~если вы увидели зачеркнутый текст~~:
  * функционал модуля не готов
  * функционал модуля готов но не оформлен в виде отдельной программной конструкции  
  (модуль, middleware, функция)

##### app.js #####

Входной модуль, в него все собирается (через require, НЕ сборку)

1. **require()**
 * подключаются остальные модули
2. ~~**init()**~~
 * инициализирует подготовку приложения к запуску
 * считывает конфиги
 * резолвит адреса
 * проч.
3. ~~**run()**~~
 * начинаем слушать порты
 * инициализируем все субмодули (логер например)
 * запускаем приложение
 * ~~оповещаем об успешном старте всех остальных~~
4. ~~является **child-process**'ом для **cluster**'а~~
5. ~~instance для мониторинга тем или иным **APM'ом**~~

##### machina.js #####

Модуль самой **бизнес**-сущности кредита

1. **State**
 * функциональные состояния, в которых кредит осуществляет какую-либо деятельность (do-activity)
 * отправление сигналов внешним сервисам
 * различные таймеры (просрочка например)
 * запуск переходов по определенным событиям
2. **Transition**
 * обеспечение логики переходов из одного состояния в другое
 * дополнительная run-to-completion activity в тех случаях когда требуется
3. **Signal**
 * внутренние сигналы для self-transitions
 * внешние сигналы для сообщения с остальными микросервисами
4. ~~**Event**~~

##### log.js #####

Модуль логирования (*instant feedback*)

1. логирование всего и вся средствами winston
 * логирование в файлы и в консоль
 * разные уровни логирования в зависимости от среды и транспорта
    * error, warn, info, debug в консоль
    * разные файлы для разного уровня ошибок (error.log, info.log)
2. ~~использование внешнего транспорта~~
 * ~~логирование через LogStash~~

##### db.js #####
 1. инкапсулирует логику занесения данных при существенных изменениях состояния приложения
   * в "постоянную"**MongoDB**/~~**Tarantool**~~)
   * и "оперативную" память (**Redis**, ~~**Memcache**~~, *тысячи их*)
 2. ~~дает возможность подключить любую БД (*DI*)~~

##### conf.js #####

Модуль конфигурирования

1. В зависимости от среды настраивает
 * пути
 * адреса
 * credentials
 * способы логирования
 * настройки mock-объектов
 * проч.

##### client.js #####

Модуль общения с остальными сервисами

1. подключает сторонние библиотеки для отправки сообщений внешним сервисам
 * подключает библиотеки
 * собирает сообщения
 * отправляет

##### server.js #####

2. аналогично клиенту, но для получения и обработки сообщений извне
 * читает сообщения
 * валидирует
 * скармливает мне

##### echo.js #####

1. слушающий сервер
 * дает ответы от api-mock'а об успешном получении сообщения
2. ~~возможно будет *fake-server*'ом в рамках работы с **Sinon.js**~~

##### bus.js #####

Модуль для передачи сообщений между модулями

1. Подписывает модули на рассылки и регистрирует "классы" кредитов как источники сообщений (**pub/sub** короч)
2. ~~Возможно будет делать очередность сообщений~~
 * для синхронизации запланированных сообщений множества кредитов для экономии памяти и времени
 чем-то напоминает модуль **event-loop**'а в самой **Node.js**

##### pool.js #####

Модуль для хранения кредитов "чисто" в **RAM** (память самой **Node.js**)
1. ~~для формирования "логических" групп кредитов. cases:~~
  * формирование список рассылки
  * распределение в "лесопилке"
  * сами придумайте
  * для их перераспределения
     * **День Добра**
     * при "особых" внешних событиях - например - **день Таджика** (*всем таджикам понять и простить в этот день*, ***доброта*** *+5*))
2. для кэширования кредитов (в рамках реализации Memento)
 * кэшируем только состояние и таймер
 * восстанавливаем, делаем нужные телодвижения и снова схлопываем

##### ~~??? 3.js~~ #####

Модуль для общения модулей между собой (для кластера)  
(Может быть будет в рамках кластера, не отдельным модулем, даже скорее всего)

1. ~~Считывает сообщения самих модулей~~
 * закрэшился
 * закэшился
 * не загрузился
 * да что угодно
2. ~~Передает эти сообщения кластеру~~
 * надо поднять child-process по нехватке памяти
 * внешний сервис не отвечает, надо логировать изменения локально чтоб потом их пачкой высыпать тем сервисам которые когда-нибудь оживут
 * проч.
