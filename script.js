const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sContato = document.querySelector('#m-contato')
const sVencimento = document.querySelector('#m-vencimento')
const btnSalvar = document.querySelector('#btnSalvar')

let students
let id

function openModal(edit = false, index = 0) {
    modal.classList.add('active')
  
    modal.onclick = e => {
      if (e.target.className.indexOf('modal-container') !== -1) {
    
        modal.classList.remove('active')
      }
    }


  if (edit) {
    sNome.value = students[index].nome
    sContato.value = students[index].contato
    sVencimento.value = students[index].vencimento
    id = index
  } else {
    sNome.value = ''
    sContato.value = ''
    sVencimento.value = ''
  }
}

function insertItem(students, index) {
  const diaAtual = new Date().getDate() 
    let pagamento = new Date(students.vencimento).setDate(students.vencimento) 
    console.log(pagamento);
  function validacao(){
  
    if(diaAtual >= pagamento){

      return `<i class='bx bxs-message-square-error' style='color:#ce3333'  ></i>`

    }else{
      return `<i class='bx bxs-message-square-check' style='color:#3cce33' ></i>` 

    }
  }
  
    let tr = document.createElement('tr')
  
    tr.innerHTML = `
      <td>${students.nome}</td>
      <td>${students.contato}</td>
      <td> Dia ${pagamento}</td>
      <td class="acao">
        <button onclick="paid(${index})">${validacao()}</button>
      </td>
      <td class="acao">
        <button onclick="editItem(${index})"><i class='bx bx-edit' ></i></button>
      </td>
      <td class="acao">
        <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
      </td>
    `
    validacao()
    tbody.appendChild(tr)

    

  }

  
function paid(index){
  if(index){
    pagamento + 30
  }
}


function editItem(index) {

    openModal(true, index)
  }
  
function deleteItem(index) {
    const msg = `Tem certeza que deseja excluir ${students.name}?`
    if(!confirm(msg)) return
    students.splice(index, 1)
    saveStudents()
    loadItens()
  }

btnSalvar.onclick = e => {
  
    if (sNome.value == '' || sContato.value == '' || sVencimento.value == '') {
      return
    }
  
    e.preventDefault();
  
    if (id !== undefined) {
        students[id].nome = sNome.value
        students[id].contato = sContato.value
        students[id].vencimento = sVencimento.value
    } else {
        students.push({'nome': sNome.value, 'contato': sContato.value, 'vencimento': sVencimento.value})
    }
  
    saveStudents()
  
    modal.classList.remove('active')
    loadItens()
    id = undefined
  }

function loadItens() {
    students = getStudents()
    tbody.innerHTML = ''
    students.forEach((students, index) => {
      insertItem(students, index)
    })
  
  }
  
  const getStudents = () => JSON.parse(localStorage.getItem('listStudents')) ?? []
  const saveStudents = () => localStorage.setItem('listStudents', JSON.stringify(students))
  
  loadItens()
