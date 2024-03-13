export const windowHandling = {
    'mobileMode':"",
    listenChange(){
        this.mobileMode = window.innerWidth<900 ? true : false
        window.addEventListener("resize", ()=>{
            if(window.innerWidth<900 && !this.mobileMode){
                this.mobileMode = true
                console.log('Changing to mobile')
                location.reload();
            }else if (window.innerWidth>900 && this.mobileMode){
                this.mobileMode = false
                console.log('Changing to PC')

                location.reload();
            }
        }); 
    }
}