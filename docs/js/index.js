(function () {
    const formatMoney = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
    const elementos = [
        { img: "1.jpeg", precio: 245 }
        , { img: "2.jpeg", precio: 235 }
        , { img: "3.jpeg", precio: 289 }
        , { img: "4.jpeg", precio: 698.99 }
        , { img: "6.jpeg", precio: 219 ,selected:true}
        , { img: "7.jpeg", precio: 229.01 }
        , { img: "8.jpeg", precio: 195 }
    ].sort(function (a, b) {
        return a.precio - b.precio;
    });
    const Prodcutos=[
        {
            url:'https://www.amazon.com.mx/dp/B013UZYD8G/ref=cm_sw_r_apan_glt_i_XPYRTECAC7FKZ8GQFSVN?th=1',
            text:'Pretul CAZ-40P, Cortador de azulejo 40 cm (15"), Pretul',
            img:'pretul.jpg',
            costo:279
        },
        {
            url:'https://www.amazon.com.mx/dp/B098WZ9QWX/ref=cm_sw_r_apan_glt_i_T6J4R3BFA8JHNW5V6D1X',
            text:'bobotron 151 unidades de espaciadores de nivel de cerámica planos para azulejos',
            img:'bobotron.jpg',
            costo:372
        },
        {
            url:'https://www.amazon.com.mx/dp/B00UY245XM/ref=cm_sw_r_apan_glt_i_R119W3157BBMK9E3AGND',
            text:'Mini Esmeriladora 4.1/2 820W 11000Rpm 5/8-11 6 Dis B+D G720P',
            img:'esmeril.jpg',
            costo:719
        },
        {
            url:'https://www.amazon.com.mx/dp/B08HV6J9W3/ref=cm_sw_r_apan_glt_i_9BFTEPK6XNTCWN6Y4GAT',
            text:'King Showden - Mezclador de mortero eléctrico de 2100 W',
            img:'KingShowden.jpg',
            costo:1863.61
        },
        {
            url:'https://www.amazon.com.mx/dp/B08LPHD7GT/ref=cm_sw_r_apan_glt_i_8DABH825MPJDJGXMZD56?th=1',
            text:'Mezclador de pintura y mortero | 16 pulgadas de largo',
            img:'mezclador.jpg',
            costo:229.69
        },
    ]
    const input = document.getElementById('metros')
    const table = document.getElementById('Pisos')
    const tablePisos = document.getElementById('Articulos')
    const select = document.getElementById('filtro')
    const costoTotal = document.getElementById('costoTotal')
    const createTable=(img)=>{
        let newElements=[];
        if(img){
            newElements=elementos.filter(e=>e.img===img);
        }else{
            newElements=elementos;
        }
        table.innerHTML = newElements.map((e, i) => `<tr data-precio="${e.precio}">
                            <td scope="row">${i+1}</td> 
                            <td>${e.img}</td>
                            <td><img src="./img/${e.img}"   class="rounded float-left " style="width:6em"/></td>
                            <td>${formatMoney.format(e.precio)}</td>
                            <td>${formatMoney.format(e.precio * input.value)}</td>
                            </tr>`).join('');
    }
    tablePisos.innerHTML=Prodcutos.map((e, i) => `<tr data-costo="${e.costo}">
                                                    <td scope="row">${i+1}</td> 
                                                    <td><img src="./img/${e.img}"   class="rounded float-left " style="width:6em"/></td>
                                                    <td><a href="${e.url}" class="btn btn-link" target="_blank"> ${e.text}</a></td>
                                                    <td>${formatMoney.format(e.costo)}</td>
                                                    <td><input type="number" value="1"/></td>
                                                    </tr>`).join('');
    function calucula() {
        const trs = [...table.querySelectorAll('tr')]
        trs.forEach((e, i) => {
            if (this.value) {
                const Precio = elementos[i].precio
                e.children[3].innerHTML = formatMoney.format(Precio * new Number(this.value))
            } else {
                e.children[3].innerHTML = 0
            }
        })
    }
    const calculaTotal=()=>{
        let Total=0;
        pisosTr=[...table.querySelectorAll('tr')]
        articulosTr=[...tablePisos.querySelectorAll('tr')]
        pisosTr.forEach(e=>Total+=Number(e.dataset.precio)*Number(input.value))
        articulosTr.forEach(e=>Total+=Number(e.dataset.costo)*Number(e.querySelector('input').value))
        costoTotal.innerHTML=`<small>Costo Total: </small>${formatMoney.format(Total)}`
    }
    const createSelect=()=>{
        select.innerHTML='<option value="">TODOS</option>'
        select.innerHTML+=elementos.map((e,i)=>`<option value="${e.img}" data-precio=${e.precio}" ${(e?.selected?'selected':'')}>No. ${i+1} - ${e.img} - ${formatMoney.format(elementos[i].precio)}</option>`).join('')
    }
    const modalShow=(e)=>{
        console.log(e.target.nodeName)
        if(e.target.nodeName==='IMG'){
            modal.querySelector('.modal-dialog').innerHTML=`<center><img src="${e.target.src}" class="img-fluid" alt="Responsive image"/></center>`
            $(modal).modal('show')
            
        }else if(e.target.nodeName==='INPUT'){
            const input = e.target;
            input.addEventListener('keypress',calculaTotal)
            input.addEventListener('keyup',calculaTotal)
            input.addEventListener('blur',calculaTotal)
        }
    }
    const Dispatch = (elemento,evtDispatch) => {
        let a = elemento
        let evt = document.createEvent('MouseEvents');
        evt.initEvent(evtDispatch, true, true);
        a.dispatchEvent(evt);
    };
    
    input.addEventListener('keypress', calucula)
    input.addEventListener('keyup', calucula)
    select.addEventListener('change',function(){
        createTable(this.value)
        calculaTotal()
    })
    const modal=document.getElementById('modalImg')
    table.addEventListener('click',modalShow)
    tablePisos.addEventListener('click',modalShow)
    // createTable()
    createSelect()
    Dispatch(select,'change')
    calculaTotal()
})()
