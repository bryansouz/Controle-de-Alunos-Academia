const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sContato = document.querySelector('#m-contato')
const sVencimento = document.querySelector('#m-vencimento')
const btnSalvar = document.querySelector('#btnSalvar')












let students = [];
let id;

function openModal(edit = false, index = 0) {
  modal.classList.add('active');

  modal.onclick = e => {
    if (e.target.className.indexOf('modal-container') !== -1) {
      modal.classList.remove('active');
    }
  }

  if (edit) {
    sNome.value = students[index].nome;
    sContato.value = students[index].contato;
    sVencimento.value = students[index].vencimento;
    id = index;
  } else {
    sNome.value = '';
    sContato.value = '';
    sVencimento.value = '';
  }
}
function addMonth(index) {
  let student = students[index];
  let date = new Date(student.vencimento);
  date.setMonth(date.getMonth() + 1);
  student.vencimento = date;
  saveStudents();
  loadItens();
}


function insertItem(student, index) {
  let select = document.createElement('select');
  select.classList.add('select');
  select.dataset.studentIndex = index;
  select.innerHTML = `
    <option> Mensal</option>
    <option> Trimestral</option>
    <option> Anual</option>
  `;

  select.addEventListener('change', function(e) {
    let studentIndex = e.target.dataset.studentIndex;
    let selectedOption = e.target.value;
    let student = students[studentIndex];
    let date = new Date(student.vencimento);


    if (selectedOption === "Mensal") {
      date.setMonth(date.getMonth() + 1);
    } else if (selectedOption === "Trimestral") {
      date.setMonth(date.getMonth() + 3);
    } else if (selectedOption === "Anual") {
      date.setFullYear(date.getFullYear() + 1);
    }else{
      'nada adicionado'
    }

    
    student.vencimento = date;
    
    saveStudents();
  });
  
  
 
  let tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${student.nome}</td>
    <td>${formatDate(index)}</td>
    <td>${select.outerHTML}</td>
    <td class="acao">
      <button class="trinta" onclick="addMonth(${index})">
        <i class='bx bxs-cart-add'></i>
      </button>
    </td>
    <td class="acao">
     <button>${validacao(students.vencimento)}</button>

    </td>
    <td class="acao">
      <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
    </td>
    <td class="acao">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);    
}


function validacao(vencimento) {
  let day = new Date();
  let pagamento = new Date(vencimento);
  if (day > pagamento) {
    return `<p>Pendente</p>  <i class='bx bxs-message-square-error' style='color:#ce3333'  ></i>`
  } else {
    return `<p>Em dia</p> <i class='bx bxs-message-square-check' style='color:#3cce33' ></i>` 
  }
}


function editItem(index) {
  openModal(true, index);
}

function formatDate(index) {
 
  let student = students[index].vencimento
  date = new Date(student)
  let day = date.getDate()
  if (day < 10) day = '0' + day;

  let month = date.getMonth() + 1; // Months are zero-based in JavaScript
  if (month < 10) month = '0' + month;

  let year = date.getFullYear();

  return `${day}/${month}/${year}`;
}


function deleteItem(index) {
  const msg = `Tem certeza que deseja excluir ${students[index].nome}?`;
  if(!confirm(msg)) return;
  students.splice(index, 1);
  saveStudents();
  loadItens();
}

btnSalvar.onclick = e => {
  if (sNome.value == '') {
    return;
  }

  e.preventDefault();

  if (id !== undefined) {
    students[id].nome = sNome.value;
    students[id].contato = sContato.value;
    students[id].vencimento = sVencimento.value;
  } else {
    students.push({'nome': sNome.value, 'contato': sContato.value, 'vencimento': sVencimento.value});
  }

  saveStudents();
  modal.classList.remove('active');
  loadItens();
  id = undefined;
}

function loadItens() {
  students = getStudents();
  tbody.innerHTML = '';
  students.forEach((student, index) => {
    insertItem(student, index);
  });
}

const getStudents = () => JSON.parse(localStorage.getItem('listStudents')) ?? [];
const saveStudents = () => localStorage.setItem('listStudents', JSON.stringify(students));

loadItens();