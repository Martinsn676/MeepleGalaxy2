
function checkInput(target,req,neg){
    const messageField = target.querySelector(".message")
    const input = target.querySelector(".input")
    const inputValue = input.value
    localStorage.setItem(`${input.id}`, JSON.stringify(inputValue));

    if(req==="email"){
        if((/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputValue))){
            messageField.innerText = "";
            return inputValue;
        }else{
            messageField.innerText = `${neg}`
            return (false);
        }
    }else if(req==="twoWords"){
        if(inputValue.includes(" ")){
            const [firstName, lastName] = inputValue.split(" ");
            if(firstName.length>1 && lastName.length>1){
                messageField.innerText = "";
                return inputValue;
            }  
        }
        return (false);
    }else if(inputValue.length>req-1){
        messageField.innerText = "";
        return inputValue;
    }else{
        messageField.innerText = `${neg} ${inputValue.length}/${req}`
        return (false);
    }
}

const emailFieldContainer = document.querySelector("#emailFieldContainer")
emailFieldContainer.addEventListener("keyup",()=>checkInput(emailFieldContainer,"email","Not a valid e-mail yet"))

const nameContainer = document.querySelector("#nameContainer")
nameContainer.addEventListener("keyup",()=>checkInput(nameContainer,5,""));

const subjectContainer = document.querySelector("#subjectContainer")
subjectContainer.addEventListener("keyup",()=>checkInput(subjectContainer,15,""));

const messageContainer = document.querySelector("#messageContainer")
messageContainer.addEventListener("keyup",()=>checkInput(messageContainer,25,""));

const submitButton = document.querySelector("#submitButton")
submitButton.addEventListener("click",()=>checkAllInputs());

const inputFields = document.querySelectorAll("#contactForms .input")


let saveLoaded = false;

function checkForUnsent(){
    inputFields.forEach(element => {
        oldInput = JSON.parse(localStorage.getItem(`${element.id}`));
        if(oldInput && oldInput.length>0){
            element.value=oldInput;
            saveLoaded=true
        }
    });
    if(saveLoaded){
        document.querySelector("#saveMessage").innerHTML= `
            <span>Welcome back, we saved your form</span>
            <button onclick='resetForm()'>Reset it</button>
        `;
    }
}
function resetForm(){
    inputFields.forEach(element => { 
        element.value=""
        localStorage.removeItem(`${element.id}`);
    });
    document.querySelector("#saveMessage").innerHTML=""
}

checkForUnsent()
function checkAllInputs(){
    emailInput = checkInput(emailFieldContainer,"email","Please write a valid e-mail") 
    nameInput = checkInput(nameContainer,5,"Please write your full name") 
    subjectInput = checkInput(subjectContainer,15,"Please write a longer subject")
    messageInput = checkInput(messageContainer,25,"Please write a longer message")
    sumbitArray = [emailInput,nameInput,subjectInput,messageInput]
    let errors = 0
    const submitMessage = document.querySelector("#submitMessage")
    sumbitArray.forEach(element => {
        if(element === false){
            errors++
        }
    });
    if(errors===0){
        inputFields.forEach(element=>{
            element.disabled = true;
        });
        event.target.innerText=`Sent!`
        document.querySelector("#saveMessage").innerHTML=""
        localStorage.setItem('message', JSON.stringify(sumbitArray));
        submitMessage.innerText='Message is sent, we will get back to you shortly!'

    }else{
        event.target.innerText=`Try again`
        document.querySelector("#contactPage").classList.add("rough")
        submitMessage.innerText='Please correct the errors'
    }
    }
