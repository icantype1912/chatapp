const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

const emailValidator = (x)=>{
    return x.match(emailRegex);
}

const passwordValidator = (x)=>{
    return x.match(passwordRegex)
}

export {emailValidator,passwordValidator}
