
(async function () {
    const url =`http://70.35.199.113/`;
    const formatMoney = new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'MXN'
    });
    let response = await fetch(url).then(res=>res.json())  
    const {Pisos,Productos}= response; 
    const elementos = [ ... Pisos ].sort(function (a, b) {
        return a.precio - b.precio;
    });
    const layout=(mode)=>(`
        <div class="modal-content px-5 py-5">
        <form data-mode="${mode}">
        <input type="hidden" id="id" value=""/>
            <div class="row mb-3">
                <div class="col-12 col-md-6">
                    <label for="text" class="form-label">Descripcion del articulo</label>
                    <input type="text" class="form-control" id="text" required/>
                </div>
                <div class="col-12 col-md-4">
                    <label for="costo" class="form-label">Costo</label>
                    <input type="number" step="0.01" class="form-control" id="costo" required />
                </div>
                <div class="col-12 col-md-2">
                    <label for="cantidad" class="form-label">Cantidad</label>
                    <input type="number" class="form-control" id="cantidad" value="1" />
                </div>
            </div>
            <div class="row mb-3">
                <div class="col-12 col-md-6">
                    <label for="url" class="form-label">Url del articulo</label>
                    <input type="text" class="form-control" id="url" aria-describedby="url" />
                </div>
                <div class="col-12 col-md-6">
                    <label for="img" class="form-label">Url Imagen</label>
                    <input type="text" class="form-control" id="img" />
                    <div id="imgHelp" class="form-text">(Opcional)</div>
                </div>
            </div>
         
          <button type="submit" class="btn btn-primary"><i class="fa-solid fa-floppy-disk"></i> Guardar</button>
        </form>
      </div>`
    )
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
                            <td><img src="${url}img/${e.img}"   class="rounded float-left " style="width:6em"/></td>
                            <td>${formatMoney.format(e.precio)}</td>
                            <td>${formatMoney.format(e.precio * input.value)}</td>
                            </tr>`).join('');
    }
    tablePisos.innerHTML=Productos.map((e, i) => `<tr id="${e.id}" data-costo="${e.costo}">
                                                    <td scope="row" >
                                                        <div class="d-grid gap-2 d-md-block">
                                                            <span class="delete btn btn-sm btn-danger mx-2"><i class="fa-solid fa-trash"></i></span>
                                                            <span class="edit btn btn-sm btn-info mx-2"><i class="fa-solid fa-pen-to-square"></i></span>
                                                        </div>
                                                    </td> 
                                                    <td>
                                                        ${(e.img?`<img src="${(e.img.includes('http')?e.img:`${url}img/${e.img}`)}" class="d-none d-md-block rounded float-left " style="width:6em"/>
                                                        <span class="d-block d-md-none btn btn-link" data-src="${(e.img.includes('http')?e.img:`${url}img/${e.img}`)}" ><i class="fa-solid fa-image"></i> Ver</span>`:`<span class="d-block "><i class="fa-solid fa-image"></i><br/>Sin imagen</span>`)}
                                                        
                                                    </td>
                                                    <td><a href="${e.url}" class="btn btn-link text-center text-wrap" target="_blank"> ${e.text}</a></td>
                                                    <td>${formatMoney.format(e.costo)}</td>
                                                    <td><input type="number" value="${e.cantidad}" style="width:70px"/></td>
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
        calculaTotal()
    }
    const submit=async(e)=>{
        e.preventDefault();
        let method='';
        const modo=e.target.dataset.mode;
        if(modo==1)method="POST";
        else method="PUT"
        response = await fetch(url,{
            method,
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                "cantidad":Number(e.target.cantidad.value)
                ,"costo":Number(e.target.costo.value)
                ,"text":e.target.text.value
                ,"url":e.target.url.value
                ,"img":e.target.img.value
                ,"id":Number(e.target.id.value)
            })
        }).then(res=>res.json())
        if(response.exito){
            location.reload();
        }
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
        console.log(e.target.className)
        if(e.target.nodeName==='IMG' && e.target.src){
            modal.querySelector('.modal-dialog').innerHTML=`<center><img src="${e.target.src}" class="img-fluid" alt="Responsive image"/></center>`
            $(modal).modal('show')
        }else if(e.target.nodeName==='INPUT'){
            const input = e.target;
            input.addEventListener('keypress',calculaTotal)
            input.addEventListener('keyup',calculaTotal)
            input.addEventListener('blur',calculaTotal)
        }else if(e.target.nodeName==='SPAN' && e.target.dataset.src){
            modal.querySelector('.modal-dialog').innerHTML=`<center><img src="${e.target.dataset.src}" class="img-fluid" alt="Responsive image"/></center>`
            $(modal).modal('show')
        }else if(e.target.nodeName==='SPAN' && (e.target.className.includes("delete")||e.target.className.includes('fa-trash'))){
            fetch(url,{
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({id:Number(e.target.closest("tr").id)})
            }).then(res=>res.json())
            .then(({exito})=>{
                if(exito){
                    location.reload();
                }
            })
        }
        else if(e.target.nodeName==='SPAN' && (e.target.className.includes("edit")||e.target.className.includes('fa-pen-to-square'))){
            const Obj = Productos.find(o=>o.id==e.target.closest("tr").id)
            modal.querySelector('.modal-dialog').innerHTML=layout(2)
            const form =modal.querySelector('form');
            form.addEventListener('submit',submit)
            const keys = Object.keys(Obj);
            console.log(keys)
            keys.forEach(e=>{
                form[e].value=Obj[e]
            })
            $(modal).modal('show')
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
    document.getElementById('addProduct').addEventListener('click',async ()=>{
        modal.querySelector('.modal-dialog').innerHTML=layout(1)
        modal.querySelector('form').addEventListener('submit',submit)
        $(modal).modal('show')
    })
    const modal=document.getElementById('modalImg')
    table.addEventListener('click',modalShow)
    tablePisos.addEventListener('click',modalShow)
    createSelect()
    Dispatch(select,'change')
    calculaTotal()
})()
