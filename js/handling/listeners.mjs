export function resizeCheck(displaySize,width){
    if(displaySize==="mobile" && width>900){

        location.reload();
    }
    if(displaySize==="pc" && width<900){

        location.reload();
    }
}
