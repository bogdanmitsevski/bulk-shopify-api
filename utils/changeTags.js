let clothes_1 = ['Колготки', 'Плавки', 'Купальник', 'Шкарпетки', 'Носки', 'Труси', 'Трусы', 'Лиф', 'Чулки', 'Бікіні', 'Бикини', 'Білизна', 'Кафтан'];
let clothes_2 = ['Брюки', 'Легінси', 'Леггинсы', 'Штани', 'Штаны', 'Шорти', 'Шорты', 'Брюки-юбка', 'Бермуды', 'Кюлоты', 'Капри', 'Чиносы'];
let clothes_3 = ['Дублянка', 'Дубленка', 'Плащ', 'Пуховик', 'Тренч', 'Куртка', 'Пальто', 'Ветровка', 'Манто', 'Парка', 'Кабан', 'Шуба', 'Пальто-шарф', 'Накидка', 'Кейп'];
let clothes_4 = ['Джинси', 'Джинсы'];
let clothes_5 = ['Костюм', 'Смокинг'];
let clothes_6 = ['Піджак', 'Пиджак', 'Блейзер', 'Накидка', 'Жакет', 'Жилет', 'Жилетка'];
let clothes_7 = ['Сукня', 'Платье', 'Комбінезон', 'Комбинезон'];
let clothes_8 = ['Бомбер', 'Толстовка', 'Світшот', 'Свитшот', 'Худі', 'Худи', 'Лонгслив'];
let clothes_9 = ['Блуза', 'Бюстьє', 'Сорочка', 'Рубашка', 'Топ', 'Футболка', 'Поло', 'Боді', 'Боди', 'Майка', 'Майка-футболка', 'Корсет'];
let clothes_10 = ['Гольф', 'Джемпер', 'Кардиган', 'Светр', 'Свитер', 'Кофта', 'Туніка', 'Туника', 'Пончо'];
let clothes_11 = ['Спідниця', 'Юбка'];

let shoes_1 = ['Босоніжки', 'Босоножки', 'Босоножек'];
let shoes_2 = ['Ботильйони', 'Ботильоны', 'Ботильон'];
let shoes_3 = ['Черевики', 'Ботинки', 'Ботинок', 'Дезерти', 'Дезерты', 'Напівчеревики', 'Полуботинок', 'Челсі', 'Челси', ' Байкер', 'Байкеры'];
let shoes_4 = ['Кеди', 'Кеды', 'Кросівки', 'Кроссовки', 'Кроссы', 'Снікерси', 'Сникерсы', 'Сникерс'];
let shoes_5 = ['Балетки', 'Драйверы', 'Лодочки', 'Лофери', 'Лоферы', 'Мокасини', 'Мокасины', 'Сліпери', 'Слиперы', 'Слипоны', 'Эспадрильи', 'Криперы'];
let shoes_6 = ['Оксфорди', 'Оксфорды', 'Дербі', 'Дерби', 'Броги'];
let shoes_7 = ['Сабо', 'Мюлі', 'Мюли', 'Бабуші', 'Бабуши'];
let shoes_8 = ['Сандалі', 'Сандалии', 'Римлянки'];
let shoes_9 = ['Ботфорт', 'Ботфорты', 'Полусапог', 'Чоботи', 'Сапоги', 'Сапог', 'Сапог-чулок', 'Унты'];
let shoes_10 = ['Туфлі', 'Туфли', 'Туфель'];
let shoes_11 = ['Шльопанці', 'Шлёпки', 'Шлепки', 'Шлепанцы', 'Вьетнамки', 'Тапочки'];

let accessories_1 = ['Бейсболка', 'Капелюх', 'Шляпа', 'Кепка', 'Панама', 'Шапка', 'Повязка', 'Берет'];
let accessories_2 = ['Кардхолдер', 'Візитниця', 'Визитница'];
let accessories_3 = ['Клатч', 'Косметичка', 'Папка', 'Б\'юті-кейс', 'Бьютикейс'];
let accessories_4 = ['Гаманець', 'Кошелек', 'Портмоне'];
let accessories_5 = ['Окуляри', 'Очки'];
let accessories_6 = ['Рукавиці', 'Перчатки', 'Рукавички'];
let accessories_7 = ['Пояс', 'Ремінь', 'Ремень'];
let accessories_8 = ['Плед', 'Шаль', 'Шарф', 'Хустка', 'Платок', 'Парео'];
let accessories_9 = ['Сумка', 'Рюкзак', 'Портфель', 'Чемодан', 'Борселло'];
let accessories_10 = ['Бабочка', 'Галстук'];
let accessories_11 = ['Браслет', 'Каблучка', 'Кольцо', 'Кольє', 'Колье', 'Ланцюжок', 'Цепочка', 'Намисто', 'Бусы', 'Сережки', 'Серьги', 'Шпилька', 'Заколка', 'Ожерелье', 'Підвіска', 'Подвеска', 'Чокер', 'Украшение', 'Украшение_', 'Обруч', 'Клипсы'];
let accessories_12 = ['Ключниця', 'Ключница', 'Брелок', 'Чехол'];

