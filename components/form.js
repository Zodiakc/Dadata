class InputCustom extends HTMLElement {
    constructor() {
        super();
        this.innerHTML = `
        <form action="#">
            <h2>Компания или ИП</h2>
                <input
                     placeholder="Введите название, ИНН, ОГРН или адрес организации "
                     class="main-input"
                 />
            <ul class="list"></ul>
            <h3>Краткое наименование</h3>
            <input type="text" class="short" />
            <h3>Полное наименование</h3>
            <input type="text" class="full" />
            <h3>ИНН / КПП</h3>
            <input type="text" class="inn" />
            <h3>Адрес</h3>
            <input type="text" class="adress" />
        </form>

            `;

        const short = this.querySelector(".short");
        const main = this.querySelector(".main-input");
        const btn = this.querySelector(".btn");
        const inn = this.querySelector(".inn");
        const full = this.querySelector(".full");
        const adress = this.querySelector(".adress");
        const list = this.querySelector(".list");

        main.value = "";
        inn.value = "";
        adress.value = "";
        full.value = "";
        short.value = "";

        let arrayOfData;
        const url =
            "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
        const token = "448e47eb7081410811d478b4fc1a4b1bdabd6826";
        let query = main.value;
        const options = {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Token " + token,
            },
            body: JSON.stringify({ query: query }),
        };

        function setQuery(text) {
            options.body = JSON.stringify({ query: text });

            fetch(url, options)
                .then((response) => response.text())
                .then((res) => JSON.parse(res))
                .then((res) => (arrayOfData = res.suggestions))
                .then(() => (list.innerHTML = ""))
                .then(() => (list.style = "border: none; overflow: hidden"))
                .then(() =>
                    arrayOfData.forEach((element, index) => {
                        let li = document.createElement("li");
                        li.classList.add("list-item");
                        li.innerText = element.value;
                        list.appendChild(li);
                        list.style = "border: 1px solid black; overflow:scroll";
                        li.addEventListener("click", () => setData(element));
                    })
                );
        }
        main.addEventListener("input", (e) => setQuery(e.target.value));

        function setData(element, index) {
            list.style = "display:none";
            main.value = element.value;
            inn.value = `${element.data.inn}/${element.data.kpp}`;
            adress.value = element.data.address.value;
            full.value = element.data.name.full_with_opf;
            short.value = element.data.name.short_with_opf;
        }
    }
}
customElements.define("custom-form", InputCustom);