function changeTags(tags) {
    let newTags = '';
    console.log(tags[0]);

    switch (true) {
        //clothes =============>
        case clothes_1.some(closthesValue => tags.includes(closthesValue)):
            newTags = tags.replace(clothes_1.find(closthesValue => tags.includes(closthesValue)),'') + ',одежда,белье_и_купальники';
            break;
        case clothes_2.some(closthesValue => tags.includes(closthesValue)):
            newTags = tags.replace(clothes_2.find(closthesValue => tags.includes(closthesValue)),'') + ',одежда,брюки_и_шорты';
            break;
        case clothes_3.some(closthesValue => tags.includes(closthesValue)):
            console.log(clothes_3.find(closthesValue => tags.includes(closthesValue)));
            newTags = tags.replace(clothes_3.find(closthesValue => tags.includes(closthesValue)),'') + ',одежда,верхняя_одежда';
            break;
        case clothes_4.some(closthesValue => tags.includes(closthesValue)):
            newTags = tags.replace(clothes_4.find(closthesValue => tags.includes(closthesValue)),'') + ',одежда,деним';
            break;
        case clothes_5.some(closthesValue => tags.includes(closthesValue)):
            newTags = tags.replace(clothes_5.find(closthesValue => tags.includes(closthesValue)),'') + ',одежда,костюмы';
            break;
        case clothes_6.some(closthesValue => tags.includes(closthesValue)):
            newTags = tags.replace(clothes_6.find(closthesValue => tags.includes(closthesValue)),'') + ',одежда,пиджаки';
            break;
        case clothes_7.some(closthesValue => tags.includes(closthesValue)):
            newTags = tags.replace(clothes_7.find(closthesValue => tags.includes(closthesValue)),'') + ',одежда,платья';
            break;
        case clothes_8.some(closthesValue => tags.includes(closthesValue)):
            newTags = tags.replace(clothes_8.find(closthesValue => tags.includes(closthesValue)),'') + ',одежда,свитшоты_худи';
            break;
        case clothes_9.some(closthesValue => tags.includes(closthesValue)):
            //new RegExp(clothes_9.find(closthesValue => tags.includes(closthesValue)), "g")
            newTags = tags.replace(new RegExp(clothes_9.find(closthesValue => tags.includes(closthesValue)), "g"),'') + ',одежда,топы_блузы_футболки';
            break;
        case clothes_10.some(closthesValue => tags.includes(closthesValue)):
            newTags = tags.replace(clothes_10.find(closthesValue => tags.includes(closthesValue)),'') + ',одежда,трикотаж';
            break;
        case clothes_11.some(closthesValue => tags.includes(closthesValue)):
            newTags = tags.replace(clothes_11.find(closthesValue => tags.includes(closthesValue)),'') + ',одежда,юбки';
            break;
        //accessories =============>    
        case accessories_1.some(accessoriesValue => tags.includes(accessoriesValue)):
            newTags = tags.replace(accessories_1.find(accessoriesValue => tags.includes(accessoriesValue)),'') + ',аксессуары,головные_уборы';
            break;
        case accessories_2.some(accessoriesValue => tags.includes(accessoriesValue)):
            newTags = tags.replace(accessories_2.find(accessoriesValue => tags.includes(accessoriesValue)),'') + ',аксессуары,картхолдеры';
            break;
        case accessories_3.some(accessoriesValue => tags.includes(accessoriesValue)):
            newTags = tags.replace(accessories_3.find(accessoriesValue => tags.includes(accessoriesValue)),'') + ',аксессуары,клатчи_косметички';
            break;
        case accessories_4.some(accessoriesValue => tags.includes(accessoriesValue)):
            newTags = tags.replace(accessories_4.find(accessoriesValue => tags.includes(accessoriesValue)),'') + ',аксессуары,кошельки';
            break;
        case accessories_5.some(accessoriesValue => tags.includes(accessoriesValue)):
            newTags = tags.replace(accessories_5.find(accessoriesValue => tags.includes(accessoriesValue)),'') + ',аксессуары,очки';
            break;
        case accessories_6.some(accessoriesValue => tags.includes(accessoriesValue)):
            newTags = tags.replace(accessories_6.find(accessoriesValue => tags.includes(accessoriesValue)),'') + ',аксессуары,перчатки';
            break;
        case accessories_7.some(accessoriesValue => tags.includes(accessoriesValue)):
            newTags = tags.replace(accessories_7.find(accessoriesValue => tags.includes(accessoriesValue)),'') + ',аксессуары,ремни';
            break;
        case accessories_8.some(accessoriesValue => tags.includes(accessoriesValue)):
            newTags = tags.replace(accessories_8.find(accessoriesValue => tags.includes(accessoriesValue)),'') + ',аксессуары,шарфы';
            break;
        case accessories_9.some(accessoriesValue => tags.includes(accessoriesValue)):
            newTags = tags.replace(accessories_9.find(accessoriesValue => tags.includes(accessoriesValue)),'') + ',аксессуары,сумки';
            break;
        case accessories_10.some(accessoriesValue => tags.includes(accessoriesValue)):
            newTags = tags.replace(accessories_10.find(accessoriesValue => tags.includes(accessoriesValue)),'') + ',аксессуары,аксессуары_к_одежде';
            break;
        case accessories_11.some(accessoriesValue => tags.includes(accessoriesValue)):
            newTags = tags.replace(accessories_11.find(accessoriesValue => tags.includes(accessoriesValue)),'') + ',аксессуары,украшения';
            break;
        case accessories_12.some(accessoriesValue => tags.includes(accessoriesValue)):
            newTags = tags.replace(accessories_12.find(accessoriesValue => tags.includes(accessoriesValue)),'') + ',аксессуары,другие_аксессуары';
            break;
        //shoes =============>   
        case shoes_1.some(shoesValue => tags.includes(shoesValue)):
            newTags = tags.replace(shoes_1.find(shoesValue => tags.includes(shoesValue)),'') + ',обувь,босоножки';
            break;
        case shoes_2.some(shoesValue => tags.includes(shoesValue)):
            newTags = tags.replace(shoes_2.find(shoesValue => tags.includes(shoesValue)),'') + ',обувь,ботильоны';
            break;
        case shoes_3.some(shoesValue => tags.includes(shoesValue)):
            newTags = tags.replace(shoes_3.find(shoesValue => tags.includes(shoesValue)),'') + ',обувь,ботинки';
            break;
        case shoes_4.some(shoesValue => tags.includes(shoesValue)):
            newTags = tags.replace(shoes_4.find(shoesValue => tags.includes(shoesValue)),'') + ',обувь,кеды_и_кроссовки';
            break;
        case shoes_5.some(shoesValue => tags.includes(shoesValue)):
            newTags = tags.replace(shoes_5.find(shoesValue => tags.includes(shoesValue)),'') + ',обувь,лоферы_и_мокасины';
            break;
        case shoes_6.some(shoesValue => tags.includes(shoesValue)):
            newTags = tags.replace(shoes_6.find(shoesValue => tags.includes(shoesValue)),'') + ',обувь,оксфорды_и_дерби';
            break;
        case shoes_7.some(shoesValue => tags.includes(shoesValue)):
            newTags = tags.replace(shoes_7.find(shoesValue => tags.includes(shoesValue)),'') + ',обувь,мюли';
            break;
        case shoes_8.some(shoesValue => tags.includes(shoesValue)):
            newTags = tags.replace(shoes_8.find(shoesValue => tags.includes(shoesValue)),'') + ',обувь,сандалии';
            break;
        case shoes_9.some(shoesValue => tags.includes(shoesValue)):
            console.log(shoes_9.find(shoesValue => tags.includes(shoesValue)));
            newTags = tags.replace(shoes_9.find(shoesValue => tags.includes(shoesValue)),'') + ',обувь,сапоги';
            break;
        case shoes_10.some(shoesValue => tags.includes(shoesValue)):
            newTags = tags.replace(shoes_10.find(shoesValue => tags.includes(shoesValue)),'') + ',обувь,туфли';
            break;
        case shoes_11.some(shoesValue => tags.includes(shoesValue)):
            newTags = tags.replace(shoes_11.find(shoesValue => tags.includes(shoesValue)),'') + ',обувь,шлепанцы';
            break;

        default:

    }

    return newTags;
}

module.exports = { changeTags };